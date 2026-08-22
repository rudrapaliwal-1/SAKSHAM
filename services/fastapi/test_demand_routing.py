from app.domain.routing.service import RoutingService
from app.repositories.memory.vehicle_repository import vehicle_repo
from app.repositories.memory.demand_repository import demand_repo
from app.domain.demands.service import DemandService


demand_service = DemandService(demand_repo)

routing_service = RoutingService(
    vehicle_repo,
    demand_service,
)

demands = routing_service.get_pending_demands()

print("SAKSHAM demands:")

for demand in demands:
    print(
        demand.requestId,
        "|",
        demand.requestedType,
        "| Quantity:",
        demand.quantity,
        demand.unit,
        "| Priority:",
        demand.priority.value,
        "| Status:",
        demand.status.value,
    )