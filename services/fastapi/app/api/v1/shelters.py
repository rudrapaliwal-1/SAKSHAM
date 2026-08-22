from fastapi import APIRouter

router = APIRouter()

# Temporary operational shelter registry.
# This is intentionally India-wide so the frontend can
# operate across multiple regions instead of Delhi only.

SHELTERS = [
    {
        "id": "SH-DEL-001",
        "shelterId": "SH-DEL-001",
        "name": "Delhi Emergency Relief Shelter",
        "location": "New Delhi, Delhi",
        "region": "Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "capacity": 5000,
        "occupied": 1200,
        "status": "OPERATIONAL",
    },
    {
        "id": "SH-MUM-001",
        "shelterId": "SH-MUM-001",
        "name": "Mumbai Emergency Relief Shelter",
        "location": "Mumbai, Maharashtra",
        "region": "Maharashtra",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "capacity": 6000,
        "occupied": 1800,
        "status": "OPERATIONAL",
    },
    {
        "id": "SH-KOL-001",
        "shelterId": "SH-KOL-001",
        "name": "Kolkata Emergency Relief Shelter",
        "location": "Kolkata, West Bengal",
        "region": "West Bengal",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "capacity": 4500,
        "occupied": 900,
        "status": "OPERATIONAL",
    },
    {
        "id": "SH-CHN-001",
        "shelterId": "SH-CHN-001",
        "name": "Chennai Emergency Relief Shelter",
        "location": "Chennai, Tamil Nadu",
        "region": "Tamil Nadu",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "capacity": 4000,
        "occupied": 700,
        "status": "OPERATIONAL",
    },
    {
        "id": "SH-GUW-001",
        "shelterId": "SH-GUW-001",
        "name": "Guwahati Flood Relief Shelter",
        "location": "Guwahati, Assam",
        "region": "Assam",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "capacity": 3500,
        "occupied": 1600,
        "status": "OPERATIONAL",
    },
    {
        "id": "SH-AHM-001",
        "shelterId": "SH-AHM-001",
        "name": "Ahmedabad Emergency Relief Shelter",
        "location": "Ahmedabad, Gujarat",
        "region": "Gujarat",
        "latitude": 23.0225,
        "longitude": 72.5714,
        "capacity": 4000,
        "occupied": 800,
        "status": "OPERATIONAL",
    },
    {
        "id": "SH-BLR-001",
        "shelterId": "SH-BLR-001",
        "name": "Bengaluru Emergency Relief Shelter",
        "location": "Bengaluru, Karnataka",
        "region": "Karnataka",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "capacity": 4000,
        "occupied": 600,
        "status": "OPERATIONAL",
    },
    {
        "id": "SH-HYD-001",
        "shelterId": "SH-HYD-001",
        "name": "Hyderabad Emergency Relief Shelter",
        "location": "Hyderabad, Telangana",
        "region": "Telangana",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "capacity": 4000,
        "occupied": 750,
        "status": "OPERATIONAL",
    },
]


@router.get("")
def list_shelters(
    status: str | None = None,
    region: str | None = None,
):
    shelters = SHELTERS

    if status:
        shelters = [
            shelter
            for shelter in shelters
            if shelter["status"].upper() == status.upper()
        ]

    if region:
        shelters = [
            shelter
            for shelter in shelters
            if shelter["region"].lower() == region.lower()
        ]

    return shelters


@router.get("/{shelter_id}")
def get_shelter(shelter_id: str):
    for shelter in SHELTERS:
        if shelter["id"] == shelter_id or shelter["shelterId"] == shelter_id:
            return shelter

    return {"detail": "Shelter not found"}