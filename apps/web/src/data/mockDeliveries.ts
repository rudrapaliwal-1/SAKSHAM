import type { ReliefDelivery } from '../context/OperationalStateContext';

export const mockDeliveries: ReliefDelivery[] = [
  {
    id: 'DEL-2026-081',
    dispatchId: 'DSP-DEL-041',
    demandId: 'DEM-2026-104',
    incidentId: 'INC-2026-104',
    resourceId: 'RES-NCR-004',
    vehicleId: 'VEH-TRK-101',
    requestedQty: 400,
    allocatedQty: 400,
    deliveredQty: 400,
    unit: 'Units',
    status: 'ARRIVED',
    resourceType: 'Disaster Thermal Blankets',
    destinationName: 'Rohini Sector 15 Municipal Transit Shelter',
    notes: 'Camp superintendent confirmed delivery receipt. Distribution initiated for evacuated families.',
    verifiedBy: 'Officer S. Prasad',
    verifiedAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'DEL-2026-082',
    dispatchId: 'DSP-DEL-042',
    demandId: 'DEM-2026-102',
    incidentId: 'INC-2026-102',
    resourceId: 'RES-NCR-003',
    vehicleId: 'VEH-AMB-204',
    requestedQty: 80,
    allocatedQty: 80,
    deliveredQty: 0,
    unit: 'Kits',
    status: 'IN_DELIVERY',
    resourceType: 'Advanced Trauma Triage Kits',
    destinationName: 'Okhla Phase II Structural Collapse Site',
    notes: 'Ambulance nearing perimeter gate; emergency triage zone prepared.'
  },
  {
    id: 'DEL-2026-080',
    dispatchId: 'DSP-DEL-039',
    demandId: 'DEM-2026-108',
    incidentId: 'INC-2026-104',
    resourceId: 'RES-NCR-008',
    vehicleId: 'VEH-AMB-204',
    requestedQty: 150,
    allocatedQty: 150,
    deliveredQty: 150,
    unit: 'Kits',
    status: 'VERIFIED',
    resourceType: 'Pediatric Care & ORS Packs',
    destinationName: 'Rohini Sector 15 Pediatric Center',
    verifiedBy: 'Dr. Kavita Singhal (CMO)',
    verifiedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    notes: 'All 150 kits inspected, cold chain verified, and handed over to clinic pharmacy.'
  }
];
