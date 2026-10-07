import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, FileText, Plus, AlertCircle, ArrowDown, ArrowRight, X, MapPin } from 'lucide-react';
import { useOperationalState } from '../../context/OperationalStateContext';
import styles from './Requests.module.css';
import { PageGuideTrigger, PageGuidebook } from '../../components/ui/PageGuide';
import { ShaderBackground } from '../../components/ui/ShaderBackground';

export const Requests: React.FC = () => {
  const navigate = useNavigate();
  const { requests, resources, incidents, addManualRequest } = useOperationalState();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Manual request modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formItemNeeded, setFormItemNeeded] = useState('');
  const [formCategory, setFormCategory] = useState('WATER');
  const [formQuantity, setFormQuantity] = useState('500');
  const [formUnit, setFormUnit] = useState('Liters');
  const [formZoneName, setFormZoneName] = useState('Kashmiri Gate Flood Relief Camp');
  const [formPriority, setFormPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [formAffectedCount, setFormAffectedCount] = useState('150');
  const [formIncidentId, setFormIncidentId] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            req.itemNeeded.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            req.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;
      const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [requests, searchQuery, priorityFilter, statusFilter]);

  const selectedRequest = useMemo(() => {
    return requests.find(r => r.id === selectedRequestId) || null;
  }, [requests, selectedRequestId]);

  const summary = useMemo(() => {
    const active = requests.filter(r => r.status !== 'FULFILLED' && r.status !== 'CANCELLED').length;
    const critical = requests.filter(r => r.priority === 'CRITICAL' && r.status !== 'FULFILLED').length;
    const awaiting = requests.filter(r => r.status === 'PENDING' || r.status === 'OPEN').length;
    const transit = requests.filter(r => r.status === 'DISPATCHED' || r.status === 'ALLOCATED').length;
    const fulfilled = requests.filter(r => r.status === 'FULFILLED').length;
    return { active, critical, awaiting, transit, fulfilled };
  }, [requests]);

  // Find a matching resource for selected request
  const matchedResource = useMemo(() => {
    if (!selectedRequest) return null;
    return resources.find(
      res => res.name.toLowerCase().includes(selectedRequest.itemNeeded.toLowerCase()) && res.status === 'AVAILABLE'
    ) || resources.find(
      res => res.category === selectedRequest.category && res.status === 'AVAILABLE'
    ) || null;
  }, [selectedRequest, resources]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItemNeeded.trim() || !formZoneName.trim()) return;

    addManualRequest({
      incidentId: formIncidentId || undefined,
      zoneName: formZoneName,
      coordinates: { lat: 28.6139 + (Math.random() - 0.5) * 0.1, lng: 77.2090 + (Math.random() - 0.5) * 0.1 },
      itemNeeded: formItemNeeded,
      category: formCategory,
      quantity: parseFloat(formQuantity) || 100,
      unit: formUnit,
      priority: formPriority,
      affectedCount: parseInt(formAffectedCount) || 50
    });

    setIsModalOpen(false);
    setFormItemNeeded('');
    setFormQuantity('500');
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.pageHeader} shaderHeaderWrapper`}>
        <ShaderBackground className="absolute inset-0" />
        <div className={styles.headerTitles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className={styles.eyebrow} style={{ marginBottom: 0 }}>DEMAND &amp; AID REGISTRY</span>
            <PageGuideTrigger />
          </div>
          <h1 className={`${styles.title} reveal-block`} data-reveal-color="#7F00FF">Disaster Resource Requests</h1>
          <p className={styles.lead}>Triaged civilian SOS requests and field supply requisitions needing rapid depot matching and dispatch.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.liveStatus}>
            <span className={styles.statusDot} />
            <span className={styles.statusLabel}>LIVE DEMAND FEED</span>
          </div>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={13} />
            <span>MANUAL REQUEST</span>
          </button>
        </div>
      </header>

      {/* ── 2. Operational Summary Strip ── */}
      <section className={styles.statsStrip}>
        <div className={styles.statCell}>
          <span className={styles.statNum}>{summary.active}</span>
          <span className={styles.statLabel}>Active Requests</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.criticalAccent}`}>{summary.critical}</span>
          <span className={styles.statLabel}>Critical Needs</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.warningAccent}`}>{summary.awaiting}</span>
          <span className={styles.statLabel}>Awaiting Match</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.successAccent}`}>{summary.transit}</span>
          <span className={styles.statLabel}>In Transit</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={styles.statNum}>{summary.fulfilled}</span>
          <span className={styles.statLabel}>Fulfilled Today</span>
        </div>
      </section>

      {/* ── 3. Filters & Search Control Bar ── */}
      <section className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by ID, zone, need, or priority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterPills}>
          {[
            { id: 'ALL', label: 'ALL PRIORITIES' },
            { id: 'CRITICAL', label: 'CRITICAL' },
            { id: 'HIGH', label: 'HIGH' },
            { id: 'MEDIUM', label: 'MEDIUM' },
            { id: 'LOW', label: 'LOW' }
          ].map(pill => (
            <button
              key={pill.id}
              className={`${styles.filterPill} ${priorityFilter === pill.id ? styles.filterPillActive : ''}`}
              onClick={() => setPriorityFilter(pill.id)}
            >
              {pill.label}
            </button>
          ))}
          <div className={styles.pillDivider} />
          {[
            { id: 'ALL', label: 'ALL STATUSES' },
            { id: 'PENDING', label: 'PENDING' },
            { id: 'ALLOCATED', label: 'ALLOCATED' },
            { id: 'DISPATCHED', label: 'DISPATCHED' },
            { id: 'FULFILLED', label: 'FULFILLED' }
          ].map(pill => (
            <button
              key={pill.id}
              className={`${styles.filterPill} ${statusFilter === pill.id ? styles.filterPillActive : ''}`}
              onClick={() => setStatusFilter(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. Main Two-Column Workspace ── */}
      <div className={styles.splitWorkspace}>
        
        {/* Left Side: Requests Registry Table */}
        <div className={styles.registryColumn}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Location / Zone</th>
                  <th>Item Needed</th>
                  <th>Priority</th>
                  <th>Affected</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      <AlertCircle size={22} className={styles.emptyIcon} />
                      <p>No matching requests found.</p>
                      <span>Adjust filters or search parameters.</span>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(req => {
                    const isSelected = selectedRequestId === req.id;
                    return (
                      <tr 
                        key={req.id} 
                        className={`${styles.tableRow} ${isSelected ? styles.rowSelected : ''}`}
                        onClick={() => setSelectedRequestId(req.id)}
                      >
                        <td className="tech-code font-bold">{req.id}</td>
                        <td className={styles.locCol}>{req.zoneName}</td>
                        <td>
                          <div className={styles.itemCol}>
                            <FileText size={12} className={styles.itemIcon} />
                            <span>{req.quantity.toLocaleString()} {req.unit} of <strong>{req.itemNeeded}</strong></span>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.priorityBadge} ${styles['priority_' + req.priority]}`}>
                            ● {req.priority}
                          </span>
                        </td>
                        <td className="tech-code">{req.affectedCount.toLocaleString()}</td>
                        <td>
                          <span className={`${styles.statusLabel} ${styles['status_' + req.status]}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className={styles.actionCol}>
                          <ChevronRight size={14} className={styles.rowArrow} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Operational Context Ledger Panel */}
        <div className={styles.ledgerColumn}>
          <ShaderBackground style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />
          {selectedRequest ? (
            <div className={styles.ledgerContent}>
              <div className={styles.ledgerHeader}>
                <div className={styles.titleArea}>
                  <div className={styles.metaRow}>
                    <span className="tech-code font-bold" style={{ color: '#FAF8F3' }}>{selectedRequest.id}</span>
                    <span className={`${styles.statusLabel} ${styles['status_' + selectedRequest.status]}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <h3 className={styles.ledgerTypeLabel}>
                    {selectedRequest.quantity.toLocaleString()} {selectedRequest.unit} {selectedRequest.itemNeeded}
                  </h3>
                  <p className={styles.ledgerLocation}>
                    <MapPin size={11} className={styles.mapPinIcon} /> {selectedRequest.zoneName}
                  </p>
                </div>
                <button className={styles.closeLedgerBtn} onClick={() => setSelectedRequestId(null)}>
                  <X size={15} />
                </button>
              </div>

              {/* Matching status context */}
              <div className={styles.detailsGrid}>
                <h4 className={styles.sectionTitle}>REQUEST METRICS</h4>
                <div className={styles.gridData}>
                  <div className={styles.gridRow}>
                    <span className={styles.gridLabel}>AFFECTED POPULATION</span>
                    <span style={{ color: '#FAF8F3' }}>{selectedRequest.affectedCount.toLocaleString()} people</span>
                  </div>
                  <div className={styles.gridRow}>
                    <span className={styles.gridLabel}>PRIORITY INDEX</span>
                    <span style={{ fontWeight: 800, color: '#FAF8F3' }}>{selectedRequest.priority}</span>
                  </div>
                  <div className={styles.gridRow}>
                    <span className={styles.gridLabel}>MATCH STATE</span>
                    <span style={{ color: '#FAF8F3' }}>{selectedRequest.status === 'PENDING' ? 'Awaiting Optimization' : 'Allocated'}</span>
                  </div>
                  {selectedRequest.eta && (
                    <div className={styles.gridRow}>
                      <span className={styles.gridLabel}>ESTIMATED ETA</span>
                      <span style={{ color: '#E86F16', fontWeight: 700 }}>{selectedRequest.eta}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Matching Engine Flow diagram */}
              <div className={styles.matchFlow}>
                <h4 className={styles.sectionTitle}>INTELLIGENT MATCHING PATHWAY</h4>
                <div className={styles.flowNode}>
                  <span className={styles.flowLabel}>DEMAND LOCATION</span>
                  <span className={styles.flowValue}>{selectedRequest.zoneName}</span>
                </div>
                <div className={styles.flowConnector}><ArrowDown size={12} /></div>
                <div className={styles.flowNode}>
                  <span className={styles.flowLabel}>OPTIMIZATION ENGINE</span>
                  <span className={styles.flowValue}>Scoring Distance, Availability &amp; Fleet Capacity</span>
                </div>
                <div className={styles.flowConnector}><ArrowDown size={12} /></div>
                {matchedResource ? (
                  <div className={styles.flowNode}>
                    <span className={styles.flowLabel}>RECOMMENDED DEPOT</span>
                    <span className={styles.flowValue}>{matchedResource.name} ({matchedResource.quantity.toLocaleString()} {matchedResource.unit} in stock)</span>
                  </div>
                ) : (
                  <div className={`${styles.flowNode} ${styles.flowNodeEmpty}`}>
                    <span className={styles.flowLabel}>RESOURCE POOL</span>
                    <span className={styles.flowValue}>Searching Active Depots...</span>
                  </div>
                )}
              </div>

              {/* Matching Actions */}
              <div className={styles.ledgerActions}>
                {selectedRequest.status === 'PENDING' || selectedRequest.status === 'MATCHED' ? (
                  <button
                    className={styles.primaryActionBtn}
                    onClick={() => navigate(`/operations/matching?requestId=${selectedRequest.id}`)}
                    style={{ background: '#E86F16', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span>RUN MATCHING ENGINE</span>
                    <ArrowRight size={14} />
                  </button>
                ) : selectedRequest.status === 'ALLOCATED' ? (
                  <button
                    className={styles.primaryActionBtn}
                    onClick={() => navigate(`/operations/dispatch?allocationId=${selectedRequest.id}`)}
                    style={{ background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span>ASSIGN FLEET DISPATCH</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <div className={styles.resolvedBanner}>
                    ✓ Status: {selectedRequest.status}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className={styles.emptyLedger}>
              <div className={styles.emptyLedgerContent}>
                <AlertCircle size={32} className={styles.emptyIcon} />
                <h4>DEMAND LEDGER</h4>
                <p>Select any demand request from the table to inspect priority indices, matching pathway, and trigger allocation.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Manual Request Modal ── */}
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
            border: '1px solid rgba(232, 111, 22, 0.4)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '540px',
            padding: '24px',
            color: '#FAF8F3',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#E86F16' }}>LOG MANUAL DEMAND REQUEST</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FAF8F3', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ITEM NEEDED *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drinking Water Cans, Trauma Kits, Dry Rations"
                  value={formItemNeeded}
                  onChange={(e) => setFormItemNeeded(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>CATEGORY</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0B2119', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  >
                    <option value="WATER">WATER</option>
                    <option value="FOOD">FOOD</option>
                    <option value="MEDICAL">MEDICAL</option>
                    <option value="CLOTHING">CLOTHING</option>
                    <option value="SHELTER_SUPPLIES">SHELTER SUPPLIES</option>
                    <option value="RESCUE_EQUIPMENT">RESCUE EQUIPMENT</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>PRIORITY</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', background: '#0B2119', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>QUANTITY</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>UNIT</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liters, Packets, Kits, Units"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>ZONE / LOCATION NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yamuna Khadar Relief Camp, North Delhi"
                  value={formZoneName}
                  onChange={(e) => setFormZoneName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>PEOPLE AFFECTED</label>
                  <input
                    type="number"
                    min="1"
                    value={formAffectedCount}
                    onChange={(e) => setFormAffectedCount(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>LINKED INCIDENT (OPTIONAL)</label>
                  <select
                    value={formIncidentId}
                    onChange={(e) => setFormIncidentId(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0B2119', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  >
                    <option value="">None (Standalone)</option>
                    {incidents.map(inc => (
                      <option key={inc.id} value={inc.id}>{inc.id} · {inc.type}</option>
                    ))}
                  </select>
                </div>
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
                  style={{ padding: '10px 20px', background: '#E86F16', border: 'none', color: '#0B2119', fontWeight: 800, borderRadius: '4px', cursor: 'pointer' }}
                >
                  CREATE DEMAND
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PageGuidebook guideKey="demand" />
    </div>
  );
};

export default Requests;
