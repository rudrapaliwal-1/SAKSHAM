export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  result: string;
  type: 'VERIFY' | 'PRIORITIZE' | 'MATCH' | 'DISPATCH' | 'DELIVERY' | 'RESOLVE' | 'SYSTEM';
}

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    actor: 'Officer S. Prasad (Command Desk)',
    action: 'Verified Delivery & Handover',
    target: 'DEL-2026-081 (400 Thermal Blankets)',
    result: 'Status -> VERIFIED · Demand DEM-2026-104 Fulfilled',
    type: 'DELIVERY'
  },
  {
    id: 'LOG-002',
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    actor: 'Logistics Coord. Vikram Seth',
    action: 'Dispatched Fleet Unit',
    target: 'VEH-TRK-101 -> Rohini Sector 15 Shelter',
    result: 'Mission DSP-DEL-041 En Route (ETA 18 min)',
    type: 'DISPATCH'
  },
  {
    id: 'LOG-003',
    timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
    actor: 'Duty Officer Meenakshi Rao',
    action: 'Approved Optimization Match',
    target: 'DEM-2026-102 (Trauma Kits) -> RES-NCR-003',
    result: '80 Units Allocated from AIIMS Stockpile',
    type: 'MATCH'
  },
  {
    id: 'LOG-004',
    timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
    actor: 'Senior Response Commander A. K. Verma',
    action: 'Escalated Incident Severity',
    target: 'INC-2026-101 (Kashmiri Gate Flood)',
    result: 'Severity -> CRITICAL (Breach Verified)',
    type: 'PRIORITIZE'
  },
  {
    id: 'LOG-005',
    timestamp: new Date(Date.now() - 75 * 60000).toISOString(),
    actor: 'Civilian Field Intake / Automated SOS',
    action: 'SOS Report Ingested',
    target: 'INC-2026-102 (Okhla Industrial Collapse)',
    result: 'Incident Created & Dispatched to DFS',
    type: 'SYSTEM'
  }
];
