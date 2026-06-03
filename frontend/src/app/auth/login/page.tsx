'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('imp_user') || '{}');
      router.push(`/dashboard/${user.role}`);
    } else { setError(result.message || 'Login failed'); }
  };

  const handleDemo = (role: 'student' | 'recruiter' | 'admin') => {
    demoLogin(role); router.push(`/dashboard/${role}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2rem' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎓</div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }} className="gradient-text">InternHub</span>
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        <div className="glass" style={{ padding: '2rem' }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem' }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or try a demo</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {(['student', 'recruiter', 'admin'] as const).map(role => (
              <button key={role} onClick={() => handleDemo(role)} style={{ flex: 1, padding: '0.65rem 0.5rem', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(99,102,241,0.08)', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <span>{role === 'student' ? '🎓' : role === 'recruiter' ? '🏢' : '🛡️'}</span>
                <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
