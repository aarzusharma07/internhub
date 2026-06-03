'use client';
import { useState } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 1, tag: '01 / Problem Statement', title: 'The Internship Problem',
    content: null,
    custom: 'problem',
  },
  {
    id: 2, tag: '02 / Target Users', title: 'Who Are We Building For?',
    content: null,
    custom: 'users',
  },
  {
    id: 3, tag: '03 / Solution', title: 'InternHub — One Platform, Complete Journey',
    content: null,
    custom: 'solution',
  },
  {
    id: 4, tag: '04 / User Journey', title: 'End-to-End User Flows',
    content: null,
    custom: 'journey',
  },
  {
    id: 5, tag: '05 / Key Features', title: 'Feature Set',
    content: null,
    custom: 'features',
  },
  {
    id: 6, tag: '06 / Database Design', title: 'Data Architecture',
    content: null,
    custom: 'database',
  },
  {
    id: 7, tag: '07 / Tech Stack', title: 'Technology Stack',
    content: null,
    custom: 'techstack',
  },
  {
    id: 8, tag: '08 / MVP Roadmap', title: 'Product Roadmap',
    content: null,
    custom: 'roadmap',
  },
];

const PROBLEM_POINTS = [
  { icon: '🎓', who: 'Students', pain: 'No centralized platform to find internships. Hard to track applications and miss interview updates.' },
  { icon: '🏢', who: 'Recruiters', pain: 'Flooded with applicants, manual screening is inefficient, interview scheduling is chaotic.' },
  { icon: '🏛️', who: 'Colleges', pain: 'Zero visibility into student internship progress or placement outcomes.' },
];

const FEATURES = [
  { cat: 'Authentication', icon: '🔐', items: ['JWT Role-Based Login', 'Student / Recruiter / Admin', 'Demo Mode (instant access)'] },
  { cat: 'Student Tools', icon: '🎓', items: ['Gamified Profile (strength %)', 'Achievement Badges', 'Application Pipeline Tracker', 'Internship Search + Filters'] },
  { cat: 'Recruiter Tools', icon: '🏢', items: ['Internship Posting + Live Preview', 'Kanban Applicant Pipeline', 'Score & Notes Collaboration', 'Interview Scheduler'] },
  { cat: 'Admin Tools', icon: '🛡️', items: ['Company Approval Workflow', 'User Management Table', 'Platform Analytics Dashboard', 'Bar Charts + Funnel View'] },
  { cat: 'Search System', icon: '🔍', items: ['Title / Skill / Location', 'Stipend Range Filter', 'Remote / Hybrid / Onsite', 'Category Tabs'] },
  { cat: 'Notifications', icon: '🔔', items: ['Applied → Shortlisted → Offered', 'Interview Scheduled Alert', 'In-app Notification Drawer', 'Mark All Read'] },
];

const TECH_STACK = [
  { layer: 'Frontend', items: [{ name: 'Next.js 15', icon: '⚡' }, { name: 'TypeScript', icon: '📘' }, { name: 'Tailwind CSS', icon: '🎨' }, { name: 'App Router', icon: '🔀' }], color: '#6366f1' },
  { layer: 'Backend', items: [{ name: 'Node.js', icon: '🟢' }, { name: 'Express.js', icon: '🚂' }, { name: 'TypeScript', icon: '📘' }, { name: 'JWT Auth', icon: '🔐' }], color: '#8b5cf6' },
  { layer: 'Database', items: [{ name: 'MongoDB Atlas', icon: '🍃' }, { name: 'Mongoose ODM', icon: '🗄️' }, { name: 'Mock Fallback', icon: '⚡' }], color: '#10b981' },
  { layer: 'Deployment', items: [{ name: 'Vercel (FE)', icon: '▲' }, { name: 'Render (BE)', icon: '🚀' }, { name: 'Cloudinary', icon: '☁️' }], color: '#f59e0b' },
];

const DB_ENTITIES = [
  { name: 'User', color: '#6366f1', fields: ['id', 'name', 'email', 'password', 'role', 'status'] },
  { name: 'Student', color: '#8b5cf6', fields: ['userId →', 'skills[]', 'resumeUrl', 'badges[]', 'profileStrength'] },
  { name: 'Company', color: '#06b6d4', fields: ['userId →', 'companyName', 'industry', 'isApproved'] },
  { name: 'Internship', color: '#10b981', fields: ['companyId →', 'title', 'stipend', 'locationType', 'skillsRequired[]'] },
  { name: 'Application', color: '#f59e0b', fields: ['studentId →', 'internshipId →', 'status', 'interviewDate', 'recruiterNotes'] },
  { name: 'Notification', color: '#ef4444', fields: ['userId →', 'type', 'title', 'isRead'] },
];

const ROADMAP = [
  { phase: 'Phase 1 — MVP', status: 'done', color: '#10b981', items: ['JWT Authentication & RBAC', 'Student Dashboard', 'Recruiter Dashboard', 'Admin Dashboard', 'Internship Search & Filters', 'Application Tracking'] },
  { phase: 'Phase 2 — Growth', status: 'next', color: '#6366f1', items: ['Real-time Notifications (WebSockets)', 'Advanced Analytics & Reports', 'Resume Parsing (PDF)', 'Email Notifications (SendGrid)', 'Mobile Responsive Polish'] },
  { phase: 'Phase 3 — AI', status: 'future', color: '#8b5cf6', items: ['AI Internship Recommendations', 'AI Resume Screening & Scoring', 'Video Interview Integration', 'Skill Assessment Tests', 'Certificate Generation', 'College Portal Integration'] },
];

export default function CaseStudyPage() {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🎓</div>
          <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1rem' }}>InternHub</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Product Design Case Study</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 20 : 8, height: 8, borderRadius: 4, background: i === slide ? 'var(--primary)' : 'rgba(99,102,241,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{slide + 1}/{SLIDES.length}</span>
          <Link href="/auth/login" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Try Demo →</Link>
        </div>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, paddingTop: '56px', minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 4rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div className="orb orb-1" /><div className="orb orb-2" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '0.3rem 0.9rem', fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {current.tag}
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>{current.title}</h2>

          {/* PROBLEM */}
          {current.custom === 'problem' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
              {PROBLEM_POINTS.map(p => (
                <div key={p.who} className="card" style={{ borderTop: '3px solid #ef4444' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.1rem' }}>{p.who}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>{p.pain}</p>
                </div>
              ))}
              <div className="card" style={{ gridColumn: '1/-1', background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}>
                <p style={{ textAlign: 'center', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.7 }}>
                  💡 <span style={{ color: '#f87171' }}>Core Problem:</span> No single platform connects students, recruiters, and colleges to manage the <em>complete</em> internship lifecycle efficiently.
                </p>
              </div>
            </div>
          )}

          {/* USERS */}
          {current.custom === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
              {[
                { icon: '🎓', role: 'Student — Priya, 21', color: '#6366f1', college: 'IIT Delhi, B.Tech CS', goals: ['Find relevant internships fast', 'Track all applications in one place', 'Get interview alerts', 'Build a strong profile'], pain: ['Juggling 5 different job portals', 'Misses interview emails', 'No personalized matches'] },
                { icon: '🏢', role: 'Recruiter — Rahul, HR', color: '#8b5cf6', college: 'TechNova Labs', goals: ['Post openings quickly', 'Screen applicants efficiently', 'Collaborate with team', 'Schedule interviews at scale'], pain: ['100s of unqualified applicants', 'Excel sheets for tracking', 'Communication gaps'] },
                { icon: '🛡️', role: 'Admin — Platform Ops', color: '#06b6d4', college: 'InternHub Team', goals: ['Maintain platform quality', 'Approve verified companies', 'Monitor growth metrics', 'Generate reports'], pain: ['No unified dashboard', 'Manual approval emails', 'No analytics visibility'] },
              ].map(u => (
                <div key={u.role} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${u.color}25`, border: `2px solid ${u.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{u.icon}</div>
                    <div><div style={{ fontWeight: 700 }}>{u.role}</div><div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{u.college}</div></div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: u.color, fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Goals</div>
                    {u.goals.map(g => <div key={g} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>✅ {g}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pain Points</div>
                    {u.pain.map(p => <div key={p} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>⚠️ {p}</div>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SOLUTION */}
          {current.custom === 'solution' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
              {[
                { icon: '🎯', title: 'Centralized Portal', desc: 'One platform for all internship needs — search, apply, track, and get hired.' },
                { icon: '🤖', title: 'Smart Matching', desc: 'Skill-based internship recommendations. Find roles that actually match your profile.' },
                { icon: '📊', title: 'Live Dashboards', desc: 'Real-time application status, recruiter pipeline, and admin analytics.' },
                { icon: '🏅', title: 'Gamified Profiles', desc: 'Profile strength meter, achievement badges. Students compete to be top applicants.' },
                { icon: '🔔', title: 'Smart Notifications', desc: 'Never miss shortlisting, interview schedules, or offer letters.' },
                { icon: '👥', title: 'Team Collaboration', desc: 'Recruiters can share notes, scores, and interview feedback on applicants.' },
                { icon: '🛡️', title: 'Verified Companies', desc: 'Admin approval workflow ensures only legitimate companies post internships.' },
                { icon: '📈', title: 'Actionable Analytics', desc: 'Platform-wide insights on applications, categories, growth, and hiring funnel.' },
              ].map(s => (
                <div key={s.title} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{s.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* JOURNEY */}
          {current.custom === 'journey' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
              {[
                { title: 'Student Journey', color: '#6366f1', steps: ['1. Register & Create Profile', '2. Upload Resume + Add Skills', '3. Search & Filter Internships', '4. Apply with Cover Letter', '5. Track Status in Dashboard', '6. Attend Interview', '7. Receive Offer 🏆', '8. Complete Internship'] },
                { title: 'Recruiter Journey', color: '#8b5cf6', steps: ['1. Register Company', '2. Await Admin Approval ✅', '3. Post Internship (Live Preview)', '4. Receive Applications', '5. Review Applicants + Score', '6. Shortlist → Interview', '7. Release Offer', '8. Mark Completed'] },
                { title: 'Admin Journey', color: '#06b6d4', steps: ['1. Login to Admin Portal', '2. Approve Company Registrations', '3. Monitor All Users', '4. Review Platform Activity', '5. View Analytics Dashboard', '6. Export Reports', '7. Suspend Bad Actors', '8. Track Growth Metrics'] },
              ].map(flow => (
                <div key={flow.title} className="card">
                  <h3 style={{ fontWeight: 700, color: flow.color, marginBottom: '1.25rem', fontSize: '1rem' }}>{flow.title}</h3>
                  {flow.steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${flow.color}20`, border: `1px solid ${flow.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: flow.color, flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>{s.substring(3)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* FEATURES */}
          {current.custom === 'features' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {FEATURES.map(f => (
                <div key={f.cat} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{f.cat}</span>
                  </div>
                  {f.items.map(item => <div key={item} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>▸</span>{item}</div>)}
                </div>
              ))}
            </div>
          )}

          {/* DATABASE */}
          {current.custom === 'database' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {DB_ENTITIES.map(e => (
                  <div key={e.name} className="card" style={{ padding: '1.1rem', borderTop: `3px solid ${e.color}` }}>
                    <div style={{ fontWeight: 800, color: e.color, marginBottom: '0.75rem', fontSize: '1rem' }}>{e.name}</div>
                    {e.fields.map(f => <div key={f} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.25rem' }}>{f.endsWith(' →') ? <span style={{ color: '#f59e0b' }}>{f}</span> : f.endsWith('[]') ? <span style={{ color: '#06b6d4' }}>{f}</span> : f}</div>)}
                  </div>
                ))}
              </div>
              <div className="card" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                  {[['→ ', 'Foreign Key Reference', '#f59e0b'], ['[]', 'Array Field', '#06b6d4'], ['plain', 'Scalar Field', 'var(--text-muted)']].map(([sym, label, color]) => (
                    <span key={label as string} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', color: color as string, fontWeight: 700 }}>{sym as string}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{label as string}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TECH STACK */}
          {current.custom === 'techstack' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem' }}>
              {TECH_STACK.map(layer => (
                <div key={layer.layer} className="card" style={{ borderLeft: `4px solid ${layer.color}` }}>
                  <div style={{ fontWeight: 800, color: layer.color, marginBottom: '1.25rem', fontSize: '1.05rem' }}>{layer.layer}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
                    {layer.items.map(item => (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', background: `${layer.color}10`, borderRadius: 8, border: `1px solid ${layer.color}25` }}>
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ROADMAP */}
          {current.custom === 'roadmap' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
              {ROADMAP.map(phase => (
                <div key={phase.phase} className="card" style={{ borderTop: `3px solid ${phase.color}`, position: 'relative', overflow: 'hidden' }}>
                  {phase.status === 'done' && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>✅ BUILT</div>}
                  {phase.status === 'next' && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 700 }}>🔜 NEXT</div>}
                  {phase.status === 'future' && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 12, padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: '#a78bfa', fontWeight: 700 }}>🔮 FUTURE</div>}
                  <h3 style={{ fontWeight: 800, color: phase.color, marginBottom: '1.25rem', fontSize: '0.95rem' }}>{phase.phase}</h3>
                  {phase.items.map(item => (
                    <div key={item} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: phase.color, flexShrink: 0 }}>▸</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 100 }}>
        <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0} style={{ padding: '0.65rem 1.5rem', borderRadius: 10, border: '1px solid var(--border)', background: slide === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.12)', color: slide === 0 ? 'var(--text-muted)' : 'var(--primary-light)', cursor: slide === 0 ? 'default' : 'pointer', fontWeight: 600, fontSize: '0.9rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}>← Prev</button>
        <div style={{ background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.5rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{slide + 1} / {SLIDES.length}</div>
        {slide === SLIDES.length - 1 ? (
          <Link href="/auth/login" className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>Try the App 🚀</Link>
        ) : (
          <button onClick={() => setSlide(s => Math.min(SLIDES.length - 1, s + 1))} style={{ padding: '0.65rem 1.5rem', borderRadius: 10, border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}>Next →</button>
        )}
      </div>
    </div>
  );
}
