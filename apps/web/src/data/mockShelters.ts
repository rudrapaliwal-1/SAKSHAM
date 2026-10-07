import type { Shelter } from '../types/shelter';

export const mockShelters: Shelter[] = [
  {
    id: 'SHL-DEL-01',
    name: 'Akshardham Mega Relief Center',
    locationName: 'Commonwealth Games Village Grounds, Mayur Vihar Phase 1',
    coordinates: { lat: 28.6120, lng: 77.2770 },
    capacityTotal: 1200,
    capacityOccupied: 1080,
    status: 'FULL',
    contactPerson: 'ADM Ritu Malhotra',
    contactNumber: '+91-98110-77112',
    resourcesAvailable: ['Potable Water Tankers', 'Medical Triage Post', 'Community Kitchen', 'Child Care Space']
  },
  {
    id: 'SHL-DEL-02',
    name: 'Dwarka Indoor Disaster Transit Complex',
    locationName: 'Sector 10 DDA Sports Complex, Dwarka',
    coordinates: { lat: 28.5820, lng: 77.0580 },
    capacityTotal: 800,
    capacityOccupied: 320,
    status: 'OPEN',
    contactPerson: 'Capt. Sunil Nair',
    contactNumber: '+91-98711-66221',
    resourcesAvailable: ['Safe Water', 'Bedding & Blankets', 'Sanitation Facilities', 'Solar Power Backup']
  },
  {
    id: 'SHL-DEL-03',
    name: 'Rohini Sector 15 Municipal Transit Shelter',
    locationName: 'Government Senior Secondary School, Sector 15 Rohini',
    coordinates: { lat: 28.7180, lng: 77.1290 },
    capacityTotal: 600,
    capacityOccupied: 510,
    status: 'FULL',
    contactPerson: 'Principal B. K. Pandey',
    contactNumber: '+91-98102-44119',
    resourcesAvailable: ['Emergency Water', 'Cooked Meals', 'First Aid Station']
  },
  {
    id: 'SHL-DEL-04',
    name: 'Civil Lines Central Relief Camp',
    locationName: 'Old Secretariat Grounds, 5 Sham Nath Marg, Civil Lines',
    coordinates: { lat: 28.6820, lng: 77.2180 },
    capacityTotal: 500,
    capacityOccupied: 110,
    status: 'OPEN',
    contactPerson: 'SDM Alok Vashisth',
    contactNumber: '+91-99100-33887',
    resourcesAvailable: ['Clean Water', 'Medical Dispensary', 'Emergency Communication Station', 'Dry Rations']
  }
];
