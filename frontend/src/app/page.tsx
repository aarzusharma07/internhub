'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiGetInternships } from '@/lib/api';
import { CATEGORIES } from '@/lib/mockData';

const LOCATION_TYPES = ['remote', 'hybrid', 'onsite'];
const categoryIcons: Record<string, string> = { Engineering: '⚙️', Design: '🎨', 'Data Science': '📊', Product: '🚀', Marketing: '📣', Finance: '💰', Operations: '🏗️', HR: '👥' };

export default function LandingPage() {
  const { user, demoLogin } = useAuth();
  const router = useRouter();
  const [internships, setInternships] = useState<Record<string,unknown>[]>([]);
  const [search, setSearch] = useState('');
  const [locationType, setLocationType] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ students: 0, companies: 0, internships: 0 });
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => {
    if (user) { router.push(`/dashboard/${user.role}`); return; }
    loadInternships();
    // Animated counters
    const targets = { students: 1089, companies: 187, internships: 342 };
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({ students: Math.floor(targets.students * progress), companies: Math.floor(targets.companies * progress), internships: Math.floor(targets.internships * progress) });
      if (step >= steps) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [user]);

  const loadInternships = async () => {
    setLoading(true);
    const params: Record<string,string> = {};
    if (search) params.search = search;
    if (locationType) params.locationType = locationType;
    if (category) params.category = category;
    const data = await apiGetInternships(params);
    if (data?.success) { setInternships(data.internships.slice(0, 6)); setMockMode(!!data.mockMode); }
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(loadInternships, 300); return () => clearTimeout(t); }, [search, locationType, category]);

  const handleDemoLogin = (role: 'student' | 'recruiter' | 'admin') => {
    demoLogin(role);
    router.push(`/dashboard/${role}`);
  };

  const getStatusColor = (type: string) => ({ remote: '#10b981', onsite: '#f59e0b', hybrid: '#0ea5e9' }[type] || '#6366f1');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎓</div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">InternHub</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/internships" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Browse</Link>
          <Link href="/case-study" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Case Study</Link>
          <Link href="/auth/login" className="btn-secondary" style={{ padding: '0.45rem 1.1rem' }}>Login</Link>
          <Link href="/auth/register" className="btn-primary" style={{ padding: '0.45rem 1.1rem' }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--primary-light)' }}>
            ✨ &nbsp;Product Design Challenge Prototype
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Your Internship Journey,<br /><span className="gradient-text">Simplified.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            A centralized platform connecting students, recruiters, and colleges — from internship discovery to offer letters.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>Get Started Free →</Link>
            <Link href="/case-study" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>📋 View Case Study</Link>
          </div>
          {/* Demo Login Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', alignSelf: 'center' }}>Demo:</span>
            {(['student', 'recruiter', 'admin'] as const).map(role => (
              <button key={role} onClick={() => handleDemoLogin(role)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.4rem 1rem', color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.2)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}>
                {role === 'student' ? '🎓' : role === 'recruiter' ? '🏢' : '🛡️'} {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', textAlign: 'center' }}>
          {[{ val: counts.students.toLocaleString(), label: 'Students Placed', icon: '🎓', color: '#6366f1' }, { val: counts.companies.toLocaleString(), label: 'Partner Companies', icon: '🏢', color: '#8b5cf6' }, { val: counts.internships.toLocaleString(), label: 'Active Internships', icon: '💼', color: '#06b6d4' }].map(s => (
            <div key={s.label} className="glass" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: s.color }}>{s.val}+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters */}
      <section style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Find Your Perfect <span className="gradient-text">Internship</span></h2>
        {mockMode && <div className="mock-banner" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>⚡ Demo Mode — showing sample data (backend not connected)</div>}
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input" style={{ flex: '1', minWidth: '200px' }} placeholder="🔍  Search by title, skill, or company..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input" style={{ width: 'auto', minWidth: '140px' }} value={locationType} onChange={e => setLocationType(e.target.value)}>
            <option value="">All Types</option>
            {LOCATION_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select className="input" style={{ width: 'auto', minWidth: '140px' }} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(category === cat ? '' : cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.1rem', borderRadius: '20px', border: `1px solid ${category === cat ? 'var(--primary)' : 'var(--border)'}`, background: category === cat ? 'rgba(99,102,241,0.15)' : 'transparent', color: category === cat ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}>
              {categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Internship grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '220px', borderRadius: 16 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.5rem' }}>
            {internships.map((intern: Record<string, unknown>) => {
              const company = intern.companyId as Record<string,string>;
              const skills = intern.skillsRequired as string[];
              return (
                <Link key={intern._id as string} href={`/internships/${intern._id}`} style={{ textDecoration: 'none' }}>
                  <div className="internship-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏢</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.1rem' }}>{intern.title as string}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{company?.companyName}</div>
                        </div>
                      </div>
                      <span className="badge" style={{ background: `rgba(${getStatusColor(intern.locationType as string)},0.1)`, color: getStatusColor(intern.locationType as string), border: `1px solid ${getStatusColor(intern.locationType as string)}40` }}>{intern.locationType as string}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span> {intern.location as string}</span>
                      <span> {intern.duration as string}</span>
                      <span> ₹{(intern.stipend as number)?.toLocaleString()}/mo</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {skills?.slice(0,3).map((s: string) => <span key={s} className="chip">{s}</span>)}
                      {skills?.length > 3 && <span className="chip">+{skills.length - 3}</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span> {intern.applicationsCount as number} applicants</span>
                      <span> {intern.openings as number} openings</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/internships" className="btn-secondary">View All Internships →</Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '3rem' }}>How <span className="gradient-text">InternHub</span> Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
          {[
            { icon: '🎓', title: 'Students', steps: ['Create profile & upload resume', 'Search & apply to internships', 'Track application status', 'Receive offer & complete internship'], color: '#6366f1' },
            { icon: '🏢', title: 'Recruiters', steps: ['Register & get approved', 'Post internship opportunities', 'Review applicants & shortlist', 'Schedule interviews & select'], color: '#8b5cf6' },
            { icon: '🛡️', title: 'Admins', steps: ['Approve company registrations', 'Monitor all activity', 'View analytics & trends', 'Generate platform reports'], color: '#06b6d4' },
          ].map(flow => (
            <div key={flow.title} className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{flow.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: flow.color }}>{flow.title}</h3>
              {flow.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${flow.color}20`, border: `1px solid ${flow.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: flow.color, flexShrink: 0, marginTop: '0.1rem' }}>{i+1}</div>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="glass" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
          <div className="orb" style={{ width: 200, height: 200, background: 'rgba(99,102,241,0.3)', top: -60, right: -60 }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to <span className="gradient-text">Launch</span> Your Career?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>Join 1000+ students who found their dream internship on InternHub</p>
          <Link href="/auth/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>Get Started — It&apos;s Free 🚀</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ marginBottom: '0.5rem' }}><span className="gradient-text" style={{ fontWeight: 700 }}>InternHub</span> — Built for the Product Thinking & Design Challenge</div>
        <div>© 2024 InternHub. All rights reserved.</div>
      </footer>
    </div>
  );
}
