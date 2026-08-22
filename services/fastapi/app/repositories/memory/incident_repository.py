import uuid
from datetime import datetime
from typing import List, Optional, Dict

from app.repositories.interfaces import IncidentRepositoryInterface
from app.schemas.incident import (
    IncidentResponse,
    IncidentCreate,
    IncidentUpdate,
    IncidentStatus,
)
from app.schemas.common import Severity


class InMemoryIncidentRepository(IncidentRepositoryInterface):

    def __init__(self):
        self._db: Dict[str, IncidentResponse] = {}

        incidents = [
            {
                "incidentId": "INC-IND-001",
                "title": "Mumbai Urban Flood",
                "description": "Heavy rainfall causing flooding in low-lying areas of Mumbai.",
                "type": "FLOOD",
                "location": "Kurla, Mumbai, Maharashtra",
                "latitude": 19.0728,
                "longitude": 72.8826,
                "region": "Maharashtra",
                "severity": Severity.CRITICAL,
                "affectedPeople": 5000,
                "displacedPeople": 1200,
                "assignedUnit": "NDRF Maharashtra",
            },

            {
                "incidentId": "INC-IND-002",
                "title": "Guwahati Flood",
                "description": "River overflow and heavy rainfall affecting residential areas.",
                "type": "FLOOD",
                "location": "Guwahati, Assam",
                "latitude": 26.1445,
                "longitude": 91.7362,
                "region": "Assam",
                "severity": Severity.CRITICAL,
                "affectedPeople": 4200,
                "displacedPeople": 950,
                "assignedUnit": "NDRF Assam",
            },

            {
                "incidentId": "INC-IND-003",
                "title": "Chennai Cyclone Alert",
                "description": "Cyclonic weather affecting coastal districts of Chennai.",
                "type": "CYCLONE",
                "location": "Chennai, Tamil Nadu",
                "latitude": 13.0827,
                "longitude": 80.2707,
                "region": "Tamil Nadu",
                "severity": Severity.HIGH,
                "affectedPeople": 3500,
                "displacedPeople": 700,
                "assignedUnit": "NDRF Tamil Nadu",
            },

            {
                "incidentId": "INC-IND-004",
                "title": "Kolkata Flood",
                "description": "Urban flooding reported in multiple low-lying areas.",
                "type": "FLOOD",
                "location": "Kolkata, West Bengal",
                "latitude": 22.5726,
                "longitude": 88.3639,
                "region": "West Bengal",
                "severity": Severity.HIGH,
                "affectedPeople": 2800,
                "displacedPeople": 600,
                "assignedUnit": "NDRF West Bengal",
            },

            {
                "incidentId": "INC-IND-005",
                "title": "Bengaluru Urban Fire",
                "description": "Major commercial building fire requiring emergency response.",
                "type": "FIRE",
                "location": "Bengaluru, Karnataka",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "region": "Karnataka",
                "severity": Severity.HIGH,
                "affectedPeople": 850,
                "displacedPeople": 180,
                "assignedUnit": "Fire & Emergency Karnataka",
            },

            {
                "incidentId": "INC-IND-006",
                "title": "Hyderabad Medical Emergency",
                "description": "Large number of casualties reported following a local emergency.",
                "type": "MEDICAL_EMERGENCY",
                "location": "Hyderabad, Telangana",
                "latitude": 17.3850,
                "longitude": 78.4867,
                "region": "Telangana",
                "severity": Severity.HIGH,
                "affectedPeople": 1100,
                "displacedPeople": 250,
                "assignedUnit": "Telangana Emergency Medical Team",
            },

            {
                "incidentId": "INC-IND-007",
                "title": "Ahmedabad Industrial Fire",
                "description": "Industrial fire requiring evacuation and fire response.",
                "type": "FIRE",
                "location": "Ahmedabad, Gujarat",
                "latitude": 23.0225,
                "longitude": 72.5714,
                "region": "Gujarat",
                "severity": Severity.CRITICAL,
                "affectedPeople": 1400,
                "displacedPeople": 400,
                "assignedUnit": "Gujarat Emergency Response",
            },

            {
                "incidentId": "INC-IND-008",
                "title": "Patna Flood",
                "description": "Flooding affecting residential zones near the Ganga basin.",
                "type": "FLOOD",
                "location": "Patna, Bihar",
                "latitude": 25.5941,
                "longitude": 85.1376,
                "region": "Bihar",
                "severity": Severity.CRITICAL,
                "affectedPeople": 6200,
                "displacedPeople": 1500,
                "assignedUnit": "NDRF Bihar",
            },

            {
                "incidentId": "INC-IND-009",
                "title": "Jaipur Heat Emergency",
                "description": "Extreme heat conditions causing dehydration and medical emergencies.",
                "type": "MEDICAL_EMERGENCY",
                "location": "Jaipur, Rajasthan",
                "latitude": 26.9124,
                "longitude": 75.7873,
                "region": "Rajasthan",
                "severity": Severity.MEDIUM,
                "affectedPeople": 900,
                "displacedPeople": 100,
                "assignedUnit": "Rajasthan Medical Response",
            },

            {
                "incidentId": "INC-IND-010",
                "title": "Dehradun Landslide",
                "description": "Landslide blocking roads and isolating nearby communities.",
                "type": "LANDSLIDE",
                "location": "Dehradun, Uttarakhand",
                "latitude": 30.3165,
                "longitude": 78.0322,
                "region": "Uttarakhand",
                "severity": Severity.CRITICAL,
                "affectedPeople": 1800,
                "displacedPeople": 450,
                "assignedUnit": "NDRF Uttarakhand",
            },

            {
                "incidentId": "INC-IND-011",
                "title": "Srinagar Landslide",
                "description": "Mountain road disruption caused by landslide activity.",
                "type": "LANDSLIDE",
                "location": "Srinagar, Jammu & Kashmir",
                "latitude": 34.0837,
                "longitude": 74.7973,
                "region": "Jammu & Kashmir",
                "severity": Severity.HIGH,
                "affectedPeople": 1200,
                "displacedPeople": 300,
                "assignedUnit": "NDRF J&K",
            },

            {
                "incidentId": "INC-IND-012",
                "title": "Bhubaneswar Cyclone",
                "description": "Cyclonic storm affecting coastal Odisha.",
                "type": "CYCLONE",
                "location": "Bhubaneswar, Odisha",
                "latitude": 20.2961,
                "longitude": 85.8245,
                "region": "Odisha",
                "severity": Severity.CRITICAL,
                "affectedPeople": 4800,
                "displacedPeople": 1300,
                "assignedUnit": "NDRF Odisha",
            },
        ]

        for item in incidents:
            inc_id = str(uuid.uuid4())

            self._db[inc_id] = IncidentResponse(
                id=inc_id,
                incidentId=item["incidentId"],
                title=item["title"],
                description=item["description"],
                type=item["type"],
                location=item["location"],
                latitude=item["latitude"],
                longitude=item["longitude"],
                region=item["region"],
                severity=item["severity"],
                status=IncidentStatus.REPORTED,
                affectedPeople=item["affectedPeople"],
                displacedPeople=item["displacedPeople"],
                assignedUnit=item["assignedUnit"],
                reportedAt=datetime.now(),
                createdAt=datetime.now(),
                updatedAt=datetime.now(),
            )

    def get_by_id(self, incident_id: str) -> Optional[IncidentResponse]:
        return self._db.get(incident_id)

    def get_by_ref(self, ref: str) -> Optional[IncidentResponse]:
        for inc in self._db.values():
            if inc.incidentId == ref:
                return inc
        return None

    def list(self) -> List[IncidentResponse]:
        return list(self._db.values())

    def create(self, incident: IncidentCreate) -> IncidentResponse:
        inc_id = str(uuid.uuid4())

        new_inc = IncidentResponse(
            id=inc_id,
            incidentId=f"INC-2026-{len(self._db) + 1:03d}",
            status=IncidentStatus.REPORTED,
            reportedAt=datetime.now(),
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
            **incident.model_dump(),
        )

        self._db[inc_id] = new_inc
        return new_inc

    def update(
        self,
        incident_id: str,
        update_data: IncidentUpdate,
    ) -> Optional[IncidentResponse]:

        if incident_id not in self._db:
            return None

        existing = self._db[incident_id]
        updated_dict = existing.model_dump()

        for key, value in update_data.model_dump(
            exclude_unset=True
        ).items():
            updated_dict[key] = value

        updated_dict["updatedAt"] = datetime.now()

        updated = IncidentResponse(**updated_dict)

        self._db[incident_id] = updated

        return updated


incident_repo = InMemoryIncidentRepository()
