# InternHub Backend — Node.js & Express API

The backend server for **InternHub** handles user authentication, student profiles, recruiter/company management, internship postings, applications workflow, and in-app notifications.

## 🛠️ Tech Stack & Libraries

- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Local MongoDB via Mongoose
- **Authentication**: JWT (JSON Web Tokens) with custom role-checking middleware
- **Development Tools**: `ts-node-dev` for hot-reloads

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Local MongoDB running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### Configuration
Create a `.env` file in this directory (a template is available in `.env.example`):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/internship-management
JWT_SECRET=internship_platform_super_secret_key_2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### Installation & Run
```bash
# 1. Install backend dependencies
npm install

# 2. Seed database collections with default data
npm run seed

# 3. Start development server
npm run dev
```

The server will start on [http://localhost:5000](http://localhost:5000) and the API endpoints will be accessible under `/api`.

---

## 📁 File Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.ts          # MongoDB connection helper
│   ├── controllers/       # Route request handlers
│   │   ├── authController.ts
│   │   ├── studentController.ts
│   │   ├── internshipController.ts
│   │   ├── applicationController.ts
│   │   └── adminController.ts
│   ├── middleware/        # JWT Authentication & RBAC (Role-Based Access Control)
│   │   └── auth.ts
│   ├── models/            # Mongoose Schemas & Database Entities
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Company.ts
│   │   ├── Internship.ts
│   │   ├── Application.ts
│   │   └── Notification.ts
│   ├── routes/            # Express route bindings
│   ├── seed.ts            # Database seeding script
│   └── server.ts          # Main Express application entrypoint
├── package.json
└── tsconfig.json
```

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /register` — Register a student or recruiter account.
- `POST /login` — Log in and receive JWT token.
- `GET /me` — Get current logged-in user profile (requires Token).

### 🎓 Student Profiles (`/api/student`)
- `GET /profile` — Retrieve current student profile details, skills, and badges.
- `PUT /profile` — Update student profile data.
- `GET /applications` — Fetch internships applied to by this student.

### 💼 Internship Listings (`/api/internships`)
- `GET /` — List active internships (supports queries: search, category, locationType).
- `GET /:id` — Get internship details by ID.
- `POST /` — Create an internship (Recruiters only).
- `PUT /:id` — Update internship details (Recruiters only).
- `DELETE /:id` — Delete internship (Recruiters only).

### 🎯 Applications (`/api/applications`)
- `POST /` — Submit internship application (Students only).
- `GET /` — List applications (Recruiters view applicants, Admins view system-wide).
- `PUT /:id/status` — Move application through the pipeline: `applied` ➔ `shortlisted` ➔ `interview_scheduled` ➔ `offered` ➔ `rejected` ➔ `completed` (Recruiters only).

### 🛡️ Admin Center (`/api/admin`)
- `GET /stats` — Fetch dashboard metrics.
- `GET /users` — Get all users table.
- `DELETE /users/:id` — Remove a user account.
- `GET /companies/pending` — List recruiters awaiting company verification.
- `PUT /companies/:id/approve` — Approve recruiter company profile.
- `GET /analytics` — Fetch data for charting (funnels, registrations).

### 🔔 Notifications (`/api/notifications`)
- `GET /` — Retrieve notifications for current user.
- `PUT /:id/read` — Mark notification as read.
- `PUT /read-all` — Mark all user notifications as read.
