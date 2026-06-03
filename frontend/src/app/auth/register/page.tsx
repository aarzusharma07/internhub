'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', companyName: '', industry: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('imp_user') || '{}');
      router.push(`/dashboard/${user.role}`);
    } else { setError(result.message || 'Registration failed'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2rem' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎓</div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }} className="gradient-text">InternHub</span>
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join thousands of students & recruiters</p>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem' }}>⚠️ {error}</div>}

          {/* Role selector */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[{ role: 'student', icon: '🎓', label: 'Student' }, { role: 'recruiter', icon: '🏢', label: 'Recruiter' }].map(r => (
              <button key={r.role} type="button" onClick={() => setForm(f => ({ ...f, role: r.role }))}
                style={{ flex: 1, padding: '0.85rem', borderRadius: 12, border: `2px solid ${form.role === r.role ? 'var(--primary)' : 'var(--border)'}`, background: form.role === r.role ? 'rgba(99,102,241,0.15)' : 'transparent', color: form.role === r.role ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '1.5rem' }}>{r.icon}</span>{r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Priya Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            {form.role === 'recruiter' && <>
              <div>
                <label className="label">Company Name</label>
                <input className="input" placeholder="TechNova Labs" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Industry</label>
                <select className="input" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} required>
                  <option value="">Select industry</option>
                  {['Technology', 'Finance', 'Healthcare', 'E-commerce', 'EdTech', 'AI/ML', 'SaaS', 'Other'].map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </>}
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '⏳ Creating account...' : `Create ${form.role === 'recruiter' ? 'Recruiter' : 'Student'} Account →`}
            </button>
          </form>

          {form.role === 'recruiter' && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, fontSize: '0.8rem', color: '#fbbf24' }}>
              ℹ️ Recruiter accounts require admin approval before posting internships.
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
