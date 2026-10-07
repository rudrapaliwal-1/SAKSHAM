import type { Incident } from '../types/incident';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-101',
    type: 'FLOOD',
    severity: 'CRITICAL',
    location: 'Yamuna Riverbank & Kashmiri Gate Ghats, North Delhi',
    coordinates: { lat: 28.6692, lng: 77.2315 },
    time: new Date(Date.now() - 42 * 60000).toISOString(),
    status: 'UNDER_RESPONSE',
    assignedTeam: 'NDRF Unit 8 (Battalion 4)',
    description: 'Yamuna water level crossed danger mark (208.66m). Ring Road embankment overflow submerged low-lying slums and transport depot.',
    reporterName: 'Inspector Rajesh Verma (Delhi Police)',
    reporterContact: '+91-98110-44210',
    casualtiesCount: 0,
    displacedCount: 1450,
    reportedAt: new Date(Date.now() - 42 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    source: 'NORTH COMMAND DESK',
    peopleAffected: 3200,
    requiredResources: [
      { itemNeeded: 'Drinking Water (15L Cans)', quantity: 5000, unit: 'Liters', priority: 'CRITICAL' },
      { itemNeeded: 'Motorized Inflatable Rescue Boats', quantity: 4, unit: 'Boats', priority: 'CRITICAL' },
      { itemNeeded: 'Emergency Dry Rations', quantity: 2000, unit: 'Packets', priority: 'HIGH' }
    ],
    timeline: [
      { time: '18:15', title: 'INCIDENT REPORTED', description: 'Civilian & police calls confirmed breach of Yamuna embankment near Old Railway Bridge.' },
      { time: '18:25', title: 'INCIDENT VERIFIED', description: 'Aerial drone reconnaissance confirmed flooding in Kashmiri Gate Ring Road pocket.' },
      { time: '18:32', title: 'PRIORITY ASSIGNED', description: 'Severity escalated to CRITICAL due to rapid water ingress and high population density.' },
      { time: '18:45', title: 'UNITS DISPATCHED', description: 'Logistics vehicle VEH-BOT-302 and NDRF rescue team dispatched from Geeta Colony.' }
    ]
  },
  {
    id: 'INC-2026-102',
    type: 'STRUCTURAL_COLLAPSE',
    severity: 'CRITICAL',
    location: 'Okhla Industrial Area Phase-II, South-East Delhi',
    coordinates: { lat: 28.5355, lng: 77.2732 },
    time: new Date(Date.now() - 75 * 60000).toISOString(),
    status: 'RESOURCE_MATCHED',
    assignedTeam: 'Delhi Fire Service & Disaster Response 3',
    description: '3-story industrial warehouse building collapsed during foundation reinforcement work. Multiple workers trapped under concrete slabs.',
    reporterName: 'Supervisor Sunita Negi (Okhla Industrial Association)',
    reporterContact: '+91-98711-20988',
    casualtiesCount: 4,
    displacedCount: 80,
    reportedAt: new Date(Date.now() - 75 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    source: 'DFS EMERGENCY DISPATCH',
    peopleAffected: 120,
    requiredResources: [
      { itemNeeded: 'Advanced Trauma Triage Kits', quantity: 80, unit: 'Kits', priority: 'CRITICAL' },
      { itemNeeded: 'Heavy Hydraulic Cutters & Spreaders', quantity: 6, unit: 'Sets', priority: 'CRITICAL' }
    ],
    timeline: [
      { time: '17:45', title: 'INCIDENT REPORTED', description: 'Emergency call received reporting structure collapse at Plot 44-B Okhla Phase II.' },
      { time: '17:52', title: 'INCIDENT VERIFIED', description: 'Local PCR van confirmed heavy debris with trapped personnel.' },
      { time: '18:05', title: 'RESOURCE MATCHED', description: 'Matched trauma kits from AIIMS Disaster Depot and DFS hydraulic equipment.' }
    ]
  },
  {
    id: 'INC-2026-103',
    type: 'FLOOD',
    severity: 'HIGH',
    location: 'Mayur Vihar Extension & Yamuna Khadar, East Delhi',
    coordinates: { lat: 28.5910, lng: 77.2980 },
    time: new Date(Date.now() - 110 * 60000).toISOString(),
    status: 'PRIORITIZED',
    assignedTeam: 'Civil Defence Quick Reaction Force 2',
    description: 'Backflow in stormwater drain caused inundation of temporary farm settlements. 300+ families evacuated to raised flood embankments.',
    reporterName: 'Ward Councillor Manoj Sharma',
    reporterContact: '+91-99580-33120',
    casualtiesCount: 0,
    displacedCount: 650,
    reportedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    source: 'DISTRICT MAGISTRATE (EAST)',
    peopleAffected: 950,
    requiredResources: [
      { itemNeeded: 'Emergency Dry Rations', quantity: 1200, unit: 'Packets', priority: 'HIGH' },
      { itemNeeded: 'Disaster Thermal Blankets', quantity: 600, unit: 'Units', priority: 'HIGH' }
    ],
    timeline: [
      { time: '17:10', title: 'INCIDENT REPORTED', description: 'Flood wardens reported water ingress in low-lying farmland shelters.' },
      { time: '17:30', title: 'PRIORITY ASSIGNED', description: 'Assigned HIGH severity for urgent ration and shelter supply mobilization.' }
    ]
  },
  {
    id: 'INC-2026-104',
    type: 'MEDICAL_EMERGENCY',
    severity: 'HIGH',
    location: 'Rohini Sector 15 Transit Shelter, North-West Delhi',
    coordinates: { lat: 28.7180, lng: 77.1290 },
    time: new Date(Date.now() - 140 * 60000).toISOString(),
    status: 'DISPATCHED',
    assignedTeam: 'Directorate of Health Services Medical Van 6',
    description: 'Water-borne gastrointestinal outbreak reported among 45 children and elderly refugees at the municipal school transit camp.',
    reporterName: 'Dr. Kavita Singhal (Camp Medical Officer)',
    reporterContact: '+91-97170-88450',
    casualtiesCount: 0,
    displacedCount: 420,
    reportedAt: new Date(Date.now() - 140 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    source: 'CHIEF MEDICAL OFFICER',
    peopleAffected: 510,
    requiredResources: [
      { itemNeeded: 'Pediatric Care & ORS Packs', quantity: 150, unit: 'Kits', priority: 'CRITICAL' },
      { itemNeeded: 'Purified Drinking Water', quantity: 2500, unit: 'Liters', priority: 'HIGH' }
    ],
    timeline: [
      { time: '16:40', title: 'INCIDENT REPORTED', description: 'Medical officer flagged urgent need for rehydration fluids and antibiotic kits.' },
      { time: '17:00', title: 'UNITS DISPATCHED', description: 'Ambulance & medical logistics unit dispatched with pediatric pharmaceuticals.' }
    ]
  },
  {
    id: 'INC-2026-105',
    type: 'RESOURCE_SHORTAGE',
    severity: 'MEDIUM',
    location: 'Karol Bagh Market & Ajmal Khan Road, Central Delhi',
    coordinates: { lat: 28.6517, lng: 77.1906 },
    time: new Date(Date.now() - 180 * 60000).toISOString(),
    status: 'VERIFIED',
    assignedTeam: 'Central Delhi Municipal Logistics Unit',
    description: 'Local transformer explosion and storm runoff submerged commercial sub-stations causing total black-out and water purification outage.',
    reporterName: 'Market Welfare Secretary Harpreet Singh',
    reporterContact: '+91-98102-67100',
    casualtiesCount: 0,
    displacedCount: 0,
    reportedAt: new Date(Date.now() - 180 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    source: 'POLICE CONTROL ROOM',
    peopleAffected: 380,
    requiredResources: [
      { itemNeeded: 'Portable Water Purification Units', quantity: 50, unit: 'Units', priority: 'MEDIUM' },
      { itemNeeded: 'Diesel Generators (25kVA)', quantity: 2, unit: 'Units', priority: 'MEDIUM' }
    ],
    timeline: [
      { time: '16:00', title: 'INCIDENT REPORTED', description: 'Power grid tripping and drinking water pump shutdown logged.' },
      { time: '16:20', title: 'INCIDENT VERIFIED', description: 'Municipal engineer verified electrical isolation and pump failure.' }
    ]
  },
  {
    id: 'INC-2026-106',
    type: 'FIRE',
    severity: 'LOW',
    location: 'Bawana Industrial Sector 3, North-West Delhi',
    coordinates: { lat: 28.7950, lng: 77.0398 },
    time: new Date(Date.now() - 240 * 60000).toISOString(),
    status: 'RESOLVED',
    assignedTeam: 'Bawana Fire Station Team 1',
    description: 'Minor chemical storage shed fire extinguished. Cooling operations completed and peripheral area declared safe for re-entry.',
    reporterName: 'Station Officer R. K. Malik',
    reporterContact: '+91-98115-99201',
    casualtiesCount: 0,
    displacedCount: 15,
    reportedAt: new Date(Date.now() - 240 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    source: 'DELHI FIRE SERVICE',
    peopleAffected: 45,
    requiredResources: [],
    timeline: [
      { time: '15:00', title: 'INCIDENT REPORTED', description: 'Smoke reported from packaging material shed.' },
      { time: '15:30', title: 'UNITS DISPATCHED', description: '3 fire tenders mobilized to scene.' },
      { time: '16:45', title: 'INCIDENT RESOLVED', description: 'Fire fully doused. Air quality monitors show normal limits.' }
    ]
  }
];
