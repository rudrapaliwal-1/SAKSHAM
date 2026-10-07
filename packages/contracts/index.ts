/**
 * SAKSHAM Unified Disaster Response Data Contracts
 * Shared across frontend apps, backend microservices, and optimization engines.
 */

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentType =
  | 'FLOOD'
  | 'FIRE'
  | 'EARTHQUAKE'
  | 'MEDICAL_EMERGENCY'
  | 'STRUCTURAL_COLLAPSE'
  | 'RESOURCE_SHORTAGE';

export type IncidentStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'PRIORITIZED'
  | 'RESOURCE_MATCHED'
  | 'DISPATCHED'
  | 'UNDER_RESPONSE'
  | 'RESOLVED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export type ResourceCategory =
  | 'WATER'
  | 'FOOD'
  | 'MEDICAL'
  | 'SHELTER_SUPPLIES'
  | 'CLOTHING'
  | 'RESCUE_EQUIPMENT'
  | 'VEHICLES'
  | 'OTHER';

export type ResourceStatus = 'AVAILABLE' | 'LOW' | 'RESERVED' | 'IN_TRANSIT' | 'DEPLOYED' | 'DEPLETED';

export type VehicleType = 'TRUCK' | 'AMBULANCE' | 'HELICOPTER' | 'RESCUE_BOAT' | 'DRONE' | 'SUV';

export type VehicleStatus = 'AVAILABLE' | 'ASSIGNED' | 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED' | 'RETURNING' | 'MAINTENANCE';

export type RequestPriority = Severity;

export type RequestStatus =
  | 'PENDING'
  | 'OPEN'
  | 'MATCHING'
  | 'MATCHED'
  | 'ALLOCATED'
  | 'DISPATCHED'
  | 'FULFILLING'
  | 'DELIVERING'
  | 'FULFILLED'
  | 'PARTIALLY_FULFILLED'
  | 'UNFULFILLED'
  | 'CANCELLED';

export type ShelterStatus = 'OPEN' | 'FULL' | 'CLOSED';
