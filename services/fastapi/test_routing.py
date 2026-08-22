from app.domain.routing.service import RoutingService


service = RoutingService()

vehicles = [
    {
        "vehicleId": "VEH-001",
        "capacity": 100,
    }
]

stops = [
    {
        "demandId": "DEMAND-001",
        "latitude": 28.63,
        "longitude": 77.21,
        "quantity": 30,
    },
    {
        "demandId": "DEMAND-002",
        "latitude": 28.64,
        "longitude": 77.22,
        "quantity": 40,
    },
]

# Node 0 = depot
# Node 1 = demand 1
# Node 2 = demand 2
distance_matrix = [
    [0, 10, 20],
    [10, 0, 15],
    [20, 15, 0],
]

routes = service.solve_routes(
    vehicles=vehicles,
    stops=stops,
    distance_matrix=distance_matrix,
)

print("Optimized routes:")
print(routes)