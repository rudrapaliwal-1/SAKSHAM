from typing import List, Dict, Any

from ortools.constraint_solver import (
    routing_enums_pb2,
    pywrapcp,
)

from app.repositories.interfaces import VehicleRepositoryInterface
from app.domain.demands.service import DemandService
from app.domain.incidents.service import IncidentService
from app.domain.routing.osrm import OSRMProvider


class RoutingService:
    """
    Handles vehicle route optimization for SAKSHAM.

    Flow:

    Vehicles + Demands
            ↓
       Incident coordinates
            ↓
           OSRM
            ↓
      Distance matrix
            ↓
         OR-Tools
            ↓
    Unit-aware capacity routes
    """

    def __init__(
        self,
        vehicle_repo: VehicleRepositoryInterface,
        demand_service: DemandService,
        incident_service: IncidentService,
        osrm_provider: OSRMProvider | None = None,
    ):
        self.vehicle_repo = vehicle_repo
        self.demand_service = demand_service
        self.incident_service = incident_service
        self.osrm = osrm_provider or OSRMProvider()

    def get_available_vehicles(self):
        vehicles = self.vehicle_repo.list()

        return [
            vehicle
            for vehicle in vehicles
            if vehicle.status.value == "AVAILABLE"
        ]

    def get_pending_demands(self):
        return self.demand_service.list_demands()

    def build_stops(self):
        demands = self.get_pending_demands()

        stops = []

        for demand in demands:
            incident = self.incident_service.get_incident(
                demand.incidentId
            )

            stops.append(
                {
                    "demandId": demand.id,
                    "requestId": demand.requestId,
                    "latitude": incident.latitude,
                    "longitude": incident.longitude,
                    "quantity": demand.quantity,
                    "unit": demand.unit,
                    "priority": demand.priority.value,
                }
            )

        return stops

    def optimize_routes(self):
        """
        Build and optimize routes for available vehicles
        and pending demands.

        Demands are grouped by unit so that quantities such as
        liters and kits are never added together.
        """

        vehicles = self.get_available_vehicles()
        stops = self.build_stops()

        if not vehicles:
            return {
                "status": "NO_VEHICLES",
                "routes": [],
            }

        if not stops:
            return {
                "status": "NO_DEMANDS",
                "routes": [],
            }

        # Normalize units for reliable comparison.
        def normalize_unit(value):
            if value is None:
                return ""

            if hasattr(value, "value"):
                value = value.value

            return str(value).strip().lower()

        # Group demands by their physical unit.
        stops_by_unit: Dict[str, List[Dict[str, Any]]] = {}

        for stop in stops:
            unit = normalize_unit(stop["unit"])
            stops_by_unit.setdefault(unit, []).append(stop)

        # Group vehicles by their capacity unit.
        vehicles_by_unit: Dict[str, List[Dict[str, Any]]] = {}

        for vehicle in vehicles:
            unit = normalize_unit(vehicle.capacityUnit)

            vehicles_by_unit.setdefault(unit, []).append(
                {
                    "vehicleId": vehicle.vehicleId,
                    "capacity": vehicle.capacity,
                    "capacityUnit": vehicle.capacityUnit,
                    "latitude": vehicle.currentLatitude,
                    "longitude": vehicle.currentLongitude,
                }
            )

        all_routes = []
        unassigned_demands = []

        # Solve each physical unit independently.
        for unit, unit_stops in stops_by_unit.items():

            matching_vehicles = vehicles_by_unit.get(unit, [])

            if not matching_vehicles:
                unassigned_demands.extend(
                    stop["requestId"]
                    for stop in unit_stops
                )
                continue

            # Use the first matching vehicle as the depot,
            # consistent with the original implementation.
            depot = (
                matching_vehicles[0]["latitude"],
                matching_vehicles[0]["longitude"],
            )

            locations = [depot]

            locations.extend(
                (
                    stop["latitude"],
                    stop["longitude"],
                )
                for stop in unit_stops
            )

            osrm_result = self.osrm.get_distance_matrix(
                locations
            )

            distance_matrix = osrm_result["distances"]

            routes = self.solve_routes(
                vehicles=matching_vehicles,
                stops=unit_stops,
                distance_matrix=distance_matrix,
            )

            all_routes.extend(routes)

            # Determine which demands were actually assigned.
            assigned_ids = {
                stop["requestId"]
                for route in routes
                for stop in route["stops"]
            }

            for stop in unit_stops:
                if stop["requestId"] not in assigned_ids:
                    unassigned_demands.append(
                        stop["requestId"]
                    )

        result = {
            "status": "ROUTES_FOUND" if all_routes else "NO_FEASIBLE_ROUTES",
            "routes": all_routes,
        }

        if unassigned_demands:
            result["unassignedDemands"] = unassigned_demands

        return result

    def solve_routes(
        self,
        vehicles: List[Dict[str, Any]],
        stops: List[Dict[str, Any]],
        distance_matrix: List[List[int]],
    ) -> List[Dict[str, Any]]:

        if not vehicles or not stops:
            return []

        depot_index = 0
        num_locations = len(distance_matrix)
        num_vehicles = len(vehicles)

        manager = pywrapcp.RoutingIndexManager(
            num_locations,
            num_vehicles,
            depot_index,
        )

        routing = pywrapcp.RoutingModel(manager)

        # -------------------------
        # Distance
        # -------------------------

        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)

            return int(distance_matrix[from_node][to_node])

        distance_callback_index = (
            routing.RegisterTransitCallback(
                distance_callback
            )
        )

        routing.SetArcCostEvaluatorOfAllVehicles(
            distance_callback_index
        )

        # -------------------------
        # Capacity
        # -------------------------

        # All stops passed to this function have the SAME unit.
        loads = [0] + [
            int(stop["quantity"])
            for stop in stops
        ]

        def demand_callback(from_index):
            from_node = manager.IndexToNode(from_index)
            return loads[from_node]

        demand_callback_index = (
            routing.RegisterUnaryTransitCallback(
                demand_callback
            )
        )

        capacities = [
            int(vehicle["capacity"])
            for vehicle in vehicles
        ]

        routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,
            capacities,
            True,
            "Capacity",
        )

        # -------------------------
        # OR-Tools search
        # -------------------------

        search_parameters = (
            pywrapcp.DefaultRoutingSearchParameters()
        )

        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )

        solution = routing.SolveWithParameters(
            search_parameters
        )

        if not solution:
            return []

        # -------------------------
        # Extract routes
        # -------------------------

        routes = []

        for vehicle_index, vehicle in enumerate(vehicles):

            index = routing.Start(vehicle_index)

            route_stops = []
            route_distance = 0
            route_load = 0

            while not routing.IsEnd(index):

                node = manager.IndexToNode(index)

                if node != depot_index:
                    stop = stops[node - 1]

                    route_stops.append(
                        {
                            "demandId": stop["demandId"],
                            "requestId": stop["requestId"],
                            "latitude": stop["latitude"],
                            "longitude": stop["longitude"],
                            "quantity": stop["quantity"],
                            "unit": stop["unit"],
                            "priority": stop["priority"],
                        }
                    )

                    route_load += stop["quantity"]

                previous_index = index

                index = solution.Value(
                    routing.NextVar(index)
                )

                route_distance += (
                    routing.GetArcCostForVehicle(
                        previous_index,
                        index,
                        vehicle_index,
                    )
                )

            if route_stops:
                routes.append(
                    {
                        "vehicleId": vehicle["vehicleId"],
                        "stops": route_stops,
                        "distanceMeters": route_distance,
                        "load": route_load,
                        "capacity": vehicle["capacity"],
                        "capacityUnit": vehicle["capacityUnit"],
                    }
                )

        return routes