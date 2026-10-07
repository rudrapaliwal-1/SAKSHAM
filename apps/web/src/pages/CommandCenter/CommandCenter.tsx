import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { MapView } from '../../components/map/MapView';
import { useOperationalState } from '../../context/OperationalStateContext';
import {
  Layers,
  ChevronRight,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Zap,
  Truck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './CommandCenter.module.css';

import GradientBackground from '../../components/ui/noisy-gradient-backgrounds';
import { PageGuideTrigger, PageGuidebook } from '../../components/ui/PageGuide';
import { ShaderBackground } from '../../components/ui/ShaderBackground';

const fmtTimeAgo = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
};

// ─── Smooth CountUp Hook ──────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500, triggerStart = false) {
  const [value, setValue] = useState(0);
  const useRefTarget = useRef(target);
  useRefTarget.current = target;

  useEffect(() => {
    if (!triggerStart) return;
    let frame = 0;
    const totalFrames = Math.ceil(duration / 16);
    const timer = setInterval(() => {
      frame++;
      const progress = gsap.parseEase('power2.out')(frame / totalFrames);
      setValue(Math.round(useRefTarget.current * progress));
      if (frame >= totalFrames) {
        setValue(useRefTarget.current);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, triggerStart]);

  return value;
}

export const CommandCenter: React.FC = () => {
  const { t } = useTranslation();
  const {
    incidents,
    vehicles,
    resources,
    shelters,
    requests,
    missions,
    auditLogs,
    dataMode,
    resetToDemoDataset
  } = useOperationalState();

  const [layerFilters, setLayerFilters] = useState({
    incidents: true,
    resources: true,
    vehicles: true,
    shelters: true,
    routes: true,
  });
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const layersRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<{ type: 'incident' | 'vehicle' | 'shelter' | 'demand'; obj: any } | null>(null);

  // Animation triggers state
  const [statsAnimated, setStatsAnimated] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLElement>(null);

  // Close layers popover on outside click
  useEffect(() => {
    if (!isLayersOpen) return;
    const handler = (e: MouseEvent) => {
      if (layersRef.current && !layersRef.current.contains(e.target as Node)) {
        setIsLayersOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isLayersOpen]);

  // Computed KPIs
  const kpiStats = useMemo(() => {
    const active = incidents.filter(i => i.status !== 'RESOLVED').length;
    const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
    const pendingDemands = requests.filter(r => r.status === 'PENDING' || r.status === 'OPEN').length;
    const criticalDemands = requests.filter(r => r.priority === 'CRITICAL' && (r.status === 'PENDING' || r.status === 'OPEN')).length;
    const availRes = resources.filter(r => r.status === 'AVAILABLE').length;
    const activeMissionsCount = missions.filter(m => m.status === 'EN_ROUTE' || m.status === 'DISPATCHED' || m.status === 'ARRIVED').length;

    const totalCap = shelters.reduce((a, s) => a + s.capacityTotal, 0);
    const occupied = shelters.reduce((a, s) => a + s.capacityOccupied, 0);
    const shelterPct = totalCap > 0 ? Math.round((occupied / totalCap) * 100) : 0;

    return {
      active,
      criticalIncidents,
      pendingDemands,
      criticalDemands,
      availRes,
      activeMissionsCount,
      shelterPct
    };
  }, [incidents, requests, resources, missions, shelters]);

  // Get top urgent active incidents
  const topIncidents = useMemo(() => {
    return incidents
      .filter(i => i.status !== 'RESOLVED')
      .slice(0, 4);
  }, [incidents]);

  // Unfulfilled critical demands
  const urgentDemands = useMemo(() => {
    return requests
      .filter(r => r.status === 'PENDING' || r.status === 'MATCHED')
      .slice(0, 3);
  }, [requests]);

  // CountUp states
  const activeCountVal = useCountUp(kpiStats.active, 1400, statsAnimated);
  const pendingCountVal = useCountUp(kpiStats.pendingDemands, 1400, statsAnimated);
  const availResCountVal = useCountUp(kpiStats.availRes, 1400, statsAnimated);
  const onMissionCountVal = useCountUp(kpiStats.activeMissionsCount, 1400, statsAnimated);
  const shelterPctCountVal = useCountUp(kpiStats.shelterPct, 1400, statsAnimated);

  // ─── GSAP ScrollTrigger & Entrance animations ──────────────────────────────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setStatsAnimated(true);
      return;
    }

    const ctx = gsap.context(() => {
      setStatsAnimated(true);
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl.fromTo(`.${styles.heroSubtitle}`,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(`.${styles.heroTitle}`,
          { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 30 },
          { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(`.${styles.heroLead}`,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <GradientBackground />

      {/* 1. EDITORIAL HERO SECTION */}
      <section ref={heroRef} className={`${styles.heroSection} shaderHeaderWrapper`}>
        <ShaderBackground className="absolute inset-0" />
        <div className={styles.heroHeader}>
          <div className={styles.heroTitles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span className={styles.heroSubtitle} style={{ marginBottom: 0 }}>MISSION CONTROL &amp; COP</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '3px 9px',
                borderRadius: '4px',
                backgroundColor: dataMode === 'LIVE_BACKEND' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(232, 111, 22, 0.2)',
                color: dataMode === 'LIVE_BACKEND' ? '#10B981' : '#E86F16',
                border: `1px solid ${dataMode === 'LIVE_BACKEND' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(232, 111, 22, 0.4)'}`
              }}>
                {dataMode === 'LIVE_BACKEND' ? '● LIVE API FEED' : '● SIMULATED DISASTER DEMO (DELHI NCR)'}
              </span>
              <PageGuideTrigger />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h1 className={`${styles.heroTitle} reveal-block`} data-reveal-color="#F47C20">Unified Common Operating Picture</h1>
            </div>
            <p className={styles.heroLead}>
              Real-time situational intelligence connecting verified disaster demands, depot stockpiles, fleet dispatch telemetry, and shelter networks across Delhi NCR.
            </p>
          </div>

          <div className={styles.heroStatus} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className={styles.statusDotPulse} />
              <div className={styles.statusDetails}>
                <span className={styles.statusLabel}>NATIONAL RESPONSE GRID</span>
                <span className={styles.syncLabel}>COORDINATION LEVEL 1 ACTIVE</span>
              </div>
            </div>
            <button
              onClick={resetToDemoDataset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FAF8F3',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Reset all incidents, requests, and fleet positions to initial Delhi scenario"
            >
              <RotateCcw size={12} />
              <span>RESET DEMO DATASET</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL ACTION / NEXT-STEPS BAR */}
      <section style={{
        margin: '0 24px 20px 24px',
        padding: '16px 20px',
        background: 'rgba(11, 33, 25, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(232, 111, 22, 0.3)',
        borderRadius: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(232, 111, 22, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E86F16'
          }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#E86F16' }}>RECOMMENDED OPERATOR ACTION</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F3' }}>
              {kpiStats.criticalDemands > 0
                ? `${kpiStats.criticalDemands} Critical Unallocated Demands awaiting Resource Matching Engine`
                : 'All critical demands allocated. Monitor active convoy dispatches and verify deliveries.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {urgentDemands[0] && (
            <Link
              to={`/operations/matching?requestId=${urgentDemands[0].id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#E86F16',
                color: '#0B2119',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              <span>RUN MATCHING ({urgentDemands[0].id})</span>
              <ArrowRight size={14} />
            </Link>
          )}
          <Link
            to="/operations/dispatch"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FAF8F3',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}
          >
            <Truck size={14} />
            <span>DISPATCH BOARD</span>
          </Link>
        </div>
      </section>

      {/* 3. STATS OVERVIEW SECTION */}
      <section ref={statsRef} className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>{String(activeCountVal).padStart(2, '0')}</span>
            <span className={styles.statLabel}>Active Incidents ({kpiStats.criticalIncidents} Critical)</span>
          </div>
          <div className={styles.statCell}>
            <span className={`${styles.statNumber} ${styles.criticalAccent}`}>{String(pendingCountVal).padStart(2, '0')}</span>
            <span className={styles.statLabel}>Pending Demands ({kpiStats.criticalDemands} Critical)</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>{String(availResCountVal).padStart(2, '0')}</span>
            <span className={styles.statLabel}>Active Supply Depots</span>
          </div>
          <div className={styles.statCell}>
            <span className={`${styles.statNumber} ${styles.warningAccent}`}>{String(onMissionCountVal).padStart(2, '0')}</span>
            <span className={styles.statLabel}>Active Missions En Route</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>{shelterPctCountVal}%</span>
            <span className={styles.statLabel}>Regional Shelter Load</span>
          </div>
        </div>
      </section>

      {/* 4. LIVE MAP SECTION */}
      <section ref={mapRef} className={styles.mapSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Common Operating Telemetry Map</h2>
            <p className={styles.sectionSubtitle}>Interactive spatial layers displaying incidents, emergency shelters, supply stockpiles, and en route logistics convoys.</p>
          </div>

          {/* Layer controls */}
          <div className={styles.layerControlWrapper} ref={layersRef}>
            <button
              className={styles.layerToggleBtn}
              onClick={() => setIsLayersOpen(!isLayersOpen)}
            >
              <Layers size={13} />
              <span>{t('map.legendTitle')}</span>
            </button>

            {isLayersOpen && (
              <div className={styles.layerDropdown}>
                <div className={styles.dropdownSection}>
                  <span className={styles.dropdownLabel}>Map Layers</span>
                  {(Object.entries(layerFilters) as [keyof typeof layerFilters, boolean][]).map(([key, on]) => (
                    <label key={key} className={styles.layerCheckboxRow}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setLayerFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                      />
                      <span className={`${styles.checkboxLabel} ${on ? styles.checkboxOn : ''}`}>{key.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.dropdownDivider} />
                <div className={styles.dropdownSection}>
                  <span className={styles.dropdownLabel}>Severity Legend</span>
                  <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.ldCritical}`} />CRITICAL INCIDENT</div>
                  <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.ldHigh}`} />HIGH SEVERITY</div>
                  <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.ldMedium}`} />MEDIUM RISK</div>
                  <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.ldShelter}`} />SAFE SHELTER FACILITY</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Workspace */}
        <div className={styles.mapWrapper}>
          <MapView
            incidents={incidents}
            resources={resources}
            vehicles={vehicles}
            shelters={shelters}
            selectedIncident={selectedItem?.type === 'incident' ? selectedItem.obj : null}
            selectedVehicle={selectedItem?.type === 'vehicle' ? selectedItem.obj : null}
            onSelectIncident={(i) => setSelectedItem({ type: 'incident', obj: i })}
            onSelectVehicle={(v) => setSelectedItem({ type: 'vehicle', obj: v })}
            onSelectShelter={(s) => setSelectedItem({ type: 'shelter', obj: s })}
            layerFilters={layerFilters}
          />
        </div>
      </section>

      {/* 5. WORKFLOW GRID: INCIDENTS, INSPECTOR & LIVE AUDIT TRAIL */}
      <section ref={detailsRef} className={styles.detailsGridSection}>
        <div className={styles.gridCols}>

          {/* Priority Incidents Feed Column */}
          <div className={styles.gridCol}>
            <div className={styles.gridColHeader}>
              <h3>Active Disaster Response Cases</h3>
              <Link to="/operations/incidents" className={styles.viewRegistryLink}>
                All Cases ({incidents.length}) <ArrowRight size={12} />
              </Link>
            </div>

            <div className={styles.incidentList}>
              {topIncidents.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(250, 248, 243, 0.65)', fontSize: '13px', fontWeight: 600 }}>
                  No active incidents recorded.
                </div>
              ) : topIncidents.map((incident) => (
                <button
                  key={incident.id}
                  className={`${styles.incidentRow} ${selectedItem?.obj?.id === incident.id ? styles.incidentRowActive : ''}`}
                  onClick={() => setSelectedItem({ type: 'incident', obj: incident })}
                >
                  <div className={`${styles.sevBar} ${styles['sev_' + incident.severity]}`} />
                  <div className={styles.incContent}>
                    <div className={styles.incHeaderRow}>
                      <span className={styles.incId}>{incident.id}</span>
                      <span className={`${styles.sevBadge} ${styles['badge_' + incident.severity]}`}>
                        {incident.severity}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(250,248,243,0.5)', marginLeft: 'auto' }}>
                        {incident.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className={styles.incType}>{incident.type.replace(/_/g, ' ')}</div>
                    <div className={styles.incLocation}><MapPin size={10} /> {incident.location}</div>
                  </div>
                  <ChevronRight size={14} className={styles.rowArrow} />
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Inspection Column */}
          <div className={styles.gridCol}>
            <div className={styles.gridColHeader}>
              <h3>Selected Entity Telemetry</h3>
              {selectedItem && (
                <button className={styles.clearPanelBtn} onClick={() => setSelectedItem(null)}>
                  CLEAR
                </button>
              )}
            </div>

            <div className={styles.inspectorContainer}>
              {selectedItem ? (
                <div className={styles.inspectorBody}>
                  {selectedItem.type === 'incident' && (
                    <div className={styles.inspectorDetails}>
                      <span className={styles.inspectorSubtitle}>INCIDENT CASE FILE</span>
                      <h4 className={styles.inspectorTitle}>{selectedItem.obj.type.replace(/_/g, ' ')}</h4>
                      <p className={styles.inspectorLoc}><MapPin size={11} /> {selectedItem.obj.location}</p>

                      <div className={styles.metaRow}>
                        <span className={styles.metaBadge}>Status: {selectedItem.obj.status}</span>
                        <span className={styles.metaBadge}>Affected: {selectedItem.obj.peopleAffected || selectedItem.obj.displacedCount || 0}</span>
                        <span className={styles.metaBadge}>Reported: {fmtTimeAgo(selectedItem.obj.time)}</span>
                      </div>

                      <p className={styles.inspectorDesc}>{selectedItem.obj.description}</p>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <Link to={`/operations/incidents/${selectedItem.obj.id}`} className={styles.inspectCta}>
                          Open Case Workspace &rarr;
                        </Link>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === 'vehicle' && (
                    <div className={styles.inspectorDetails}>
                      <span className={styles.inspectorSubtitle}>LOGISTICS FLEET TELEMETRY</span>
                      <h4 className={styles.inspectorTitle}>{selectedItem.obj.name}</h4>
                      <p className={styles.inspectorLoc}><CheckCircle size={11} /> Status: {selectedItem.obj.status}</p>
                      <div className={styles.metaRow}>
                        <span className={styles.metaBadge}>Driver: {selectedItem.obj.driverName}</span>
                        <span className={styles.metaBadge}>Capacity: {selectedItem.obj.capacity}</span>
                      </div>
                      {selectedItem.obj.cargo && (
                        <p className={styles.inspectorDesc} style={{ color: '#E86F16' }}>
                          Cargo: <strong>{selectedItem.obj.cargo}</strong>
                        </p>
                      )}
                      <Link to="/operations/dispatch" className={styles.inspectCta}>
                        View Fleet Missions &rarr;
                      </Link>
                    </div>
                  )}

                  {selectedItem.type === 'shelter' && (
                    <div className={styles.inspectorDetails}>
                      <span className={styles.inspectorSubtitle}>SHELTER FACILITY STATUS</span>
                      <h4 className={styles.inspectorTitle}>{selectedItem.obj.name}</h4>
                      <p className={styles.inspectorLoc}><MapPin size={11} /> {selectedItem.obj.locationName}</p>
                      <div className={styles.metaRow}>
                        <span className={styles.metaBadge}>Occupancy: {selectedItem.obj.capacityOccupied} / {selectedItem.obj.capacityTotal} Beds</span>
                        <span className={styles.metaBadge}>Status: {selectedItem.obj.status}</span>
                      </div>
                      <Link to="/operations/shelters" className={styles.inspectCta}>
                        View Shelter Details &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.inspectorPlaceholder}>
                  <AlertTriangle size={24} className={styles.phIcon} />
                  <p>Click any incident, vehicle, or shelter marker on the map to inspect live data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Audit Trail / Activity Stream Column */}
          <div className={styles.gridCol}>
            <div className={styles.gridColHeader}>
              <h3>Audit &amp; Operational Log</h3>
              <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, letterSpacing: '0.06em' }}>
                ● REAL-TIME LEDGER
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '340px', paddingRight: '4px' }}>
              {auditLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#FAF8F3' }}>{log.action}</span>
                    <span style={{ fontSize: '9px', color: 'rgba(250, 248, 243, 0.45)' }}>{fmtTimeAgo(log.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#E86F16', fontWeight: 600 }}>
                    {log.target}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(250, 248, 243, 0.65)' }}>
                    {log.result}
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(250, 248, 243, 0.4)', marginTop: '2px' }}>
                    Actor: {log.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <PageGuidebook guideKey="commandCentre" />
    </div>
  );
};

export default CommandCenter;
