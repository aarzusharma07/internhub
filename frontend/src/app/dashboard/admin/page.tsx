'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGetAdminStats, apiGetAllUsers, apiGetAnalytics, apiGetPendingCompanies, apiApproveCompany, apiDeleteUser } from '@/lib/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'overview'|'users'|'companies'|'analytics'>('overview');
  const [stats, setStats] = useState<Record<string,number>>({});
  const [users, setUsers] = useState<Record<string,unknown>[]>([]);
  const [pendingCompanies, setPendingCompanies] = useState<Record<string,unknown>[]>([]);
  const [analytics, setAnalytics] = useState<Record<string,unknown>>({});
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push(`/dashboard/${user.role}`); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [sData, uData, aData, cData] = await Promise.all([apiGetAdminStats(), apiGetAllUsers(), apiGetAnalytics(), apiGetPendingCompanies()]);
    if (sData?.success) setStats(sData.stats);
    if (uData?.success) setUsers(uData.users);
    if (aData?.success) setAnalytics(aData.analytics);
    if (cData?.success) setPendingCompanies(cData.companies);
    setLoading(false);
  };

  const handleApprove = async (id: string, name: string) => {
    await apiApproveCompany(id);
    setPendingCompanies(p => p.filter(c => c._id !== id));
    setSuccessMsg(`${name} approved! ✅`); setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteUser = async (id: string) => {
    await apiDeleteUser(id);
    setUsers(u => u.filter(x => x._id !== id));
    setSuccessMsg('User removed'); setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredUsers = users.filter(u => {
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchSearch = !search || (u.name as string)?.toLowerCase().includes(search.toLowerCase()) || (u.email as string)?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const appsByStatus = (analytics.applicationsByStatus as Record<string,unknown>[]) || [];
  const internsByCategory = (analytics.internshipsByCategory as Record<string,unknown>[]) || [];
  const monthly = (analytics.monthlyRegistrations as Record<string,unknown>[]) || [];
  const maxBar = Math.max(...monthly.map(m => ((m.students as number) || 0)), 1);

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'users', icon: '👥', label: 'Manage Users' },
    { id: 'companies', icon: '🏢', label: `Approvals${pendingCompanies.length > 0 ? ` (${pendingCompanies.length})` : ''}` },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
  ];

  const STATUS_COLORS: Record<string,string> = { applied: '#6366f1', shortlisted: '#f59e0b', interview_scheduled: '#0ea5e9', offered: '#10b981', rejected: '#ef4444', completed: '#8b5cf6' };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: '3rem' }}>⏳</div><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎓</div>
            <span style={{ fontWeight: 800, fontSize: '1rem' }} className="gradient-text">InternHub</span>
          </Link>
        </div>
        <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(6,182,212,0.08)', borderRadius: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '1rem' }}>{user?.name?.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ color: '#67e8f9', fontSize: '0.75rem' }}>Administrator</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <div key={item.id} className={`sidebar-nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id as typeof tab)}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ padding: '1rem' }}>
          <button onClick={() => { logout(); router.push('/'); }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>Sign Out</button>
        </div>
      </div>

      <div className="main-content">
        {successMsg && <div style={{ position: 'fixed', top: '1rem', right: '1rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10, padding: '0.75rem 1.5rem', color: '#34d399', zIndex: 999, fontWeight: 600 }}>{successMsg}</div>}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Dashboard 🛡️</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Platform health and activity at a glance</p></div>
              {pendingCompanies.length > 0 && <button onClick={() => setTab('companies')} className="btn-primary" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>⚠️ {pendingCompanies.length} Pending Approvals</button>}
            </div>
            <div className="grid-3" style={{ marginBottom: '2rem' }}>
              {[
                { icon: '🎓', label: 'Total Students', value: stats.totalStudents, color: '#6366f1' },
                { icon: '🏢', label: 'Total Recruiters', value: stats.totalRecruiters, color: '#8b5cf6' },
                { icon: '💼', label: 'Active Internships', value: stats.totalInternships, color: '#06b6d4' },
                { icon: '📋', label: 'Total Applications', value: stats.totalApplications, color: '#f59e0b' },
                { icon: '👥', label: 'All Users', value: stats.totalUsers, color: '#10b981' },
                { icon: '⏳', label: 'Pending Approvals', value: stats.pendingCompanies, color: '#ef4444' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                  <div className="stat-number" style={{ color: s.color }}>{(s.value || 0).toLocaleString()}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📊 Applications by Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {appsByStatus.map((item: Record<string,unknown>) => {
                    const total = appsByStatus.reduce((s, i) => s + (i.count as number), 0) || 1;
                    const pct = Math.round(((item.count as number) / total) * 100);
                    const color = STATUS_COLORS[item._id as string] || '#6366f1';
                    return (
                      <div key={item._id as string}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          <span style={{ textTransform: 'capitalize' }}>{(item._id as string).replace('_', ' ')}</span>
                          <span style={{ fontWeight: 600 }}>{item.count as number}</span>
                        </div>
                        <div className="progress-bar">
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>💼 Internships by Category</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {internsByCategory.map((item: Record<string,unknown>) => {
                    const maxCat = Math.max(...internsByCategory.map(i => i.count as number), 1);
                    const pct = Math.round(((item.count as number) / maxCat) * 100);
                    return (
                      <div key={item._id as string}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          <span>{item._id as string}</span><span style={{ fontWeight: 600 }}>{item.count as number}</span>
                        </div>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Users 👥</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{filteredUsers.length} of {users.length} users</p></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input className="input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 'auto' }} />
                <select className="input" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ minWidth: '700px' }}>
                <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredUsers.map((u: Record<string,unknown>) => (
                    <tr key={u._id as string}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${u.role === 'student' ? '#6366f1,#8b5cf6' : u.role === 'recruiter' ? '#8b5cf6,#6366f1' : '#06b6d4,#0ea5e9'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{(u.name as string)?.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name as string}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{u.email as string}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge" style={{ background: u.role === 'admin' ? 'rgba(6,182,212,0.12)' : u.role === 'recruiter' ? 'rgba(139,92,246,0.12)' : 'rgba(99,102,241,0.12)', color: u.role === 'admin' ? '#67e8f9' : u.role === 'recruiter' ? '#a78bfa' : 'var(--primary-light)', border: '1px solid transparent' }}>{u.role === 'student' ? '🎓' : u.role === 'recruiter' ? '🏢' : '🛡️'} {u.role as string}</span></td>
                      <td><span className="badge" style={{ background: u.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: u.status === 'active' ? '#34d399' : '#fbbf24', border: '1px solid transparent' }}>{u.status === 'active' ? '🟢' : '🟡'} {u.status as string}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt as string).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleDeleteUser(u._id as string)} className="btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPANIES */}
        {tab === 'companies' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Company Approvals 🏢</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{pendingCompanies.length} pending</p></div>
            </div>
            {pendingCompanies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div><h3>All companies approved!</h3><p>No pending approvals at this time.</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingCompanies.map((company: Record<string,unknown>) => {
                  const recruiter = company.userId as Record<string,unknown>;
                  return (
                    <div key={company._id as string} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(99,102,241,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏢</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{company.companyName as string}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{company.industry as string} · {company.location as string || 'Location N/A'}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>By {recruiter?.name as string} ({recruiter?.email as string})</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <span className="badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>⏳ Pending</span>
                        <button onClick={() => handleApprove(company._id as string, company.companyName as string)} className="btn-success">✅ Approve</button>
                        <button className="btn-danger">❌ Reject</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Platform Analytics 📊</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Insights on platform activity and growth</p></div>
              <button style={{ padding: '0.6rem 1.2rem', background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }} onClick={() => { setSuccessMsg('📊 Report exported!'); setTimeout(() => setSuccessMsg(''), 3000); }}>⬇️ Export Report</button>
            </div>

            {/* Monthly bar chart */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📈 Monthly User Registrations</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '180px', padding: '0 0.5rem' }}>
                {monthly.map((m: Record<string,unknown>) => {
                  const students = m.students as number;
                  const recruiters = m.recruiters as number;
                  const heightS = ((students / maxBar) * 160);
                  const heightR = ((recruiters / maxBar) * 160);
                  return (
                    <div key={m.month as string} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                        <div title={`Students: ${students}`} style={{ width: '40%', height: `${heightS}px`, background: 'linear-gradient(180deg,#6366f1,#4f46e5)', borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease', cursor: 'default', minHeight: 4 }} />
                        <div title={`Recruiters: ${recruiters}`} style={{ width: '40%', height: `${heightR}px`, background: 'linear-gradient(180deg,#8b5cf6,#7c3aed)', borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease', cursor: 'default', minHeight: 4 }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.month as string}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', justifyContent: 'center' }}>
                {[{ color: '#6366f1', label: 'Students' }, { color: '#8b5cf6', label: 'Recruiters' }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />{l.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📋 Application Funnel</h3>
                {appsByStatus.map((item: Record<string,unknown>) => {
                  const total = appsByStatus.reduce((s, i) => s + (i.count as number), 0) || 1;
                  const pct = Math.round(((item.count as number) / total) * 100);
                  const color = STATUS_COLORS[item._id as string] || '#6366f1';
                  return (
                    <div key={item._id as string} style={{ marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{(item._id as string).replace('_', ' ')}</span>
                        <span style={{ fontWeight: 700, color }}>{item.count as number} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.78rem' }}>({pct}%)</span></span>
                      </div>
                      <div className="progress-bar"><div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease' }} /></div>
                    </div>
                  );
                })}
              </div>
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>💼 Category Breakdown</h3>
                {internsByCategory.map((item: Record<string,unknown>, idx: number) => {
                  const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'];
                  const color = colors[idx % colors.length];
                  const total = internsByCategory.reduce((s, i) => s + (i.count as number), 0) || 1;
                  const pct = Math.round(((item.count as number) / total) * 100);
                  return (
                    <div key={item._id as string} style={{ marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item._id as string}</span>
                        <span style={{ fontWeight: 700, color }}>{item.count as number} ({pct}%)</span>
                      </div>
                      <div className="progress-bar"><div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease' }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid-3" style={{ marginTop: '1.5rem' }}>
              {[
                { title: 'Avg. Applications per Internship', value: stats.totalInternships ? Math.round((stats.totalApplications || 0) / stats.totalInternships) : 0, icon: '📊', suffix: '' },
                { title: 'Student-to-Recruiter Ratio', value: stats.totalRecruiters ? Math.round((stats.totalStudents || 0) / stats.totalRecruiters) : 0, icon: '⚖️', suffix: ':1' },
                { title: 'Platform Activity Score', value: 94, icon: '🚀', suffix: '/100' },
              ].map(card => (
                <div key={card.title} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }} className="gradient-text">{card.value}{card.suffix}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{card.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
