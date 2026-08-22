import uuid
from datetime import datetime
from typing import List, Optional, Dict

from app.repositories.interfaces import DemandRepositoryInterface
from app.repositories.memory.incident_repository import incident_repo
from app.schemas.demand import (
    DemandResponse,
    DemandCreate,
    DemandUpdate,
    DemandStatus,
    DemandPriority,
)


class InMemoryDemandRepository(DemandRepositoryInterface):

    def __init__(self):
        self._db: Dict[str, DemandResponse] = {}

        demands = [
            (
                "INC-IND-001",
                "REQ-IND-001",
                "Mumbai Flood Relief Zone",
                "WATER",
                "Drinking water for flood affected families.",
                15000,
                "Liters",
                2500,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-001",
                "REQ-IND-002",
                "Mumbai Flood Relief Zone",
                "MEDICAL",
                "Emergency medical kits.",
                300,
                "Kits",
                900,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-002",
                "REQ-IND-003",
                "Guwahati Flood Relief Zone",
                "WATER",
                "Drinking water for displaced residents.",
                20000,
                "Liters",
                3000,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-002",
                "REQ-IND-004",
                "Guwahati Flood Relief Zone",
                "FOOD",
                "Emergency food packets.",
                5000,
                "Packets",
                3000,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-003",
                "REQ-IND-005",
                "Chennai Coastal Zone",
                "WATER",
                "Emergency drinking water.",
                12000,
                "Liters",
                2000,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-003",
                "REQ-IND-006",
                "Chennai Coastal Zone",
                "SHELTER",
                "Temporary shelter capacity.",
                600,
                "People",
                600,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-004",
                "REQ-IND-007",
                "Kolkata Flood Zone",
                "WATER",
                "Drinking water supply.",
                14000,
                "Liters",
                2200,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-004",
                "REQ-IND-008",
                "Kolkata Flood Zone",
                "FOOD",
                "Food packets for affected families.",
                4000,
                "Packets",
                2200,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-005",
                "REQ-IND-009",
                "Bengaluru Fire Zone",
                "MEDICAL",
                "Trauma and first aid kits.",
                250,
                "Kits",
                700,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-006",
                "REQ-IND-010",
                "Hyderabad Emergency Zone",
                "MEDICAL",
                "Emergency medical supplies.",
                400,
                "Kits",
                1100,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-007",
                "REQ-IND-011",
                "Ahmedabad Industrial Zone",
                "MEDICAL",
                "Burn treatment and trauma kits.",
                350,
                "Kits",
                1000,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-008",
                "REQ-IND-012",
                "Patna Flood Zone",
                "WATER",
                "Large scale drinking water requirement.",
                25000,
                "Liters",
                4000,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-008",
                "REQ-IND-013",
                "Patna Flood Zone",
                "FOOD",
                "Emergency food packets.",
                7000,
                "Packets",
                4000,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-009",
                "REQ-IND-014",
                "Jaipur Heat Response Zone",
                "WATER",
                "Drinking water and electrolyte supply.",
                10000,
                "Liters",
                900,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-010",
                "REQ-IND-015",
                "Dehradun Landslide Zone",
                "FOOD",
                "Emergency food supplies.",
                2500,
                "Packets",
                1200,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-010",
                "REQ-IND-016",
                "Dehradun Landslide Zone",
                "MEDICAL",
                "Emergency medical kits.",
                200,
                "Kits",
                700,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-011",
                "REQ-IND-017",
                "Srinagar Landslide Zone",
                "FOOD",
                "Emergency food supplies.",
                1800,
                "Packets",
                900,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-011",
                "REQ-IND-018",
                "Srinagar Landslide Zone",
                "MEDICAL",
                "Trauma and emergency medical kits.",
                150,
                "Kits",
                500,
                DemandPriority.HIGH,
            ),
            (
                "INC-IND-012",
                "REQ-IND-019",
                "Bhubaneswar Cyclone Zone",
                "WATER",
                "Drinking water for evacuated communities.",
                18000,
                "Liters",
                3500,
                DemandPriority.CRITICAL,
            ),
            (
                "INC-IND-012",
                "REQ-IND-020",
                "Bhubaneswar Cyclone Zone",
                "SHELTER",
                "Emergency shelter requirement.",
                1000,
                "People",
                1000,
                DemandPriority.CRITICAL,
            ),
        ]

        for (
            incident_ref,
            request_id,
            affected_zone,
            requested_type,
            description,
            quantity,
            unit,
            affected_people,
            priority,
        ) in demands:

            incident = incident_repo.get_by_ref(incident_ref)

            if not incident:
                continue

            dem_id = str(uuid.uuid4())

            self._db[dem_id] = DemandResponse(
                id=dem_id,
                requestId=request_id,
                incidentId=incident.id,
                affectedZone=affected_zone,
                requestedType=requested_type,
                description=description,
                quantity=float(quantity),
                unit=unit,
                affectedPeople=affected_people,
                priority=priority,
                status=DemandStatus.PENDING,
                requiredBy=datetime.now(),
                createdAt=datetime.now(),
                updatedAt=datetime.now(),
            )

    def get_by_id(
        self,
        demand_id: str,
    ) -> Optional[DemandResponse]:
        return self._db.get(demand_id)

    def get_by_ref(
        self,
        ref: str,
    ) -> Optional[DemandResponse]:
        for dem in self._db.values():
            if dem.requestId == ref:
                return dem

        return None

    def list(
        self,
        incident_id: Optional[str] = None,
    ) -> List[DemandResponse]:

        results = list(self._db.values())

        if incident_id:
            results = [
                r for r in results
                if r.incidentId == incident_id
            ]

        return results

    def create(
        self,
        demand: DemandCreate,
    ) -> DemandResponse:

        dem_id = str(uuid.uuid4())

        new_dem = DemandResponse(
            id=dem_id,
            requestId=f"REQ-DEL-{len(self._db) + 101:03d}",
            status=DemandStatus.PENDING,
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
            **demand.model_dump(),
        )

        self._db[dem_id] = new_dem

        return new_dem

    def update(
        self,
        demand_id: str,
        update_data: DemandUpdate,
    ) -> Optional[DemandResponse]:

        if demand_id not in self._db:
            return None

        existing = self._db[demand_id]

        updated_dict = existing.model_dump()

        for key, value in update_data.model_dump(
            exclude_unset=True
        ).items():
            updated_dict[key] = value

        updated_dict["updatedAt"] = datetime.now()

        updated = DemandResponse(**updated_dict)

        self._db[demand_id] = updated

        return updated


# Global singleton repository
demand_repo = InMemoryDemandRepository()