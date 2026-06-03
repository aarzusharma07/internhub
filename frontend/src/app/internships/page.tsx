'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiGetInternships } from '@/lib/api';
import { CATEGORIES } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LOCATION_TYPES = ['remote', 'hybrid', 'onsite'];
const DURATIONS = ['1 Month', '2 Months', '3 Months', '4 Months', '6 Months'];
const STIPEND_RANGES = [{ label: 'Any', min: 0, max: 999999 }, { label: 'Under ₹10k', min: 0, max: 10000 }, { label: '₹10k–₹20k', min: 10000, max: 20000 }, { label: '₹20k+', min: 20000, max: 999999 }];

export default function InternshipsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [internships, setInternships] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationType, setLocationType] = useState('');
  const [category, setCategory] = useState('');
  const [stipendRange, setStipendRange] = useState(0);
  const [mockMode, setMockMode] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => { loadInternships(); }, [search, locationType, category, stipendRange]);

  const loadInternships = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (locationType) params.locationType = locationType;
    if (category) params.category = category;
    const range = STIPEND_RANGES[stipendRange];
    if (range.min > 0) params.minStipend = String(range.min);
    if (range.max < 999999) params.maxStipend = String(range.max);
    const data = await apiGetInternships(params);
    if (data?.success) { setInternships(data.internships); setTotal(data.total || data.internships.length); setMockMode(!!data.mockMode); }
    setLoading(false);
  };

  const clearFilters = () => { setSearch(''); setLocationType(''); setCategory(''); setStipendRange(0); };
  const hasFilters = search || locationType || category || stipendRange > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎓</div>
          <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>InternHub</span>
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <button onClick={() => router.push(`/dashboard/${user.role}`)} className="btn-primary">Dashboard →</button>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary" style={{ padding: '0.45rem 1.1rem' }}>Login</Link>
              <Link href="/auth/register" className="btn-primary" style={{ padding: '0.45rem 1.1rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '2rem', gap: '2rem' }}>
        {/* Sidebar filters */}
        <div style={{ width: '260px', flexShrink: 0 }}>
          <div className="card" style={{ position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700 }}>Filters</h3>
              {hasFilters && <button onClick={clearFilters} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Clear all</button>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Location Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {LOCATION_TYPES.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input type="radio" name="locationType" value={t} checked={locationType === t} onChange={() => setLocationType(locationType === t ? '' : t)} style={{ accentColor: '#6366f1' }} />
                    <span style={{ textTransform: 'capitalize', color: locationType === t ? 'var(--primary-light)' : 'var(--text-muted)' }}>{t === 'remote' ? '🌐' : t === 'hybrid' ? '🔀' : '🏢'} {t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Category</label>
              <select className="input" style={{ marginTop: '0.5rem' }} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">Stipend Range</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {STIPEND_RANGES.map((r, i) => (
                  <label key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input type="radio" name="stipend" checked={stipendRange === i} onChange={() => setStipendRange(i)} style={{ accentColor: '#6366f1' }} />
                    <span style={{ color: stipendRange === i ? 'var(--primary-light)' : 'var(--text-muted)' }}>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input className="input" style={{ flex: 1, minWidth: '200px' }} placeholder="🔍  Search by title, skill, or company..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {/* Category pills */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(category === cat ? '' : cat)} style={{ padding: '0.35rem 0.9rem', borderRadius: '20px', border: `1px solid ${category === cat ? 'var(--primary)' : 'var(--border)'}`, background: category === cat ? 'rgba(99,102,241,0.15)' : 'transparent', color: category === cat ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.2s' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{total}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem', fontSize: '0.9rem' }}>internships found</span>
              {mockMode && <span style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>⚡ Demo Data</span>}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: '230px', borderRadius: 16 }} />)}
            </div>
          ) : internships.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ marginBottom: '0.5rem' }}>No internships found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary" style={{ marginTop: '1.5rem' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
              {internships.map((intern: Record<string, unknown>) => {
                const company = intern.companyId as Record<string, string>;
                const skills = intern.skillsRequired as string[];
                return (
                  <Link key={intern._id as string} href={`/internships/${intern._id}`} style={{ textDecoration: 'none' }}>
                    <div className="internship-card" style={{ height: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🏢</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{intern.title as string}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{company?.companyName}</div>
                          </div>
                        </div>
                        <span className={`badge badge-${intern.locationType}`} style={{ flexShrink: 0 }}>{intern.locationType as string}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span>📍 {intern.location as string}</span>
                        <span>⏱ {intern.duration as string}</span>
                        <span>💰 ₹{(intern.stipend as number)?.toLocaleString()}/mo</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {skills?.slice(0, 3).map((s: string) => <span key={s} className="chip">{s}</span>)}
                        {skills?.length > 3 && <span className="chip">+{skills.length - 3} more</span>}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '1rem' }}>{intern.description as string}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                        <span>👥 {intern.applicationsCount as number} applicants</span>
                        <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>View Details →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
