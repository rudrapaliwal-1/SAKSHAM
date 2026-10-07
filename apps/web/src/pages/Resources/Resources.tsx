import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Package, MapPin, AlertTriangle, AlertCircle, Plus, ArrowRight, X } from 'lucide-react';
import { useOperationalState } from '../../context/OperationalStateContext';
import type { ResourceCategory } from '../../types/resource';
import styles from './Resources.module.css';
import { PageGuideTrigger, PageGuidebook } from '../../components/ui/PageGuide';
import { ShaderBackground } from '../../components/ui/ShaderBackground';

export const Resources: React.FC = () => {
  const navigate = useNavigate();
  const { resources, requests, addResource } = useOperationalState();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  // Register Depot Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ResourceCategory>('WATER');
  const [formQuantity, setFormQuantity] = useState('5000');
  const [formUnit, setFormUnit] = useState('Liters');
  const [formLocationName, setFormLocationName] = useState('Central NDRF Logistics Depot, Dwarka Sector 8');
  const [formContactPerson, setFormContactPerson] = useState('Cmdt. R. K. Meena');
  const [formContactNumber, setFormContactNumber] = useState('+91-98101-55440');

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            res.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || res.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, categoryFilter]);

  const selectedResource = useMemo(() => {
    return resources.find(r => r.id === selectedResourceId) || null;
  }, [resources, selectedResourceId]);

  const summary = useMemo(() => {
    const tracked = resources.length;
    const available = resources.filter(r => r.status === 'AVAILABLE').length;
    const low = resources.filter(r => r.status === 'LOW' || r.quantity < 100).length;
    const reserved = resources.filter(r => (r.allocatedQuantity ?? 0) > 0).length;
    const transit = resources.filter(r => r.status === 'IN_TRANSIT').length;
    return { tracked, available, low, reserved, transit };
  }, [resources]);

  // Find dynamic pressure requests linking this resource category or name
  const linkedRequests = useMemo(() => {
    if (!selectedResource) return [];
    return requests.filter(
      req => (req.category === selectedResource.category || req.itemNeeded.toLowerCase().includes(selectedResource.name.split(' ')[0].toLowerCase())) &&
             (req.status === 'PENDING' || req.status === 'MATCHED')
    );
  }, [selectedResource, requests]);

  // Low stock warning alerts
  const lowStockResources = useMemo(() => {
    return resources.filter(r => r.status === 'LOW' || r.quantity < 100);
  }, [resources]);

  // Stock status bars helper
  const getCapacityPercent = (quantity: number, category: string) => {
    const maxLimits: Record<string, number> = {
      WATER: 25000,
      FOOD: 10000,
      MEDICAL: 500,
      SHELTER_SUPPLIES: 1000,
      CLOTHING: 2000,
      RESCUE_EQUIPMENT: 200,
    };
    const max = maxLimits[category] || 5000;
    return Math.min(Math.round((quantity / max) * 100), 100);
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocationName.trim()) return;

    addResource({
      name: formName,
      category: formCategory,
      quantity: parseFloat(formQuantity) || 1000,
      unit: formUnit,
      locationName: formLocationName,
      coordinates: { lat: 28.6139 + (Math.random() - 0.5) * 0.1, lng: 77.2090 + (Math.random() - 0.5) * 0.1 },
      contactPerson: formContactPerson,
      contactNumber: formContactNumber
    });

    setIsModalOpen(false);
    setFormName('');
    setFormQuantity('5000');
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.pageHeader} shaderHeaderWrapper`}>
        <ShaderBackground className="absolute inset-0" />
        <div className={styles.headerTitles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className={styles.eyebrow} style={{ marginBottom: 0 }}>RESOURCE LOGISTICS &amp; STOCKPILES</span>
            <PageGuideTrigger />
          </div>
          <h1 className={`${styles.title} reveal-block`} data-reveal-color="#10B981">Emergency Resource Stockpiles</h1>
          <p className={styles.lead}>Live tracking of water reserves, food rations, trauma pharmaceutical stores, and disaster equipment across Delhi NCR depots.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.liveStatus}>
            <span className={styles.statusDot} />
            <span className={styles.statusLabel}>LIVE INVENTORY</span>
          </div>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={13} />
            <span>ADD STOCKPILE DEPOT</span>
          </button>
        </div>
      </header>

      {/* ── 2. Statistics Strip ── */}
      <section className={styles.statsStrip}>
        <div className={styles.statCell}>
          <span className={styles.statNum}>{summary.tracked}</span>
          <span className={styles.statLabel}>Tracked Stockpiles</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.successAccent}`}>{summary.available}</span>
          <span className={styles.statLabel}>Available Depots</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.criticalAccent}`}>{summary.low}</span>
          <span className={styles.statLabel}>Low Stock Alerts</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={`${styles.statNum} ${styles.warningAccent}`}>{summary.reserved}</span>
          <span className={styles.statLabel}>Active Allocations</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statCell}>
          <span className={styles.statNum}>{summary.transit}</span>
          <span className={styles.statLabel}>In Transit</span>
        </div>
      </section>

      {/* ── 3. Filters & Search Control Bar ── */}
      <section className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search stockpiles by name, depot location, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterPills}>
          {['ALL', 'WATER', 'FOOD', 'MEDICAL', 'SHELTER_SUPPLIES', 'CLOTHING', 'RESCUE_EQUIPMENT'].map(pill => (
            <button
              key={pill}
              className={`${styles.filterPill} ${categoryFilter === pill ? styles.filterPillActive : ''}`}
              onClick={() => setCategoryFilter(pill)}
            >
              {pill === 'ALL' ? 'ALL CATEGORIES' : pill.replace('_', ' ')}
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. Main Two-Column Workspace ── */}
      <div className={styles.splitWorkspace}>
        
        {/* Left Side: Resources Registry Table */}
        <div className={styles.registryColumn}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Resource ID</th>
                  <th>Stockpile Name &amp; Depot</th>
                  <th>Category</th>
                  <th>Available Stock</th>
                  <th>Committed</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      <AlertCircle size={22} className={styles.emptyIcon} />
                      <p>No matching resources found.</p>
                      <span>Try broadening your search or filter settings.</span>
                    </td>
                  </tr>
                ) : (
                  filteredResources.map(res => {
                    const isSelected = selectedResourceId === res.id;
                    const percent = getCapacityPercent(res.quantity, res.category);
                    return (
                      <tr 
                        key={res.id} 
                        className={`${styles.tableRow} ${isSelected ? styles.rowSelected : ''}`}
                        onClick={() => setSelectedResourceId(res.id)}
                      >
                        <td className="tech-code font-bold">{res.id}</td>
                        <td className={styles.locCol}>
                          <div style={{ fontWeight: 700, color: '#FAF8F3' }}>{res.name}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.5)' }}>{res.locationName}</div>
                        </td>
                        <td>
                          <span className={styles.catBadge}>{res.category.replace('_', ' ')}</span>
                        </td>
                        <td>
                          <div className={styles.stockCol}>
                            <span className="tech-code font-bold">{res.quantity.toLocaleString()} {res.unit}</span>
                            <div className={styles.stockBarTrack}>
                              <div 
                                className={`${styles.stockBarFill} ${res.status === 'LOW' ? styles.stockBarLow : ''}`} 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="tech-code">
                          {(res.allocatedQuantity ?? 0) > 0 ? `${res.allocatedQuantity?.toLocaleString()} ${res.unit}` : '—'}
                        </td>
                        <td>
                          <span className={`${styles.statusLabel} ${styles['status_' + res.status]}`}>
                            {res.status}
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

        {/* Right Side: Resource Detail Ledger Panel */}
        <div className={styles.ledgerColumn}>
          <ShaderBackground style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />
          {selectedResource ? (
            <div className={styles.ledgerContent}>
              <div className={styles.ledgerHeader}>
                <div className={styles.titleArea}>
                  <div className={styles.metaRow}>
                    <span className="tech-code font-bold" style={{ color: '#FAF8F3' }}>{selectedResource.id}</span>
                    <span className={`${styles.statusLabel} ${styles['status_' + selectedResource.status]}`}>
                      {selectedResource.status}
                    </span>
                  </div>
                  <h3 className={styles.ledgerTypeLabel}>{selectedResource.name}</h3>
                  <p className={styles.ledgerLocation}>
                    <MapPin size={11} className={styles.mapPinIcon} /> {selectedResource.locationName}
                  </p>
                </div>
                <button className={styles.closeLedgerBtn} onClick={() => setSelectedResourceId(null)}>
                  <X size={15} />
                </button>
              </div>

              {/* Data Grid */}
              <div className={styles.detailsGrid}>
                <h4 className={styles.sectionTitle}>STOCKPILE SPECIFICATIONS</h4>
                <div className={styles.gridData}>
                  <div className={styles.gridRow}>
                    <span className={styles.gridLabel}>AVAILABLE QUANTITY</span>
                    <span className="tech-code" style={{ color: '#10B981', fontWeight: 800 }}>
                      {selectedResource.quantity.toLocaleString()} {selectedResource.unit}
                    </span>
                  </div>
                  <div className={styles.gridRow}>
                    <span className={styles.gridLabel}>ALLOCATED / RESERVED</span>
                    <span className="tech-code" style={{ color: '#E86F16', fontWeight: 700 }}>
                      {(selectedResource.allocatedQuantity ?? 0).toLocaleString()} {selectedResource.unit}
                    </span>
                  </div>
                  <div className={styles.gridRow}>
                    <span className={styles.gridLabel}>DEPOT POINT OF CONTACT</span>
                    <span style={{ color: '#FAF8F3' }}>{selectedResource.contactPerson} ({selectedResource.contactNumber})</span>
                  </div>
                  <div className={styles.gridRow}>
                    <span className={styles.gridLabel}>COORDINATES</span>
                    <span className="tech-code" style={{ color: '#FAF8F3' }}>
                      {selectedResource.coordinates.lat.toFixed(4)}° N, {selectedResource.coordinates.lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>
              </div>

              {/* Demand Pressure linked block */}
              <div className={styles.detailsGrid}>
                <h4 className={styles.sectionTitle}>ACTIVE DEMAND PRESSURE ({linkedRequests.length})</h4>
                {linkedRequests.length > 0 ? (
                  <div className={styles.pressurePanel}>
                    <div className={styles.pressureHeader}>
                      <AlertTriangle size={13} className={styles.pressureIcon} />
                      <span>{linkedRequests.length} Outstanding Demands Match Category</span>
                    </div>
                    <div className={styles.linkedRequestsList}>
                      {linkedRequests.map(r => (
                        <div key={r.id} className={styles.linkedRequestItem}>
                          <span className={styles.lrZone}>{r.zoneName}</span>
                          <span className={styles.lrQty}>{r.quantity.toLocaleString()} {r.unit} ({r.priority})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.noPressureBanner}>
                    ✓ No unallocated demand pressure for this category.
                  </div>
                )}
              </div>

              {/* Action */}
              <div className={styles.ledgerActions}>
                <button
                  className={styles.primaryActionBtn}
                  onClick={() => navigate('/operations/matching')}
                  style={{ background: '#E86F16', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>LAUNCH DEMAND MATCHING ENGINE</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ) : (
            <div className={styles.emptyLedger}>
              <div className={styles.emptyLedgerContent}>
                <Package size={32} className={styles.emptyIcon} />
                <h4>STOCKPILE LEDGER</h4>
                <p>Select any resource stockpile from the registry to inspect stock capacity percentages, depot points of contact, and linked demand pressure.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── 5. Low stock Alerts banner ── */}
      {lowStockResources.length > 0 && (
        <section className={styles.lowStockBanner} style={{ margin: '20px 24px 0 24px' }}>
          <AlertTriangle size={15} />
          <span>ALERT: {lowStockResources.map(r => `${r.name} (${r.quantity} ${r.unit})`).join(', ')} currently flagged under LOW STOCK limits.</span>
        </section>
      )}

      {/* ── Add Stockpile Modal ── */}
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
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '540px',
            padding: '24px',
            color: '#FAF8F3',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#10B981' }}>REGISTER RESOURCE STOCKPILE</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FAF8F3', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>RESOURCE / MATERIAL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bottled Drinking Water, Trauma Triage Kits"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>CATEGORY</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ResourceCategory)}
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
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>STOCK QUANTITY</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>UNIT OF MEASUREMENT</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liters, Packets, Kits, Units"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>DEPOT / WAREHOUSE FACILITY NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central NDRF Depot, Dwarka Sector 8"
                  value={formLocationName}
                  onChange={(e) => setFormLocationName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>CONTACT PERSON</label>
                  <input
                    type="text"
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>CONTACT NUMBER</label>
                  <input
                    type="text"
                    value={formContactNumber}
                    onChange={(e) => setFormContactNumber(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#FAF8F3' }}
                  />
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
                  style={{ padding: '10px 20px', background: '#10B981', border: 'none', color: '#0B2119', fontWeight: 800, borderRadius: '4px', cursor: 'pointer' }}
                >
                  REGISTER DEPOT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PageGuidebook guideKey="resources" />
    </div>
  );
};

export default Resources;
