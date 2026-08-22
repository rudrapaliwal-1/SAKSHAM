import uuid
from datetime import datetime
from typing import List, Optional, Dict

from app.repositories.interfaces import ResourceRepositoryInterface
from app.schemas.resource import (
    ResourceResponse,
    ResourceCreate,
    ResourceUpdate,
    ResourceStatus,
)


class InMemoryResourceRepository(ResourceRepositoryInterface):

    def __init__(self):
        self._db: Dict[str, ResourceResponse] = {}

        resources = [
            (
                "RES-IND-001",
                "Mumbai Water Depot",
                "Clean Drinking Water",
                "Emergency drinking water supply.",
                "WATER",
                30000,
                "Liters",
                "Mumbai Relief Depot",
                "Kurla, Mumbai",
                19.0728,
                72.8826,
            ),
            (
                "RES-IND-002",
                "Mumbai Medical Hub",
                "Emergency Medical Kits",
                "Emergency trauma and medical supplies.",
                "MEDICAL",
                800,
                "Kits",
                "Mumbai Health Hub",
                "Andheri, Mumbai",
                19.1197,
                72.8468,
            ),
            (
                "RES-IND-003",
                "Guwahati Relief Depot",
                "Clean Drinking Water",
                "Emergency water supply.",
                "WATER",
                35000,
                "Liters",
                "Assam Relief Depot",
                "Guwahati, Assam",
                26.1445,
                91.7362,
            ),
            (
                "RES-IND-004",
                "Guwahati Food Depot",
                "Emergency Food Packets",
                "Food supplies for displaced families.",
                "FOOD",
                10000,
                "Packets",
                "Assam Food Depot",
                "Guwahati, Assam",
                26.1158,
                91.7086,
            ),
            (
                "RES-IND-005",
                "Chennai Relief Depot",
                "Clean Drinking Water",
                "Emergency water supply.",
                "WATER",
                25000,
                "Liters",
                "Tamil Nadu Relief Depot",
                "Chennai, Tamil Nadu",
                13.0827,
                80.2707,
            ),
            (
                "RES-IND-006",
                "Chennai Shelter Hub",
                "Emergency Shelter Capacity",
                "Temporary shelter resources.",
                "SHELTER",
                1500,
                "People",
                "Chennai Shelter Hub",
                "Chennai, Tamil Nadu",
                13.0674,
                80.2376,
            ),
            (
                "RES-IND-007",
                "Kolkata Relief Depot",
                "Clean Drinking Water",
                "Emergency water supply.",
                "WATER",
                28000,
                "Liters",
                "West Bengal Relief Depot",
                "Kolkata, West Bengal",
                22.5726,
                88.3639,
            ),
            (
                "RES-IND-008",
                "Kolkata Food Depot",
                "Emergency Food Packets",
                "Emergency food supplies.",
                "FOOD",
                9000,
                "Packets",
                "West Bengal Food Depot",
                "Kolkata, West Bengal",
                22.5958,
                88.2636,
            ),
            (
                "RES-IND-009",
                "Bengaluru Medical Hub",
                "Emergency Medical Kits",
                "Trauma and first aid kits.",
                "MEDICAL",
                700,
                "Kits",
                "Karnataka Health Hub",
                "Bengaluru, Karnataka",
                12.9716,
                77.5946,
            ),
            (
                "RES-IND-010",
                "Hyderabad Medical Hub",
                "Emergency Medical Kits",
                "Emergency medical supplies.",
                "MEDICAL",
                1000,
                "Kits",
                "Telangana Health Hub",
                "Hyderabad, Telangana",
                17.3850,
                78.4867,
            ),
            (
                "RES-IND-011",
                "Ahmedabad Medical Hub",
                "Burn Treatment Kits",
                "Emergency burn and trauma supplies.",
                "MEDICAL",
                800,
                "Kits",
                "Gujarat Health Hub",
                "Ahmedabad, Gujarat",
                23.0225,
                72.5714,
            ),
            (
                "RES-IND-012",
                "Patna Water Depot",
                "Clean Drinking Water",
                "Emergency drinking water.",
                "WATER",
                40000,
                "Liters",
                "Bihar Relief Depot",
                "Patna, Bihar",
                25.5941,
                85.1376,
            ),
            (
                "RES-IND-013",
                "Patna Food Depot",
                "Emergency Food Packets",
                "Food supplies for flood victims.",
                "FOOD",
                15000,
                "Packets",
                "Bihar Food Depot",
                "Patna, Bihar",
                25.6100,
                85.1410,
            ),
            (
                "RES-IND-014",
                "Jaipur Water Depot",
                "Water & Electrolytes",
                "Emergency hydration supplies.",
                "WATER",
                22000,
                "Liters",
                "Rajasthan Relief Depot",
                "Jaipur, Rajasthan",
                26.9124,
                75.7873,
            ),
            (
                "RES-IND-015",
                "Dehradun Food Depot",
                "Emergency Food Packets",
                "Emergency food supplies.",
                "FOOD",
                6000,
                "Packets",
                "Uttarakhand Relief Depot",
                "Dehradun, Uttarakhand",
                30.3165,
                78.0322,
            ),
            (
                "RES-IND-016",
                "Dehradun Medical Hub",
                "Emergency Medical Kits",
                "Trauma and medical kits.",
                "MEDICAL",
                600,
                "Kits",
                "Uttarakhand Health Hub",
                "Dehradun, Uttarakhand",
                30.3165,
                78.0322,
            ),
            (
                "RES-IND-017",
                "Srinagar Food Depot",
                "Emergency Food Packets",
                "Emergency food supplies.",
                "FOOD",
                4500,
                "Packets",
                "J&K Relief Depot",
                "Srinagar, J&K",
                34.0837,
                74.7973,
            ),
            (
                "RES-IND-018",
                "Srinagar Medical Hub",
                "Emergency Medical Kits",
                "Emergency trauma supplies.",
                "MEDICAL",
                500,
                "Kits",
                "J&K Health Hub",
                "Srinagar, J&K",
                34.0837,
                74.7973,
            ),
            (
                "RES-IND-019",
                "Bhubaneswar Water Depot",
                "Clean Drinking Water",
                "Cyclone emergency water supply.",
                "WATER",
                35000,
                "Liters",
                "Odisha Relief Depot",
                "Bhubaneswar, Odisha",
                20.2961,
                85.8245,
            ),
            (
                "RES-IND-020",
                "Bhubaneswar Shelter Hub",
                "Emergency Shelter",
                "Temporary cyclone shelter capacity.",
                "SHELTER",
                2500,
                "People",
                "Odisha Shelter Hub",
                "Bhubaneswar, Odisha",
                20.2961,
                85.8245,
            ),
        ]

        for (
            resource_id,
            depot,
            material,
            description,
            category,
            quantity,
            unit,
            storage_depot,
            location,
            latitude,
            longitude,
        ) in resources:

            res_id = str(uuid.uuid4())

            self._db[res_id] = ResourceResponse(
                id=res_id,
                resourceId=resource_id,
                materialName=material,
                description=description,
                category=category,
                availableQuantity=float(quantity),
                reservedQuantity=0.0,
                unit=unit,
                storageDepot=storage_depot,
                location=location,
                latitude=latitude,
                longitude=longitude,
                status=ResourceStatus.AVAILABLE,
                pointOfContact="Regional Emergency Operations Centre",
                lastUpdated=datetime.now(),
                createdAt=datetime.now(),
                updatedAt=datetime.now(),
            )

    def get_by_id(
        self,
        resource_id: str,
    ) -> Optional[ResourceResponse]:
        return self._db.get(resource_id)

    def get_by_ref(
        self,
        ref: str,
    ) -> Optional[ResourceResponse]:
        for res in self._db.values():
            if res.resourceId == ref:
                return res

        return None

    def list(
        self,
        category: Optional[str] = None,
    ) -> List[ResourceResponse]:

        results = list(self._db.values())

        if category:
            results = [
                r for r in results
                if r.category == category
            ]

        return results

    def create(
        self,
        resource: ResourceCreate,
    ) -> ResourceResponse:

        res_id = str(uuid.uuid4())

        new_res = ResourceResponse(
            id=res_id,
            resourceId=f"RES-{resource.category[:2].upper()}-{len(self._db) + 1:03d}",
            status=ResourceStatus.AVAILABLE,
            lastUpdated=datetime.now(),
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
            **resource.model_dump(),
        )

        self._db[res_id] = new_res

        return new_res

    def update(
        self,
        resource_id: str,
        update_data: ResourceUpdate,
    ) -> Optional[ResourceResponse]:

        if resource_id not in self._db:
            return None

        existing = self._db[resource_id]

        updated_dict = existing.model_dump()

        for key, value in update_data.model_dump(
            exclude_unset=True
        ).items():
            updated_dict[key] = value

        available = updated_dict["availableQuantity"]
        reserved = updated_dict["reservedQuantity"]

        if available - reserved <= 0:
            updated_dict["status"] = ResourceStatus.DEPLETED

        elif reserved > 0 and available - reserved > 0:
            updated_dict["status"] = ResourceStatus.LOW

        else:
            updated_dict["status"] = ResourceStatus.AVAILABLE

        updated_dict["lastUpdated"] = datetime.now()
        updated_dict["updatedAt"] = datetime.now()

        updated = ResourceResponse(**updated_dict)

        self._db[resource_id] = updated

        return updated


# Global singleton repository
resource_repo = InMemoryResourceRepository()