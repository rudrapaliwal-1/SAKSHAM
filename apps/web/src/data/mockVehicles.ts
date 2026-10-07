import type { Vehicle } from '../types/vehicle';

export const mockVehicles: Vehicle[] = [
  {
    id: 'VEH-TRK-101',
    name: 'Heavy Logistics Truck 101',
    type: 'TRUCK',
    capacity: '10 Tons (8,000 Units)',
    status: 'EN_ROUTE',
    location: { lat: 28.6500, lng: 77.1800 },
    destination: { lat: 28.7180, lng: 77.1290 },
    cargo: '400 Disaster Thermal Blankets',
    driverName: 'Havildar Rajesh Tanwar',
    driverContact: '+91-98710-11223',
    speedKmh: 48,
    incidentId: 'INC-2026-104',
    etaMinutes: 18,
    teamName: 'LOGISTICS-ALPHA'
  },
  {
    id: 'VEH-AMB-204',
    name: 'Advanced Life Support Ambulance 204',
    type: 'AMBULANCE',
    capacity: '4 Patients + Triage Kits',
    status: 'DISPATCHED',
    location: { lat: 28.5672, lng: 77.2100 },
    destination: { lat: 28.5355, lng: 77.2732 },
    cargo: '80 Advanced Trauma Triage Kits',
    driverName: 'Paramedic Dr. Neha Verma',
    driverContact: '+91-98103-99882',
    speedKmh: 55,
    incidentId: 'INC-2026-102',
    etaMinutes: 14,
    teamName: 'MEDICAL-BRAVO'
  },
  {
    id: 'VEH-BOT-302',
    name: 'Motorized Flood Rescue Boat 302',
    type: 'RESCUE_BOAT',
    capacity: '12 Persons + 500 Kg Supplies',
    status: 'EN_ROUTE',
    location: { lat: 28.6580, lng: 77.2550 },
    destination: { lat: 28.6692, lng: 77.2315 },
    cargo: 'Search & Inundation Evacuation Gear',
    driverName: 'Sgt. Rakesh Kumar (NDRF Boatmaster)',
    driverContact: '+91-98110-33441',
    speedKmh: 28,
    incidentId: 'INC-2026-101',
    etaMinutes: 8,
    teamName: 'WATER-RESCUE-CHARLIE'
  },
  {
    id: 'VEH-DRN-401',
    name: 'Aerial Recon & Medical Drone 401',
    type: 'DRONE',
    capacity: '15 Kg Emergency Payload',
    status: 'AVAILABLE',
    location: { lat: 28.6304, lng: 77.2177 },
    driverName: 'Drone Pilot Sanjay Mehta',
    driverContact: '+91-98991-22334',
    speedKmh: 0,
    teamName: 'RECON-DELTA'
  },
  {
    id: 'VEH-TRK-105',
    name: 'High-Capacity Water Bowser 105',
    type: 'TRUCK',
    capacity: '12,000 Liters Potable Water',
    status: 'AVAILABLE',
    location: { lat: 28.5720, lng: 77.0680 },
    driverName: 'Driver Vikram Singh',
    driverContact: '+91-98119-44556',
    speedKmh: 0,
    teamName: 'WATER-SUPPLY-ECHO'
  },
  {
    id: 'VEH-SUV-501',
    name: 'Field Disaster Assessment SUV 501',
    type: 'SUV',
    capacity: '6 Assessment Officers',
    status: 'AVAILABLE',
    location: { lat: 28.6145, lng: 77.2090 },
    driverName: 'Inspector Deepa Rawat',
    driverContact: '+91-98771-55667',
    speedKmh: 0,
    teamName: 'RAPID-ASSESSMENT-FOXTROT'
  }
];
