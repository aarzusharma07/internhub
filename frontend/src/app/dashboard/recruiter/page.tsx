'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGetApplicants, apiUpdateStatus, apiGetInternships, apiCreateInternship } from '@/lib/api';

const STATUS_LABELS: Record<string,string> = { applied: '📋 Applied', under_review: '🔍 Under Review', shortlisted: '⭐ Shortlisted', interview_scheduled: '📅 Interview', offered: '🏆 Offered', rejected: '❌ Rejected', completed: '✅ Completed' };
const STATUS_CLASSES: Record<string,string> = { applied: 'badge-applied', under_review: 'badge-applied', shortlisted: 'badge-shortlisted', interview_scheduled: 'badge-interview', offered: 'badge-offered', rejected: 'badge-rejected', completed: 'badge-completed' };

const BLANK_JOB = { title: '', description: '', stipend: 15000, duration: '3 Months', location: '', locationType: 'remote', skillsRequired: '', category: 'Engineering', openings: 2, deadline: '' };

export default function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'overview'|'applicants'|'post'|'internships'>('overview');
  const [applicants, setApplicants] = useState<Record<string,unknown>[]>([]);
  const [internships, setInternships] = useState<Record<string,unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<Record<string,unknown>|null>(null);
  const [noteText, setNoteText] = useState('');
  const [scoreText, setScoreText] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [jobForm, setJobForm] = useState(BLANK_JOB);
  const [posting, setPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'recruiter') { router.push(`/dashboard/${user.role}`); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [aData, iData] = await Promise.all([apiGetApplicants(), apiGetInternships()]);
    if (aData?.success) setApplicants(aData.applications);
    if (iData?.success) setInternships(iData.internships.slice(0,6));
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const body: Record<string,unknown> = { status, recruiterNotes: noteText, recruiterScore: scoreText ? Number(scoreText) : undefined };
    if (status === 'interview_scheduled' && interviewDate) body.interviewDate = interviewDate;
    await apiUpdateStatus(id, body);
    setSelectedApp(null); setNoteText(''); setScoreText(''); setInterviewDate('');
    setSuccessMsg(`Status updated to ${status.replace('_',' ')}! ✅`); setTimeout(() => setSuccessMsg(''), 3000);
    loadData();
  };

  const handlePost = async () => {
    setPosting(true);
    const payload = { ...jobForm, skillsRequired: jobForm.skillsRequired.split(',').map(s => s.trim()).filter(Boolean) };
    await apiCreateInternship(payload);
    setPosting(false); setJobForm(BLANK_JOB);
    setSuccessMsg('Internship posted successfully! 🎉'); setTimeout(() => setSuccessMsg(''), 3000);
    loadData(); setTab('internships');
  };

  const filteredApplicants = statusFilter ? applicants.filter(a => a.status === statusFilter) : applicants;
  const counts = {
    total: applicants.length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    interview: applicants.filter(a => a.status === 'interview_scheduled').length,
    offered: applicants.filter(a => a.status === 'offered').length,
  };

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'applicants', icon: '👥', label: 'Applicants' },
    { id: 'post', icon: '➕', label: 'Post Internship' },
    { id: 'internships', icon: '💼', label: 'Browse All' },
  ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(139,92,246,0.08)', borderRadius: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '1rem' }}>{user?.name?.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ color: '#a78bfa', fontSize: '0.75rem' }}>Recruiter</div>
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
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Recruiter Portal 🏢</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage your internship postings & applicants</p></div>
              <button onClick={() => setTab('post')} className="btn-primary">+ Post Internship</button>
            </div>
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              {[
                { icon: '👥', label: 'Total Applicants', value: counts.total, color: '#6366f1' },
                { icon: '⭐', label: 'Shortlisted', value: counts.shortlisted, color: '#f59e0b' },
                { icon: '📅', label: 'Interviews', value: counts.interview, color: '#0ea5e9' },
                { icon: '🏆', label: 'Offered', value: counts.offered, color: '#10b981' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                  <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pipeline kanban */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📊 Applicant Pipeline</h3>
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {[
                  { status: 'applied', label: 'Applied', color: '#6366f1', bgColor: 'rgba(99,102,241,0.08)' },
                  { status: 'shortlisted', label: 'Shortlisted', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
                  { status: 'interview_scheduled', label: 'Interview', color: '#0ea5e9', bgColor: 'rgba(14,165,233,0.08)' },
                  { status: 'offered', label: 'Offered', color: '#10b981', bgColor: 'rgba(16,185,129,0.08)' },
                ].map(col => {
                  const colApps = applicants.filter(a => a.status === col.status);
                  return (
                    <div key={col.status} style={{ minWidth: '200px', flex: 1, background: col.bgColor, borderRadius: 12, padding: '1rem', border: `1px solid ${col.color}30` }}>
                      <div style={{ fontWeight: 700, color: col.color, marginBottom: '0.75rem', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between' }}>
                        {col.label} <span style={{ background: `${col.color}25`, padding: '0.15rem 0.5rem', borderRadius: 10 }}>{colApps.length}</span>
                      </div>
                      {colApps.slice(0, 3).map((app: Record<string,unknown>) => {
                        const student = app.studentId as Record<string,unknown>;
                        const su = student?.userId as Record<string,unknown>;
                        return (
                          <div key={app._id as string} style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '0.6rem', marginBottom: '0.5rem', cursor: 'pointer', border: '1px solid var(--border)', fontSize: '0.82rem' }} onClick={() => { setSelectedApp(app); setTab('applicants'); }}>
                            <div style={{ fontWeight: 600 }}>{su?.name as string}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{(student?.college as string) || (student?.skills as string[])?.[0]}</div>
                          </div>
                        );
                      })}
                      {colApps.length > 3 && <div style={{ color: col.color, fontSize: '0.78rem', textAlign: 'center', marginTop: '0.25rem' }}>+{colApps.length - 3} more</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* APPLICANTS */}
        {tab === 'applicants' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Applicants 👥</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}</p></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select className="input" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  {['applied','under_review','shortlisted','interview_scheduled','offered','rejected'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ minWidth: '800px' }}>
                <thead><tr>
                  <th>Candidate</th><th>College</th><th>Skills</th><th>Score</th><th>Applied</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {filteredApplicants.map((app: Record<string,unknown>) => {
                    const student = app.studentId as Record<string,unknown>;
                    const su = student?.userId as Record<string,unknown>;
                    const skills = student?.skills as string[] || [];
                    const badges = student?.badges as string[] || [];
                    return (
                      <tr key={app._id as string}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{(su?.name as string)?.charAt(0)}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{su?.name as string}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{su?.email as string}</div>
                              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.25rem' }}>{badges.slice(0,2).map(b => <span key={b} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: 'rgba(99,102,241,0.12)', borderRadius: 10, color: 'var(--primary-light)' }}>{b}</span>)}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{student?.college as string || '—'}</td>
                        <td><div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>{skills.slice(0,2).map(s => <span key={s} className="chip">{s}</span>)}</div></td>
                        <td style={{ fontWeight: 700, color: app.recruiterScore ? '#34d399' : 'var(--text-muted)' }}>{app.recruiterScore ? `${app.recruiterScore}/10` : '—'}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(app.appliedDate as string).toLocaleDateString()}</td>
                        <td><span className={`badge ${STATUS_CLASSES[app.status as string] || 'badge-applied'}`}>{STATUS_LABELS[app.status as string]}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button onClick={() => { setSelectedApp(app); setNoteText((app.recruiterNotes as string) || ''); setScoreText((app.recruiterScore as number)?.toString() || ''); }} style={{ padding: '0.35rem 0.7rem', borderRadius: 7, border: '1px solid var(--border)', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Review</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredApplicants.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div><p>No applicants found</p></div>}
            </div>
          </div>
        )}

        {/* POST INTERNSHIP */}
        {tab === 'post' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Post Internship ➕</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Create a new internship opportunity</p></div>
            </div>
            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Internship Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {[['Title', 'title', 'text', 'e.g. Frontend Developer Intern'], ['Location', 'location', 'text', 'e.g. Bangalore / Remote']].map(([label, key, type, ph]) => (
                    <div key={key as string}>
                      <label className="label">{label as string}</label>
                      <input className="input" type={type as string} placeholder={ph as string} value={(jobForm as Record<string,unknown>)[key as string] as string} onChange={e => setJobForm(f => ({ ...f, [key as string]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Describe the role, responsibilities, and what the intern will learn..." value={jobForm.description} onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="label">Stipend (₹/month)</label>
                      <input className="input" type="number" value={jobForm.stipend} onChange={e => setJobForm(f => ({ ...f, stipend: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="label">Openings</label>
                      <input className="input" type="number" value={jobForm.openings} onChange={e => setJobForm(f => ({ ...f, openings: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="label">Duration</label>
                      <select className="input" value={jobForm.duration} onChange={e => setJobForm(f => ({ ...f, duration: e.target.value }))}>
                        {['1 Month','2 Months','3 Months','4 Months','6 Months','1 Year'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Location Type</label>
                      <select className="input" value={jobForm.locationType} onChange={e => setJobForm(f => ({ ...f, locationType: e.target.value }))}>
                        {['remote','hybrid','onsite'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Category</label>
                      <select className="input" value={jobForm.category} onChange={e => setJobForm(f => ({ ...f, category: e.target.value }))}>
                        {['Engineering','Design','Data Science','Product','Marketing','Finance','Operations','HR'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Application Deadline</label>
                      <input className="input" type="date" value={jobForm.deadline} onChange={e => setJobForm(f => ({ ...f, deadline: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Required Skills (comma-separated)</label>
                    <input className="input" placeholder="React, TypeScript, Node.js..." value={jobForm.skillsRequired} onChange={e => setJobForm(f => ({ ...f, skillsRequired: e.target.value }))} />
                  </div>
                  <button onClick={handlePost} className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }} disabled={posting || !jobForm.title || !jobForm.description}>
                    {posting ? '⏳ Posting...' : '🚀 Post Internship'}
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>LIVE PREVIEW</h3>
                <div className="internship-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(99,102,241,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏢</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{jobForm.title || 'Internship Title'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.name}</div>
                      </div>
                    </div>
                    <span className={`badge badge-${jobForm.locationType}`}>{jobForm.locationType}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span>📍 {jobForm.location || 'Location'}</span>
                    <span>⏱ {jobForm.duration}</span>
                    <span>💰 ₹{jobForm.stipend.toLocaleString()}/mo</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {jobForm.skillsRequired.split(',').filter(Boolean).slice(0,4).map(s => <span key={s} className="chip">{s.trim()}</span>)}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{jobForm.description || 'Internship description will appear here...'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BROWSE */}
        {tab === 'internships' && (
          <div className="fade-in-up">
            <div className="dashboard-header">
              <div><h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>All Internships 💼</h1><p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Explore the platform&apos;s active internships</p></div>
              <button onClick={() => setTab('post')} className="btn-primary">+ Post New</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
              {internships.map((intern: Record<string,unknown>) => {
                const company = intern.companyId as Record<string,string>;
                const skills = intern.skillsRequired as string[];
                return (
                  <div key={intern._id as string} className="internship-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{intern.title as string}</div>
                      <span className={`badge badge-${intern.locationType}`}>{intern.locationType as string}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{company?.companyName} · {intern.location as string}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {skills?.slice(0,3).map(s => <span key={s} className="chip">{s}</span>)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>💰 ₹{(intern.stipend as number)?.toLocaleString()}/mo</span>
                      <span>👥 {intern.applicationsCount as number} applied</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Review applicant modal */}
      {selectedApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '560px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            {(() => {
              const student = selectedApp.studentId as Record<string,unknown>;
              const su = student?.userId as Record<string,unknown>;
              const skills = student?.skills as string[] || [];
              return <>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem' }}>Review Applicant</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>{(su?.name as string)?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{su?.name as string}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{su?.email as string}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{student?.college as string}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {skills.map(s => <span key={s} className="chip">{s}</span>)}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="label">Recruiter Notes</label>
                  <textarea className="input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Add review notes..." value={noteText} onChange={e => setNoteText(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label className="label">Score (0-10)</label>
                    <input className="input" type="number" min="0" max="10" placeholder="8" value={scoreText} onChange={e => setScoreText(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Interview Date</label>
                    <input className="input" type="datetime-local" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <button onClick={() => handleUpdateStatus(selectedApp._id as string, 'shortlisted')} className="btn-success">⭐ Shortlist</button>
                  <button onClick={() => handleUpdateStatus(selectedApp._id as string, 'interview_scheduled')} style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>📅 Schedule Interview</button>
                  <button onClick={() => handleUpdateStatus(selectedApp._id as string, 'offered')} style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>🏆 Release Offer</button>
                  <button onClick={() => handleUpdateStatus(selectedApp._id as string, 'rejected')} className="btn-danger">❌ Reject</button>
                </div>
                <button onClick={() => setSelectedApp(null)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Close</button>
              </>;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
