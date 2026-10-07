import React, { useState, useEffect } from 'react';
import { useOperationalState } from '../../context/OperationalStateContext';
import styles from './Shelters.module.css';
import { PageGuideTrigger, PageGuidebook } from '../../components/ui/PageGuide';
import { ShaderBackground } from '../../components/ui/ShaderBackground';
import { Plus, X } from 'lucide-react';

const STATUS_DISPLAY: Record<string, string> = {
  OPEN: 'OPEN',
  FULL: 'NEAR CAPACITY',
  CLOSED: 'CLOSED',
};

export const Shelters: React.FC = () => {
  const { shelters, addShelter } = useOperationalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Register Shelter Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formLocationName, setFormLocationName] = useState('');
  const [formCapacityTotal, setFormCapacityTotal] = useState('500');
  const [formContactPerson, setFormContactPerson] = useState('ADM Ritu Malhotra');
  const [formContactNumber, setFormContactNumber] = useState('+91-98110-77112');
  const [formFacilities, setFormFacilities] = useState('Safe Water, Medical Triage, Hot Food, Sanitation');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const filteredShelters = shelters.filter(shl => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      shl.name.toLowerCase().includes(q) ||
      shl.locationName.toLowerCase().includes(q) ||
      shl.id.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || shl.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedShelter = shelters.find(s => s.id === selectedShelterId) || null;

  // Stats
  const totalCapacity = shelters.reduce((a, s) => a + s.capacityTotal, 0);
  const totalOccupied = shelters.reduce((a, s) => a + s.capacityOccupied, 0);
  const networkPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const openCount = shelters.filter(s => s.status === 'OPEN').length;
  const nearCapacity = shelters.filter(s => {
    const pct = s.capacityTotal > 0 ? s.capacityOccupied / s.capacityTotal : 0;
    return pct >= 0.85;
  }).length;
  const closedCount = shelters.filter(s => s.status === 'CLOSED').length;

  const statusPills = ['ALL', 'OPEN', 'FULL', 'CLOSED'];

  const handleCreateShelter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocationName.trim()) return;

    addShelter({
      name: formName,
      locationName: formLocationName,
      coordinates: { lat: 28.6139 + (Math.random() - 0.5) * 0.1, lng: 77.2090 + (Math.random() - 0.5) * 0.1 },
      capacityTotal: parseInt(formCapacityTotal) || 500,
      capacityOccupied: 0,
      contactPerson: formContactPerson,
      contactNumber: formContactNumber,
      resourcesAvailable: formFacilities.split(',').map(f => f.trim()).filter(Boolean)
    });

    setIsModalOpen(false);
    setFormName('');
    setFormLocationName('');
  };

  return (
    <div className={`${styles.container} ${mounted ? styles.mounted : ''}`}>

      <header className={`${styles.pageHeader} shaderHeaderWrapper`}>
        <ShaderBackground className="absolute inset-0" />
        <div className={styles.headerTitles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className={styles.eyebrow} style={{ marginBottom: 0 }}>SHELTER &amp; SAFE HAVEN NETWORK</span>
            <PageGuideTrigger />
          </div>
          <h1 className={`${styles.title} reveal-block`} data-reveal-color="#059669">Emergency Shelter Network</h1>
          <p className={styles.lead}>Monitor safe shelter capacities, bed occupancy, hot meal services, and medical triage facilities across Delhi NCR.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.liveStatus}>
            <span className={styles.liveDot} />
            <span className={styles.liveLabel}>SHELTER NETWORK LIVE</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#059669',
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
            <span>REGISTER SHELTER</span>
          </button>
        </div>
      </header>

      {/* ── 2. Summary Strip ── */}
      <div className={styles.statsStrip}>
        <div className={styles.statCell}>
          <span className={styles.statNum}>{String(shelters.length).padStart(2, '0')}</span>
          <span className={styles.statLabel}>ACTIVE FACILITIES</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.warningAccent}`}>{nearCapacity}</span>
          <span className={styles.statLabel}>NEAR CAPACITY</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.successAccent}`}>{openCount}</span>
          <span className={styles.statLabel}>OPEN</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.mutedAccent}`}>{closedCount}</span>
          <span className={styles.statLabel}>CLOSED</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${networkPct >= 80 ? styles.warningAccent : styles.successAccent}`}>{networkPct}%</span>
          <span className={styles.statLabel}>NETWORK CAPACITY</span>
        </div>
      </div>

      {/* ── 3. Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search shelter by name, location, or facility..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterPills}>
          {statusPills.map(s => (
            <button
              key={s}
              className={`${styles.filterPill} ${statusFilter === s ? styles.filterPillActive : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'ALL' ? 'ALL STATUSES' : s === 'FULL' ? 'NEAR CAPACITY' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Near-capacity Alert ── */}
      {shelters.filter(s => s.capacityTotal > 0 && s.capacityOccupied / s.capacityTotal >= 0.85).map(s => (
        <div key={s.id + '_alert'} className={styles.nearCapacityAlert}>
          <AlertIcon />
          <div className={styles.alertText}>
            <span className={styles.alertBadge}>NEAR MAXIMUM OCCUPANCY</span>
            <span className={styles.alertName}>{s.name}</span>
            <span className={styles.alertDetail}>{s.capacityTotal - s.capacityOccupied} beds remaining ({Math.round((s.capacityOccupied / s.capacityTotal) * 100)}% filled)</span>
          </div>
          <button className={styles.alertViewBtn} onClick={() => setSelectedShelterId(s.id)}>VIEW FACILITY →</button>
        </div>
      ))}

      {/* ── 5. Main Split Workspace ── */}
      <div className={styles.splitWorkspace}>

        {/* Left: Shelter Registry */}
        <div className={styles.registryColumn}>
          {filteredShelters.length === 0 ? (
            <div className={styles.emptyState}>
              <HomeIcon size={28} />
              <p>No shelter facilities match current filter criteria.</p>
            </div>
          ) : (
            <div className={styles.shelterList}>
              {filteredShelters.map((shl, i) => {
                const occPct = shl.capacityTotal > 0
                  ? Math.round((shl.capacityOccupied / shl.capacityTotal) * 100)
                  : 0;
                const available = shl.capacityTotal - shl.capacityOccupied;
                const isSelected = shl.id === selectedShelterId;

                return (
                  <div
                    key={shl.id}
                    className={`${styles.shelterCard} ${isSelected ? styles.shelterCardSelected : ''}`}
                    style={{ animationDelay: `${i * 70}ms` }}
                    onClick={() => setSelectedShelterId(isSelected ? null : shl.id)}
                  >
                    <div className={styles.cardTop}>
                      <span className={`${styles.statusBadge} ${styles['sStatus_' + shl.status]}`}>
                        {shl.status === 'FULL' ? (
                          <span className={styles.statusPulse} />
                        ) : null}
                        {STATUS_DISPLAY[shl.status] || shl.status}
                      </span>
                      <span className={styles.shelterId}>{shl.id}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <span className={styles.shelterName}>{shl.name}</span>
                      <span className={styles.shelterLoc}>{shl.locationName}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.occupancyBarWrap}>
                      <div className={styles.occBarLabels}>
                        <span>{shl.capacityOccupied} OCCUPIED</span>
                        <span>{available} BEDS LEFT</span>
                      </div>
                      <div className={styles.occTrack}>
                        <div
                          className={`${styles.occFill} ${occPct >= 90 ? styles.occFillCritical : occPct >= 75 ? styles.occFillWarning : styles.occFillSafe}`}
                          style={{ width: `${occPct}%` }}
                        />
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.facilityTags}>
                        {shl.resourcesAvailable.slice(0, 3).map(res => (
                          <span key={res} className={styles.facilityTag}>{res}</span>
                        ))}
                      </div>
                      <span className={styles.cardArrow}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Detailed Ledger */}
        <div className={styles.ledgerColumn}>
          <ShaderBackground style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />
          {selectedShelter ? (
            <div className={styles.ledgerContent}>

              <div className={styles.ledgerHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.ledgerMetaRow}>
                    <span className="tech-code font-bold" style={{ color: '#FAF8F3' }}>{selectedShelter.id}</span>
                    <span className={`${styles.statusBadge} ${styles['sStatus_' + selectedShelter.status]}`}>
                      {STATUS_DISPLAY[selectedShelter.status] || selectedShelter.status}
                    </span>
                  </div>
                  <h3 className={styles.ledgerTitle}>{selectedShelter.name}</h3>
                  <span className={styles.ledgerLocText}>{selectedShelter.locationName}</span>
                </div>
                <button className={styles.closeBtn} onClick={() => setSelectedShelterId(null)}>
                  ✕
                </button>
              </div>

              {/* Occupancy Detail */}
              <div className={styles.ledgerSection}>
                <h4 className={styles.sectionTitle}>OCCUPANCY &amp; CAPACITY</h4>
                <div className={styles.bigOccupancyWrap}>
                  <div className={styles.occBigNumbers}>
                    <span className={styles.occBigTotal}>{selectedShelter.capacityOccupied}</span>
                    <span className={styles.occBigSlash}>/</span>
                    <span className={styles.occBigMax}>{selectedShelter.capacityTotal} BEDS</span>
                    <span className={styles.occBigPct}>
                      ({Math.round((selectedShelter.capacityOccupied / selectedShelter.capacityTotal) * 100)}%)
                    </span>
                  </div>
                  <div className={styles.occTrackBig}>
                    <div
                      className={`${styles.occFill} ${selectedShelter.capacityOccupied / selectedShelter.capacityTotal >= 0.9 ? styles.occFillCritical : styles.occFillSafe}`}
                      style={{ width: `${Math.round((selectedShelter.capacityOccupied / selectedShelter.capacityTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Facility Specs */}
              <div className={styles.ledgerSection}>
                <h4 className={styles.sectionTitle}>CONTACT &amp; COORDINATION</h4>
                <div className={styles.specGrid}>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>SUPERINTENDENT / OFFICER</span>
                    <span className={styles.specVal}>{selectedShelter.contactPerson}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>EMERGENCY HELPLINE</span>
                    <span className={styles.specVal}>{selectedShelter.contactNumber}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specKey}>LOCATION COORDINATES</span>
                    <span className="tech-code" style={{ color: '#FAF8F3' }}>
                      {selectedShelter.coordinates.lat.toFixed(4)}° N, {selectedShelter.coordinates.lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>
              </div>

              {/* Resources Available */}
              <div className={styles.ledgerSection}>
                <h4 className={styles.sectionTitle}>ON-SITE PROVISIONS &amp; FACILITIES</h4>
                <div className={styles.facilityList}>
                  {selectedShelter.resourcesAvailable.map(res => (
                    <div key={res} className={styles.facilityListItem}>
                      <span className={styles.facilityCheck}>✓</span>
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className={styles.emptyLedger}>
              <HomeIcon size={32} />
              <h4>SHELTER LEDGER</h4>
              <p>Select any facility from the registry to inspect live bed occupancy rates, on-site services, and emergency staff contacts.</p>
            </div>
          )}
        </div>

      </div>

      {/* ── Register Shelter Modal ── */}
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
            border: '1px solid rgba(5, 150, 105, 0.4)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '540px',
            padding: '24px',
            color: '#FAF8F3',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#059669' }}>REGISTER SHELTER FACILITY</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FAF8F3', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateShelter} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>FACILITY / SHELTER NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Community Relief Center"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>LOCATION ADDRESS / SECTOR *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 15 Government School, Rohini"
                  value={formLocationName}
                  onChange={(e) => setFormLocationName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>TOTAL BED CAPACITY</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={formCapacityTotal}
                    onChange={(e) => setFormCapacityTotal(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>CONTACT PERSON</label>
                  <input
                    type="text"
                    required
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>EMERGENCY CONTACT NUMBER</label>
                <input
                  type="text"
                  required
                  value={formContactNumber}
                  onChange={(e) => setFormContactNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>AVAILABLE FACILITIES (COMMA-SEPARATED)</label>
                <input
                  type="text"
                  value={formFacilities}
                  onChange={(e) => setFormFacilities(e.target.value)}
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
                  style={{ padding: '10px 20px', background: '#059669', border: 'none', color: '#FAF8F3', fontWeight: 800, borderRadius: '4px', cursor: 'pointer' }}
                >
                  REGISTER SHELTER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PageGuidebook guideKey="shelters" />
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const HomeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export default Shelters;
