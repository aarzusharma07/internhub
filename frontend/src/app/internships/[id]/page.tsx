'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGetInternshipById, apiApply } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function InternshipDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [internship, setInternship] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      apiGetInternshipById(id as string).then(data => {
        if (data?.success) setInternship(data.internship);
        setLoading(false);
      });
    }
  }, [id]);

  const handleApply = async () => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'student') { setError('Only students can apply'); return; }
    setApplying(true);
    await apiApply({ internshipId: id, coverLetter });
    setApplying(false);
    setShowModal(false);
    setSuccess(true);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div><p style={{ color: 'var(--text-muted)' }}>Loading internship...</p></div>
    </div>
  );

  if (!internship) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '3rem' }}>❌</div><p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Internship not found</p><Link href="/internships" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>← Back</Link></div>
    </div>
  );

  const company = internship.companyId as Record<string, string>;
  const skills = internship.skillsRequired as string[];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎓</div>
          <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>InternHub</span>
        </Link>
        <Link href="/internships" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none' }}>← Browse All</Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Main */}
        <div>
          {success && (
            <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎉</span>
              <div>
                <div style={{ fontWeight: 700, color: '#34d399' }}>Application Submitted!</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>The recruiter will review your profile and get back to you soon.</div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🏢</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.35rem' }}>{internship.title as string}</h1>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{company?.companyName} · {company?.industry}</div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${internship.locationType}`}>{internship.locationType as string}</span>
                  <span className="badge badge-applied">{internship.category as string}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
              {[
                { icon: '📍', label: 'Location', val: internship.location as string },
                { icon: '💰', label: 'Stipend', val: `₹${(internship.stipend as number)?.toLocaleString()}/mo` },
                { icon: '⏱', label: 'Duration', val: internship.duration as string },
                { icon: '🎯', label: 'Openings', val: String(internship.openings) },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.val}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>About the Role</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.92rem', whiteSpace: 'pre-line' }}>{internship.description as string}</p>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>Skills Required</h2>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {skills?.map((s: string) => (
                <span key={s} style={{ padding: '0.4rem 1rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, fontSize: '0.88rem', color: 'var(--primary-light)', fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* About company */}
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>About {company?.companyName}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
              {[['Industry', company?.industry], ['Location', company?.location || internship.location as string]].map(([k, v]) => (
                <div key={k as string}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{k as string}</div>
                  <div style={{ fontWeight: 600 }}>{v as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky sidebar */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#6366f1' }}>₹{(internship.stipend as number)?.toLocaleString()}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>per month · {internship.duration as string}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              {[['👥', 'Applicants', `${internship.applicationsCount as number} applied`], ['🎯', 'Openings', `${internship.openings as number} positions`], ['📅', 'Type', (internship.locationType as string)?.charAt(0).toUpperCase() + (internship.locationType as string)?.slice(1)], ['🏷️', 'Category', internship.category as string]].map(([icon, label, val]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{icon as string} {label as string}</span>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{val as string}</span>
                </div>
              ))}
            </div>
            {error && <div style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            {success ? (
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16,185,129,0.1)', borderRadius: 10, color: '#34d399', fontWeight: 700 }}>✅ Application Submitted!</div>
            ) : (
              <button onClick={() => { if (!user) router.push('/auth/login'); else setShowModal(true); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}>
                {user?.role === 'student' ? '🚀 Apply Now' : user ? '(Student accounts only)' : '🔑 Login to Apply'}
              </button>
            )}
            <Link href="/internships" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Browse more internships</Link>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Apply to {internship.title as string}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>{company?.companyName}</p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Cover Letter (Optional)</label>
              <textarea className="input" style={{ minHeight: '140px', resize: 'vertical', marginTop: '0.4rem' }} placeholder="Tell the recruiter why you're perfect for this role. Highlight relevant experience, skills, and what excites you about this opportunity..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleApply} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }} disabled={applying}>{applying ? '⏳ Submitting...' : '🚀 Submit Application'}</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
