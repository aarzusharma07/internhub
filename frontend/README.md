# InternHub Frontend — Next.js 15 Client

The frontend client for **InternHub** is a high-fidelity SaaS portal built with **Next.js 15** (App Router), featuring premium glassmorphism dark theme aesthetics, custom charts, profile progress indicators, and an interactive pitch presentation.

---

## 🎨 Design System & Theme Details

The platform uses a unified dark design system defined in [globals.css](file:///c:/Users/Abhinav/OneDrive/Desktop/uiux/xebia%20internship/internship%20management%20system/frontend/src/app/globals.css):
- **Backgrounds**: Slate Dark (`#0f0f1a`) and Card Glass (`rgba(25, 25, 45, 0.45)`)
- **Primary Accents**: Indigo (`#6366f1`) and Purple (`#8b5cf6`)
- **Visual Enhancements**: Soft glowing orbs, backdrop blurs (backdropFilter: `blur(20px)`), fadeInUp animations, and scale/hover effects.

---

## ⚡ Mock-Mode & Resilience

To allow seamless reviews and instant usability without requiring a local database, the client utilizes a **Mock Fallback Pattern**:
- All server API calls are routed via `api.ts`.
- If the backend server (on `http://localhost:5000`) is offline, the fetch operations fail gracefully, and the frontend automatically serves realistic mock data loaded from [mockData.ts](file:///c:/Users/Abhinav/OneDrive/Desktop/uiux/xebia%20internship/internship%20management%20system/frontend/src/lib/mockData.ts).
- An indicator banner is shown on top when running in Mock/Demo mode.

---

## 🚀 Getting Started

### Installation & Launch
```bash
# 1. Install frontend dependencies
npm install

# 2. Launch Next.js dev server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🖥️ Routes Structure

| Route | Description |
|-------|-------------|
| `/` | Landing page with interactive stats, filterable internships, and instant role login toggles |
| `/auth/login` | Login page with manual credentials and instant one-click demo login buttons |
| `/auth/register` | Sign up portal for both Students and Recruiter accounts |
| `/internships` | Job explorer displaying listings with sidebar filters (Type, Category, Stipend) |
| `/internships/[id]` | Detailed description view with inline application modal and cover letter upload |
| `/dashboard/student` | 5-Tab Workspace: Overview, Job Search, My Applications, Profile Strength Check, Notifications |
| `/dashboard/recruiter` | 4-Tab Recruiter Portal: Kanban Pipeline (Applied ➔ Offered), Post Job with live preview card, Active Postings, Applicant Notes |
| `/dashboard/admin` | 4-Tab Panel: Platform KPI cards, Recruiter approvals, User Manager table, Recharts metrics |
| `/case-study` | 8-slide interactive slider pitch presentation demonstrating Product Design decisions |

---

## 📁 Folder Layout

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Main layout wrapper & Auth provider
│   │   ├── globals.css        # Theme stylesheet & animation definitions
│   │   ├── page.tsx           # Home landing page
│   │   ├── auth/              # Login & register pages
│   │   ├── dashboard/         # Role dashboards
│   │   ├── internships/       # Job listing & detail pages
│   │   └── case-study/        # 8-slide pitch component
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state & demo credentials
│   └── lib/
│       ├── api.ts             # API client with fallback fallback handler
│       └── mockData.ts        # Seed mock structures
├── public/                    # Static assets
├── next.config.ts
├── package.json
└── tsconfig.json
```
