import React, { useState, useEffect } from 'react';
import { useOperationalState } from '../../context/OperationalStateContext';
import styles from './Vehicles.module.css';
import { PageGuideTrigger, PageGuidebook } from '../../components/ui/PageGuide';
import { ShaderBackground } from '../../components/ui/ShaderBackground';
import { Plus, X } from 'lucide-react';

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  TRUCK: 'TRUCK',
  AMBULANCE: 'AMBULANCE',
  HELICOPTER: 'HELICOPTER',
  RESCUE_BOAT: 'RESCUE BOAT',
  DRONE: 'DRONE',
  SUV: 'SUV'
};

const STATUS_DISPLAY: Record<string, string> = {
  EN_ROUTE: 'EN ROUTE',
  DISPATCHED: 'DISPATCHED',
  AVAILABLE: 'AVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
  RETURNING: 'RETURNING',
  ARRIVED: 'ARRIVED',
};

export const Vehicles: React.FC = () => {
  const { vehicles, addVehicle, updateVehicleStatus } = useOperationalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Add vehicle modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('TRUCK');
  const [formCapacity, setFormCapacity] = useState('8 Tons (6,000 Units)');
  const [formDriverName, setFormDriverName] = useState('Havildar Anil Kumar');
  const [formDriverContact, setFormDriverContact] = useState('+91-98711-88990');
  const [formTeamName, setFormTeamName] = useState('LOGISTICS-RESERVE');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const filteredVehicles = vehicles.filter(veh => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      veh.name.toLowerCase().includes(q) ||
      veh.driverName.toLowerCase().includes(q) ||
      veh.id.toLowerCase().includes(q) ||
      veh.type.toLowerCase().includes(q) ||
      (veh.cargo && veh.cargo.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'ALL' || veh.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || veh.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;

  const statusCounts = {
    total: vehicles.length,
    enRoute: vehicles.filter(v => v.status === 'EN_ROUTE').length,
    dispatched: vehicles.filter(v => v.status === 'DISPATCHED').length,
    available: vehicles.filter(v => v.status === 'AVAILABLE').length,
    critical: vehicles.filter(v => v.status === 'DISPATCHED' || v.status === 'EN_ROUTE').length,
  };

  const statusPills = ['ALL', 'AVAILABLE', 'EN_ROUTE', 'DISPATCHED', 'MAINTENANCE'];
  const typePills = ['ALL', 'TRUCK', 'AMBULANCE', 'HELICOPTER', 'RESCUE_BOAT', 'DRONE', 'SUV'];

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDriverName.trim()) return;

    addVehicle({
      name: formName,
      type: formType as any,
      capacity: formCapacity,
      location: { lat: 28.6139 + (Math.random() - 0.5) * 0.1, lng: 77.2090 + (Math.random() - 0.5) * 0.1 },
      driverName: formDriverName,
      driverContact: formDriverContact,
      teamName: formTeamName
    });

    setIsModalOpen(false);
    setFormName('');
  };

  return (
    <div className={`${styles.container} ${mounted ? styles.mounted : ''}`}>

      <header className={`${styles.pageHeader} shaderHeaderWrapper`}>
        <ShaderBackground className="absolute inset-0" />
        <div className={styles.headerTitles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className={styles.eyebrow} style={{ marginBottom: 0 }}>FLEET &amp; RESPONDER OPERATIONS</span>
            <PageGuideTrigger />
          </div>
          <h1 className={`${styles.title} reveal-block`} data-reveal-color="#3B82F6">Logistics &amp; Responder Fleet</h1>
          <p className={styles.lead}>Live telematics, convoy tracking, cargo capacity, and driver communications across emergency response vehicles.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.liveStatus}>
            <span className={styles.liveDot} />
            <span className={styles.liveLabel}>FLEET NETWORK LIVE</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#2563EB',
              border: 'none',
              color: '#FAF8F3',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '8px 14px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Plus size={13} />
            <span>REGISTER FLEET UNIT</span>
          </button>
        </div>
      </header>

      {/* ── 2. Summary Strip ── */}
      <div className={styles.statsStrip}>
        <div className={styles.statCell}>
          <span className={styles.statNum}>{String(statusCounts.total).padStart(2, '0')}</span>
          <span className={styles.statLabel}>UNITS TRACKED</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.warningAccent}`}>{String(statusCounts.enRoute).padStart(2, '0')}</span>
          <span className={styles.statLabel}>EN ROUTE</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.dispatchAccent}`}>{String(statusCounts.dispatched).padStart(2, '0')}</span>
          <span className={styles.statLabel}>DISPATCHED</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.successAccent}`}>{String(statusCounts.available).padStart(2, '0')}</span>
          <span className={styles.statLabel}>AVAILABLE</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.criticalAccent}`}>{String(statusCounts.critical).padStart(2, '0')}</span>
          <span className={styles.statLabel}>ON MISSION</span>
        </div>
      </div>

      {/* ── 3. Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by vehicle name, ID, driver, or cargo..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterGroups}>
          <div className={styles.filterPills}>
            {statusPills.map(s => (
              <button
                key={s}
                className={`${styles.filterPill} ${statusFilter === s ? styles.filterPillActive : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? 'ALL STATUSES' : s}
              </button>
            ))}
          </div>
          <div className={styles.pillDivider} />
          <div className={styles.filterPills}>
            {typePills.map(tKey => (
              <button
                key={tKey}
                className={`${styles.filterPill} ${typeFilter === tKey ? styles.filterPillActive : ''}`}
                onClick={() => setTypeFilter(tKey)}
              >
                {tKey === 'ALL' ? 'ALL TYPES' : tKey.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Main Split Workspace ── */}
      <div className={styles.splitWorkspace}>

        {/* Left: Fleet Registry */}
        <div className={styles.registryColumn}>
          {filteredVehicles.length === 0 ? (
            <div className={styles.emptyState}>
              <TruckIcon />
              <p>No matching fleet vehicles found.</p>
            </div>
          ) : (
            <div className={styles.fleetList}>
              {filteredVehicles.map((veh, i) => {
                const isSelected = veh.id === selectedVehicleId;
                return (
                  <div
                    key={veh.id}
                    className={`${styles.fleetUnit} ${isSelected ? styles.fleetUnitSelected : ''}`}
                    style={{ animationDelay: `${i * 70}ms` }}
                    onClick={() => setSelectedVehicleId(isSelected ? null : veh.id)}
                  >
                    <div className={styles.unitTop}>
                      <span className={`${styles.unitStatus} ${styles['vStatus_' + veh.status]}`}>
                        {veh.status === 'EN_ROUTE' || veh.status === 'DISPATCHED' ? (
                          <span className={styles.statusPulse} />
                        ) : null}
                        {STATUS_DISPLAY[veh.status] || veh.status}
                      </span>
                      <span className={styles.unitType}>
                        {VEHICLE_TYPE_LABELS[veh.type] || veh.type}
                      </span>
                    </div>

                    <div className={styles.unitBody}>
                      <span className={styles.unitId}>{veh.id}</span>
                      <span className={styles.unitName}>{veh.name}</span>
                    </div>

                    <div className={styles.unitFooter}>
                      <div className={styles.driverInfo}>
                        <span className={styles.driverLabel}>OPERATOR</span>
                        <span className={styles.driverName}>{veh.driverName}</span>
                      </div>
                      <div className={styles.capInfo}>
                        <span className={styles.capLabel}>CAPACITY</span>
                        <span className={styles.capValue}>{veh.capacity}</span>
                      </div>
                    </div>

                    {veh.cargo && (
                      <div className={styles.unitCargo}>
                        <span className={styles.cargoLabel}>CARGO:</span>
                        <span className={styles.cargoText}>{veh.cargo}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Inspection Ledger */}
        <div className={styles.ledgerColumn}>
          <ShaderBackground style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />
          {selectedVehicle ? (
            <div className={styles.ledgerContent}>

              <div className={styles.ledgerHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.ledgerMetaRow}>
                    <span className="tech-code font-bold" style={{ color: '#FAF8F3' }}>{selectedVehicle.id}</span>
                    <span className={`${styles.unitStatus} ${styles['vStatus_' + selectedVehicle.status]}`}>
                      {STATUS_DISPLAY[selectedVehicle.status] || selectedVehicle.status}
                    </span>
                  </div>
                  <h3 className={styles.ledgerTitle}>{selectedVehicle.name}</h3>
                  <span className={styles.ledgerTypeTag}>{selectedVehicle.type}</span>
                </div>
                <button className={styles.closeBtn} onClick={() => setSelectedVehicleId(null)}>
                  ✕
                </button>
              </div>

              <div className={styles.ledgerSection}>
                <h4 className={styles.sectionTitle}>CREW &amp; TELEMETRY</h4>
                <div className={styles.specGrid}>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>DESIGNATED OPERATOR</span>
                    <span className={styles.specVal}>{selectedVehicle.driverName}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>RADIO COMMS / CONTACT</span>
                    <span className={styles.specVal}>{selectedVehicle.driverContact}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>PAYLOAD RATING</span>
                    <span className={styles.specVal}>{selectedVehicle.capacity}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>ASSIGNED TEAM</span>
                    <span className={styles.specVal}>{selectedVehicle.teamName || 'COMMAND-HQ'}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>CURRENT COORDINATES</span>
                    <span className="tech-code" style={{ color: '#FAF8F3' }}>
                      {selectedVehicle.location.lat.toFixed(4)}° N, {selectedVehicle.location.lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>
              </div>

              {selectedVehicle.cargo && (
                <div className={styles.ledgerSection}>
                  <h4 className={styles.sectionTitle}>ACTIVE CARGO LOAD</h4>
                  <div style={{
                    padding: '12px 14px',
                    background: 'rgba(232, 111, 22, 0.1)',
                    border: '1px solid rgba(232, 111, 22, 0.3)',
                    borderRadius: '4px',
                    color: '#FAF8F3',
                    fontSize: '12px'
                  }}>
                    {selectedVehicle.cargo}
                  </div>
                </div>
              )}

              <div className={styles.ledgerSection}>
                <h4 className={styles.sectionTitle}>STATUS OVERRIDE</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['AVAILABLE', 'EN_ROUTE', 'ARRIVED', 'MAINTENANCE'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateVehicleStatus(selectedVehicle.id, st)}
                      style={{
                        padding: '6px 12px',
                        background: selectedVehicle.status === st ? '#E86F16' : 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: selectedVehicle.status === st ? '#0B2119' : '#FAF8F3',
                        fontWeight: 700,
                        fontSize: '11px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className={styles.emptyLedger}>
              <TruckIcon />
              <h4>FLEET LEDGER</h4>
              <p>Select any vehicle from the registry to inspect live telemetry, crew contact, payload capacity, and mission history.</p>
            </div>
          )}
        </div>

      </div>

      {/* ── Add Vehicle Modal ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0B2119',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '540px',
            padding: '24px',
            color: '#FAF8F3',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#3B82F6' }}>REGISTER FLEET VEHICLE</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FAF8F3', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>VEHICLE / UNIT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Logistics Truck 108, ALS Ambulance 209"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>VEHICLE TYPE</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0B2119', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  >
                    <option value="TRUCK">TRUCK</option>
                    <option value="AMBULANCE">AMBULANCE</option>
                    <option value="RESCUE_BOAT">RESCUE BOAT</option>
                    <option value="HELICOPTER">HELICOPTER</option>
                    <option value="DRONE">DRONE</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>CAPACITY</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 Tons, 4 Patients, 12 Persons"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>OPERATOR / DRIVER NAME *</label>
                  <input
                    type="text"
                    required
                    value={formDriverName}
                    onChange={(e) => setFormDriverName(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>RADIO / CONTACT</label>
                  <input
                    type="text"
                    required
                    value={formDriverContact}
                    onChange={(e) => setFormDriverContact(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ASSIGNED TEAM NAME</label>
                <input
                  type="text"
                  value={formTeamName}
                  onChange={(e) => setFormTeamName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#FAF8F3', borderRadius: '4px', cursor: 'pointer' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', background: '#2563EB', border: 'none', color: '#FAF8F3', fontWeight: 800, borderRadius: '4px', cursor: 'pointer' }}
                >
                  REGISTER UNIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PageGuidebook guideKey="vehicles" />
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const TruckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export default Vehicles;
