from fastapi import APIRouter, Depends

from app.domain.routing.service import RoutingService
from app.api.dependencies import get_routing_service


router = APIRouter()


@router.post(
    "/optimize",
    summary="Optimize disaster relief vehicle routes",
)
async def optimize_routes(
    service: RoutingService = Depends(get_routing_service),
):
    return service.optimize_routes()