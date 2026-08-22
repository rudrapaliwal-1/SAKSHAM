import uuid
from datetime import datetime
from typing import List, Optional, Dict

from app.repositories.interfaces import VehicleRepositoryInterface
from app.schemas.vehicle import (
    VehicleResponse,
    VehicleCreate,
    VehicleUpdate,
    VehicleStatus,
)


class InMemoryVehicleRepository(VehicleRepositoryInterface):

    def __init__(self):
        self._db: Dict[str, VehicleResponse] = {}

        vehicles = [
            (
                "VEH-IND-001",
                "Mumbai Rescue Truck",
                "Rescue Truck",
                15000,
                "Liters",
                19.0728,
                72.8826,
                55,
                "NDRF Maharashtra",
                "NDRF-MH-01",
            ),
            (
                "VEH-IND-002",
                "Mumbai Medical Van",
                "Ambulance",
                300,
                "Kits",
                19.1197,
                72.8468,
                60,
                "Civil Defence Maharashtra",
                "MED-MH-01",
            ),
            (
                "VEH-IND-003",
                "Guwahati Rescue Truck",
                "Rescue Truck",
                20000,
                "Liters",
                26.1445,
                91.7362,
                50,
                "NDRF Assam",
                "NDRF-AS-01",
            ),
            (
                "VEH-IND-004",
                "Guwahati Supply Truck",
                "Supply Truck",
                8000,
                "Packets",
                26.1158,
                91.7086,
                55,
                "Assam Civil Defence",
                "AS-SUP-01",
            ),
            (
                "VEH-IND-005",
                "Chennai Relief Truck",
                "Supply Truck",
                18000,
                "Liters",
                13.0827,
                80.2707,
                55,
                "NDRF Tamil Nadu",
                "NDRF-TN-01",
            ),
            (
                "VEH-IND-006",
                "Chennai Rescue Boat",
                "Boat",
                12000,
                "Liters",
                13.0475,
                80.2824,
                35,
                "Tamil Nadu Disaster Response",
                "TN-BOAT-01",
            ),
            (
                "VEH-IND-007",
                "Kolkata Rescue Truck",
                "Rescue Truck",
                16000,
                "Liters",
                22.5726,
                88.3639,
                50,
                "NDRF West Bengal",
                "NDRF-WB-01",
            ),
            (
                "VEH-IND-008",
                "Kolkata Supply Truck",
                "Supply Truck",
                7000,
                "Packets",
                22.5958,
                88.2636,
                55,
                "West Bengal Civil Defence",
                "WB-SUP-01",
            ),
            (
                "VEH-IND-009",
                "Bengaluru Ambulance",
                "Ambulance",
                250,
                "Kits",
                12.9716,
                77.5946,
                65,
                "Karnataka Emergency Medical",
                "MED-KA-01",
            ),
            (
                "VEH-IND-010",
                "Hyderabad Ambulance",
                "Ambulance",
                400,
                "Kits",
                17.3850,
                78.4867,
                65,
                "Telangana Emergency Medical",
                "MED-TS-01",
            ),
            (
                "VEH-IND-011",
                "Ahmedabad Rescue Truck",
                "Rescue Truck",
                500,
                "Kits",
                23.0225,
                72.5714,
                55,
                "Gujarat Emergency Response",
                "GJ-RES-01",
            ),
            (
                "VEH-IND-012",
                "Patna Rescue Boat",
                "Boat",
                25000,
                "Liters",
                25.5941,
                85.1376,
                30,
                "NDRF Bihar",
                "NDRF-BR-01",
            ),
            (
                "VEH-IND-013",
                "Patna Supply Truck",
                "Supply Truck",
                12000,
                "Packets",
                25.6100,
                85.1410,
                50,
                "Bihar Civil Defence",
                "BR-SUP-01",
            ),
            (
                "VEH-IND-014",
                "Jaipur Medical Van",
                "Ambulance",
                300,
                "Kits",
                26.9124,
                75.7873,
                65,
                "Rajasthan Emergency Medical",
                "MED-RJ-01",
            ),
            (
                "VEH-IND-015",
                "Dehradun Rescue Truck",
                "Rescue Truck",
                5000,
                "Packets",
                30.3165,
                78.0322,
                45,
                "NDRF Uttarakhand",
                "NDRF-UK-01",
            ),
            (
                "VEH-IND-016",
                "Dehradun Ambulance",
                "Ambulance",
                200,
                "Kits",
                30.3165,
                78.0322,
                55,
                "Uttarakhand Emergency Medical",
                "MED-UK-01",
            ),
            (
                "VEH-IND-017",
                "Srinagar Supply Truck",
                "Supply Truck",
                4000,
                "Packets",
                34.0837,
                74.7973,
                45,
                "NDRF J&K",
                "NDRF-JK-01",
            ),
            (
                "VEH-IND-018",
                "Srinagar Ambulance",
                "Ambulance",
                150,
                "Kits",
                34.0837,
                74.7973,
                55,
                "J&K Emergency Medical",
                "MED-JK-01",
            ),
            (
                "VEH-IND-019",
                "Bhubaneswar Rescue Boat",
                "Boat",
                20000,
                "Liters",
                20.2961,
                85.8245,
                30,
                "NDRF Odisha",
                "NDRF-OD-01",
            ),
            (
                "VEH-IND-020",
                "Bhubaneswar Supply Truck",
                "Supply Truck",
                10000,
                "Packets",
                20.2961,
                85.8245,
                50,
                "Odisha Civil Defence",
                "OD-SUP-01",
            ),
        ]

        for (
            vehicle_id,
            name,
            vehicle_type,
            capacity,
            capacity_unit,
            latitude,
            longitude,
            speed,
            operator,
            radio,
        ) in vehicles:

            veh_id = str(uuid.uuid4())

            self._db[veh_id] = VehicleResponse(
                id=veh_id,
                vehicleId=vehicle_id,
                name=name,
                type=vehicle_type,
                capacity=float(capacity),
                capacityUnit=capacity_unit,
                currentLatitude=latitude,
                currentLongitude=longitude,
                speed=float(speed),
                operatorName=operator,
                contactRadio=radio,
                status=VehicleStatus.AVAILABLE,
                currentMission=None,
                createdAt=datetime.now(),
                updatedAt=datetime.now(),
            )

    def get_by_id(
        self,
        vehicle_id: str,
    ) -> Optional[VehicleResponse]:
        return self._db.get(vehicle_id)

    def get_by_ref(
        self,
        ref: str,
    ) -> Optional[VehicleResponse]:
        for veh in self._db.values():
            if veh.vehicleId == ref:
                return veh

        return None

    def list(self) -> List[VehicleResponse]:
        return list(self._db.values())

    def create(
        self,
        vehicle: VehicleCreate,
    ) -> VehicleResponse:

        veh_id = str(uuid.uuid4())

        new_veh = VehicleResponse(
            id=veh_id,
            vehicleId=f"VEH-{vehicle.type[:2].upper()}-{len(self._db) + 301:03d}",
            status=VehicleStatus.AVAILABLE,
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
            **vehicle.model_dump(),
        )

        self._db[veh_id] = new_veh

        return new_veh

    def update(
        self,
        vehicle_id: str,
        update_data: VehicleUpdate,
    ) -> Optional[VehicleResponse]:

        if vehicle_id not in self._db:
            return None

        existing = self._db[vehicle_id]

        updated_dict = existing.model_dump()

        for key, value in update_data.model_dump(
            exclude_unset=True
        ).items():
            updated_dict[key] = value

        updated_dict["updatedAt"] = datetime.now()

        updated = VehicleResponse(**updated_dict)

        self._db[vehicle_id] = updated

        return updated


# Global singleton repository
vehicle_repo = InMemoryVehicleRepository()