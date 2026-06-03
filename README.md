# InternHub — Internship Management Platform

> Complete Product Design Case Study + Working Prototype  
> Built for a **Product Thinking & Design Challenge**

---

## 🚀 Quick Start (Demo Mode — No Backend Needed)

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Run the frontend
npm run dev

# 3. Open in browser
http://localhost:3000
```

Click any **Demo** button on the landing page to instantly explore all three role dashboards with realistic mock data.

---

## 🖥️ Full Stack Setup (Local MongoDB + Compass)

```bash
# 1. Install all dependencies
npm run install:all

# 2. Seed the local MongoDB database
npm run seed

# 3. Start both servers concurrently
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **MongoDB Compass**: Connect to `mongodb://127.0.0.1:27017/internship-management` to inspect all collection data!

---

## 📋 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with search, stats, demo login |
| `/internships` | Browse all internships with filters |
| `/internships/[id]` | Internship detail + apply |
| `/auth/login` | Login with role demo buttons |
| `/auth/register` | Register as student or recruiter |
| `/dashboard/student` | Student dashboard (5 tabs) |
| `/dashboard/recruiter` | Recruiter portal (4 tabs) |
| `/dashboard/admin` | Admin panel (4 tabs) |
| `/case-study` | Interactive 8-slide product presentation |

---

## 🎯 Feature Highlights

### Student Dashboard
- **Gamified Profile** — Profile strength % + achievement badges
- **Application Tracker** — Live status pipeline (Applied → Offered)
- **Internship Search** — Filter by skill, location, type, stipend
- **Notifications** — All status updates in one drawer

### Recruiter Dashboard
- **Kanban Pipeline** — Visual applicant funnel
- **Applicant Review** — Score, notes, interview scheduling
- **Post Internship** — Form with live preview card
- **Collaboration** — Recruiter notes per applicant

### Admin Dashboard
- **Company Approvals** — Click-to-approve pending recruiters
- **User Management** — Search, filter, remove users
- **Analytics** — Bar charts, funnel charts, category breakdown
- **Export Reports** — One-click mock PDF export

### Case Study Slides
1. Problem Statement
2. User Personas
3. Solution Overview
4. User Journey Maps
5. Feature Set
6. Database ER Diagram
7. Tech Stack
8. MVP Roadmap

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, App Router |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + Role-Based Access Control |
| Mock Mode | In-memory fallback (no DB needed for demo) |
| Deployment | Vercel (FE) + Render (BE) |

---

## 🗄️ Database Models

- **User** — Base auth (Student / Recruiter / Admin)
- **Student** — Profile, skills, badges, profileStrength
- **Company** — Company info, isApproved flag
- **Internship** — Job details, filters, openings
- **Application** — Status pipeline, recruiter notes/score
- **Notification** — Event-driven alerts per user

---

## 📡 API Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/internships          (public, supports filters)
GET  /api/internships/:id
POST /api/internships          (recruiter only)
PUT  /api/internships/:id
DELETE /api/internships/:id

GET  /api/student/profile      (student)
PUT  /api/student/profile
GET  /api/student/applications

POST /api/applications         (student)
GET  /api/applications         (recruiter/admin)
PUT  /api/applications/:id/status

GET  /api/admin/stats          (admin)
GET  /api/admin/users
DELETE /api/admin/users/:id
GET  /api/admin/companies/pending
PUT  /api/admin/companies/:id/approve
GET  /api/admin/analytics

GET  /api/notifications
PUT  /api/notifications/:id/read
PUT  /api/notifications/read-all
```

---

## 🏆 Evaluation Criteria

| Criterion | Implementation |
|-----------|---------------|
| Product Thinking | Every feature solves a documented user pain point |
| Creativity | Gamified profiles, achievement badges, live preview, demo mode |
| Communication | 8-slide interactive case study presentation |
| Collaboration | Recruiter notes, scores, interview scheduling |
| Leadership | Admin analytics, approval workflow, platform monitoring |

---

Built with ❤️ for the Xebia Internship Design Challenge
