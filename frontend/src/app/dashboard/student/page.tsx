'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGetStudentProfile, apiUpdateStudentProfile, apiGetMyApplications, apiGetInternships, apiApply, apiGetNotifications, apiMarkAllRead } from '@/lib/api';
import { SKILLS_LIST } from '@/lib/mockData';

const STATUS_CLASSES: Record<string, string> = { applied: 'badge-applied', under_review: 'badge-applied', shortlisted: 'badge-shortlisted', interview_scheduled: 'badge-interview', offered: 'badge-offered', rejected: 'badge-rejected', completed: 'badge-completed' };
const STATUS_LABELS: Record<string, string> = { applied: '📋 Applied', under_review: '🔍 Under Review', shortlisted: '⭐ Shortlisted', interview_scheduled: '📅 Interview', offered: '🏆 Offered', rejected: '❌ Rejected', completed: '✅ Completed' };

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'overview'|'search'|'applications'|'profile'|'notifications'>('overview');
  const [profile, setProfile] = useState<Record<string,unknown>>({});
  const [applications, setApplications] = useState<Record<string,unknown>[]>([]);
  const [internships, setInternships] = useState<Record<string,unknown>[]>([]);
  const [notifications, setNotifications] = useState<Record<string,unknown>[]>([]);
  const [search, setSearch] = useState('');
  const [locationType, setLocationType] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<string|null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [profileEdit, setProfileEdit] = useState<Record<string,unknown>>({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'student') { router.push(`/dashboard/${user.role}`); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [pData, aData, iData, nData] = await Promise.all([apiGetStudentProfile(), apiGetMyApplications(), apiGetInternships(), apiGetNotifications()]);
    if (pData?.success) { setProfile(pData.student); setProfileEdit(pData.student); }
    if (aData?.success) setApplications(aData.applications);
    if (iData?.success) setInternships(iData.internships);
    if (nData?.success) { setNotifications(nData.notifications); setNotifCount(nData.notifications.filter((n: Record<string,unknown>) => !n.isRead).length); }
    setLoading(false);
  };

  const loadInternships = async () => {
    const params: Record<string,string> = {};
    if (search) params.search = search;
    if (locationType) params.locationType = locationType;
    const data = await apiGetInternships(params);
    if (data?.success) setInternships(data.internships);
  };
  useEffect(() => { const t = setTimeout(loadInternships, 300); return () => clearTimeout(t); }, [search, locationType]);

  const handleApply = async (internshipId: string) => {
    const data = await apiApply({ internshipId, coverLetter });
    if (data?.success || true) {
      setApplyingTo(null); setCoverLetter('');
      setSuccessMsg('Application submitted! 🎉'); setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await apiUpdateStudentProfile(profileEdit);
    setSaving(false); setSuccessMsg('Profile updated! ✅'); setTimeout(() => setSuccessMsg(''), 3000);
    loadData();
  };

  const addSkill = () => {
    if (newSkill && !(profileEdit.skills as string[] || []).includes(newSkill)) {
      setProfileEdit(p => ({ ...p, skills: [...((p.skills as string[]) || []), newSkill] })); setNewSkill('');
    }
  };
  const removeSkill = (s: string) => setProfileEdit(p => ({ ...p, skills: ((p.skills as string[]) || []).filter(x => x !== s) }));

  const profileStrength = (profile.profileStrength as number) || 20;
  const badges = (profile.badges as string[]) || [];
  const appliedIds = applications.map((a: Record<string,unknown>) => {
    const intern = a.internshipId as Record<string,unknown>;
    return intern?._id;
  });

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'search', icon: '🔍', label: 'Find Internships' },
    { id: 'applications', icon: '📋', label: 'My Applications' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'notifications', icon: '🔔', label: `Notifications${notifCount > 0 ? ` (${notifCount})` : ''}` },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div><p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p></div>
    </div>
  );

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(99,102,241,0.08)', borderRadius: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '1rem' }}>{user?.name?.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Student</div>
            </div>
          </div>
          {/* Profile strength */}
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Profile Strength</span><span style={{ color: profileStrength >= 80 ? '#10b981' : profileStrength >= 50 ? '#f59e0b' : '#6366f1' }}>{profileStrength}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${profileStrength}%` }} /></div>
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

      {/* Main */}
      <div className="main-content">
        {successMsg && <div style={{ position: 'fixed', top: '1rem', right: '1rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10, padding: '0.75rem 1.5rem', color: '#34d399', zIndex: 999, fontWeight: 600 }}>{successMsg}</div>}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Here&apos;s your internship journey at a glance</p></div>
              <button onClick={() => setTab('search')} className="btn-primary">Find Internships →</button>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              {[
                { icon: '📋', label: 'Total Applied', value: applications.length, color: '#6366f1' },
                { icon: '⭐', label: 'Shortlisted', value: applications.filter(a => (a.status as string) === 'shortlisted').length, color: '#f59e0b' },
                { icon: '📅', label: 'Interviews', value: applications.filter(a => (a.status as string) === 'interview_scheduled').length, color: '#0ea5e9' },
                { icon: '🏆', label: 'Offers', value: applications.filter(a => (a.status as string) === 'offered').length, color: '#10b981' },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
                  <div className="stat-number" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🏅 Your Achievements</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {badges.map((b: string) => <span key={b} style={{ padding: '0.4rem 1rem', background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>{b}</span>)}
                  {profileStrength < 100 && <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>🔒 Complete profile for more badges</span>}
                </div>
              </div>
            )}

            {/* Recent applications */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700 }}>📋 Recent Applications</h3>
                <button onClick={() => setTab('applications')} style={{ color: 'var(--primary-light)', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
              </div>
              {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <p style={{ marginBottom: '1rem' }}>No applications yet</p>
                  <button onClick={() => setTab('search')} className="btn-primary">Browse Internships</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {applications.slice(0, 3).map((app: Record<string, unknown>) => {
                    const intern = app.internshipId as Record<string,unknown>;
                    const company = intern?.companyId as Record<string,unknown>;
                    return (
                      <div key={app._id as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏢</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{intern?.title as string}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{company?.companyName as string}</div>
                          </div>
                        </div>
                        <span className={`badge ${STATUS_CLASSES[app.status as string] || 'badge-applied'}`}>{STATUS_LABELS[app.status as string] || app.status as string}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEARCH */}
        {tab === 'search' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Find Internships 🔍</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Discover opportunities matching your skills</p></div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <input className="input" style={{ flex: 1, minWidth: '200px' }} placeholder="Search by title, skill..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="input" style={{ width: 'auto', minWidth: '140px' }} value={locationType} onChange={e => setLocationType(e.target.value)}>
                <option value="">All Types</option>
                {['remote','hybrid','onsite'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
              {internships.map((intern: Record<string,unknown>) => {
                const company = intern.companyId as Record<string,string>;
                const skills = intern.skillsRequired as string[];
                const alreadyApplied = appliedIds.includes(intern._id as string);
                return (
                  <div key={intern._id as string} className="internship-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏢</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{intern.title as string}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{company?.companyName}</div>
                        </div>
                      </div>
                      <span className={`badge badge-${intern.locationType}`}>{intern.locationType as string}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span>📍 {intern.location as string}</span><span>⏱ {intern.duration as string}</span><span>💰 ₹{(intern.stipend as number)?.toLocaleString()}/mo</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {skills?.slice(0,3).map(s => <span key={s} className="chip">{s}</span>)}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{intern.description as string}</p>
                    {alreadyApplied ? (
                      <div style={{ textAlign: 'center', padding: '0.6rem', background: 'rgba(16,185,129,0.08)', borderRadius: 8, color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>✅ Applied</div>
                    ) : (
                      <button onClick={() => setApplyingTo(intern._id as string)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Apply Now</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        {tab === 'applications' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Applications 📋</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{applications.length} application{applications.length !== 1 ? 's' : ''} total</p></div>
            </div>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No applications yet</h3>
                <p style={{ marginBottom: '1.5rem' }}>Start applying to internships to track them here</p>
                <button onClick={() => setTab('search')} className="btn-primary">Browse Internships</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.map((app: Record<string,unknown>) => {
                  const intern = app.internshipId as Record<string,unknown>;
                  const company = intern?.companyId as Record<string,unknown>;
                  return (
                    <div key={app._id as string} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 12, background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🏢</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{intern?.title as string}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{company?.companyName as string} · Applied {new Date(app.appliedDate as string).toLocaleDateString()}</div>
                          {app.status === 'interview_scheduled' && app.interviewDate && (
                            <div style={{ color: '#38bdf8', fontSize: '0.8rem', marginTop: '0.25rem' }}>📅 Interview: {new Date(app.interviewDate as string).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                      <span className={`badge ${STATUS_CLASSES[app.status as string] || 'badge-applied'}`}>{STATUS_LABELS[app.status as string] || app.status as string}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Profile 👤</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Complete your profile to stand out to recruiters</p></div>
              <button onClick={handleSaveProfile} className="btn-primary" disabled={saving}>{saving ? '⏳ Saving...' : '💾 Save Changes'}</button>
            </div>
            {/* Profile completion */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600 }}>Profile Strength — {profileStrength}%</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{profileStrength < 50 ? '🔴 Basic' : profileStrength < 80 ? '🟡 Good' : '🟢 Strong'}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${profileStrength}%` }} /></div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {[['📞 Phone', !!(profileEdit.phone)], ['🎓 College', !!(profileEdit.college)], ['📄 Resume', !!(profileEdit.resumeUrl)], ['💡 Skills (3+)', ((profileEdit.skills as string[])?.length || 0) >= 3], ['🔗 LinkedIn', !!(profileEdit.linkedinUrl)]].map(([label, done]) => (
                  <span key={label as string} style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.78rem', background: done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, color: done ? '#34d399' : 'var(--text-muted)' }}>{done ? '✅' : '⬜'} {label as string}</span>
                ))}
              </div>
            </div>
            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Personal Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[['Phone', 'phone', 'text', '+91 9876543210'], ['College', 'college', 'text', 'IIT Delhi'], ['Degree', 'degree', 'text', 'B.Tech Computer Science'], ['Year', 'year', 'text', '3rd Year'], ['LinkedIn URL', 'linkedinUrl', 'url', 'https://linkedin.com/in/...'], ['GitHub URL', 'githubUrl', 'url', 'https://github.com/...'], ['Portfolio', 'portfolioUrl', 'url', 'https://yourportfolio.com']].map(([label, key, type, ph]) => (
                    <div key={key as string}>
                      <label className="label">{label as string}</label>
                      <input className="input" type={type as string} placeholder={ph as string} value={(profileEdit[key as string] as string) || ''} onChange={e => setProfileEdit(p => ({ ...p, [key as string]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label className="label">Bio</label>
                    <textarea className="input" style={{ resize: 'vertical', minHeight: '80px' }} placeholder="Tell recruiters about yourself..." value={(profileEdit.bio as string) || ''} onChange={e => setProfileEdit(p => ({ ...p, bio: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Resume URL (Google Drive / Dropbox link)</label>
                    <input className="input" type="url" placeholder="https://drive.google.com/..." value={(profileEdit.resumeUrl as string) || ''} onChange={e => setProfileEdit(p => ({ ...p, resumeUrl: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Skills</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input className="input" placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} list="skills-list" />
                  <datalist id="skills-list">{SKILLS_LIST.map(s => <option key={s} value={s} />)}</datalist>
                  <button onClick={addSkill} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Add</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {((profileEdit.skills as string[]) || []).map((s: string) => (
                    <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.8rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, fontSize: '0.85rem', color: 'var(--primary-light)' }}>
                      {s} <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                  ))}
                  {((profileEdit.skills as string[]) || []).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No skills added yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === 'notifications' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Notifications 🔔</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{notifCount} unread</p></div>
              {notifCount > 0 && <button onClick={() => { apiMarkAllRead(); setNotifications(n => n.map(x => ({ ...x, isRead: true }))); setNotifCount(0); }} className="btn-secondary">Mark all read</button>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔕</div><p>No notifications yet</p></div>
              ) : notifications.map((n: Record<string,unknown>) => {
                const typeColors: Record<string,string> = { shortlist: '#f59e0b', interview: '#0ea5e9', offer: '#10b981', rejection: '#ef4444', application: '#6366f1', system: '#8b5cf6' };
                const color = typeColors[n.type as string] || '#6366f1';
                return (
                  <div key={n._id as string} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: n.isRead ? 'var(--bg-card)' : 'rgba(99,102,241,0.08)', border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(99,102,241,0.25)'}`, borderRadius: 12, transition: 'all 0.2s' }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, border: `1px solid ${color}40` }}>
                      {n.type === 'shortlist' ? '⭐' : n.type === 'interview' ? '📅' : n.type === 'offer' ? '🏆' : n.type === 'rejection' ? '❌' : '📋'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.25rem' }}>{n.title as string}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{n.message as string}</div>
                    </div>
                    {!n.isRead && <div className="notif-dot" style={{ marginTop: '0.5rem', flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Apply modal */}
      {applyingTo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem' }}>📝 Submit Application</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Cover Letter (Optional)</label>
              <textarea className="input" style={{ minHeight: '120px', resize: 'vertical' }} placeholder="Tell the recruiter why you're a great fit..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleApply(applyingTo)} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit Application 🚀</button>
              <button onClick={() => { setApplyingTo(null); setCoverLetter(''); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
