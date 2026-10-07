import type { DispatchMission } from '../context/OperationalStateContext';

export const mockMissions: DispatchMission[] = [
  {
    id: 'DSP-DEL-041',
    requestId: 'DEM-2026-104',
    vehicleId: 'VEH-TRK-101',
    status: 'EN_ROUTE',
    destinationName: 'Rohini Sector 15 Transit Shelter',
    resourceType: 'Disaster Thermal Blankets',
    quantity: 400,
    unit: 'Units',
    etaMinutes: 18,
    operatorName: 'Havildar Rajesh Tanwar',
    speedKmh: 48,
    distanceKm: 14.2,
    signalStrength: 94,
    fuelPct: 82,
    trafficLevel: 'MODERATE',
    routePath: ['Golf Links Depot', 'Ring Road Bypass', 'Outer Ring Road', 'Rohini Sec 15'],
    alertMessage: 'Heavy traffic near Punjabi Bagh flyover; alternate route via Inner Ring Road active.',
    timeline: [
      { time: '17:15', title: 'MISSION ASSIGNED', done: true },
      { time: '17:25', title: 'DEPOT PICKUP COMPLETED', done: true },
      { time: '17:35', title: 'DISPATCHED & EN ROUTE', done: true },
      { time: '17:53', title: 'ESTIMATED ARRIVAL', done: false }
    ]
  },
  {
    id: 'DSP-DEL-042',
    requestId: 'DEM-2026-102',
    vehicleId: 'VEH-AMB-204',
    status: 'DISPATCHED',
    destinationName: 'Okhla Phase II Structural Collapse Site',
    resourceType: 'Advanced Trauma Triage Kits',
    quantity: 80,
    unit: 'Kits',
    etaMinutes: 14,
    operatorName: 'Paramedic Dr. Neha Verma',
    speedKmh: 55,
    distanceKm: 11.5,
    signalStrength: 98,
    fuelPct: 91,
    trafficLevel: 'LOW',
    routePath: ['AIIMS Safdarjung', 'Barapullah Elevated Corridor', 'Mathura Road', 'Okhla Phase II'],
    timeline: [
      { time: '17:30', title: 'MISSION ASSIGNED', done: true },
      { time: '17:38', title: 'CARGO LOADED & VERIFIED', done: true },
      { time: '17:42', title: 'SIREN DISPATCH CONFIRMED', done: true },
      { time: '17:56', title: 'ESTIMATED ARRIVAL', done: false }
    ]
  },
  {
    id: 'DSP-DEL-043',
    requestId: 'DEM-2026-106',
    vehicleId: 'VEH-BOT-302',
    status: 'EN_ROUTE',
    destinationName: 'Kashmiri Gate Lowlands / Old Yamuna Bridge',
    resourceType: 'Inflatable Rescue Boats & Evacuation Gear',
    quantity: 4,
    unit: 'Boats',
    etaMinutes: 8,
    operatorName: 'Sgt. Rakesh Kumar',
    speedKmh: 28,
    distanceKm: 5.4,
    signalStrength: 89,
    fuelPct: 75,
    trafficLevel: 'LOW',
    routePath: ['Geeta Colony Station', 'Yamuna River Upstream Passage', 'Kashmiri Gate Ghat'],
    timeline: [
      { time: '17:40', title: 'WATERWAY DISPATCH AUTHORIZED', done: true },
      { time: '17:44', title: 'EN ROUTE VIA YAMUNA EMBANKMENT', done: true },
      { time: '17:52', title: 'ESTIMATED WATERWAY REACH', done: false }
    ]
  }
];
