from app.domain.routing.service import RoutingService
from app.repositories.memory.vehicle_repository import vehicle_repo


routing_service = RoutingService(vehicle_repo)

vehicles = routing_service.get_available_vehicles()

print("Available vehicles:")

for vehicle in vehicles:
    print(
        vehicle.vehicleId,
        "|",
        vehicle.type,
        "| Capacity:",
        vehicle.capacity,
        vehicle.capacityUnit,
        "| Location:",
        vehicle.currentLatitude,
        vehicle.currentLongitude,
    )