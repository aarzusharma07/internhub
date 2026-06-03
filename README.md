# InternHub - AI Powered Internship Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Express.js-Backend-lightgrey?style=for-the-badge&logo=express" />
</p>

<p align="center">
  A modern full-stack Internship Management Platform that streamlines internship discovery, application tracking, recruiter workflows, and administrative management through a scalable and user-friendly architecture.
</p>

---

#  Overview

InternHub is a comprehensive Internship Management Platform designed to bridge the gap between students, recruiters, and administrators.

The platform simplifies the internship hiring lifecycle by providing:

* Internship discovery and application management
* Recruiter hiring workflows
* Student profile management
* Real-time notifications
* Dashboard analytics
* Role-based authentication and authorization

Built using modern web technologies with scalability, security, and user experience in mind.

---

#  Problem Statement

Traditional internship placement systems often suffer from:

* Manual application tracking
* Poor communication between stakeholders
* Lack of centralized management
* Inefficient candidate screening
* Limited visibility into recruitment progress

InternHub addresses these challenges through a centralized and intelligent internship management ecosystem.

---

#  Features

##  Student Portal

* Secure Authentication
* Student Profile Management
* Internship Search & Discovery
* Internship Applications
* Application Tracking
* Notification Center
* Profile Strength Monitoring

---

##  Recruiter Portal

* Company Registration
* Internship Posting
* Applicant Management
* Candidate Shortlisting
* Recruitment Pipeline Management
* Internship Analytics

---

##  Admin Dashboard

* User Management
* Recruiter Approval Workflow
* Platform Monitoring
* Internship Statistics
* Dashboard Analytics
* System Health Overview

---

##  Security Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* Protected Routes
* Secure API Access
* Environment Variable Configuration

---

#  System Architecture

```text
Frontend (Next.js + TypeScript)
                │
                ▼
REST API Layer (Express.js)
                │
                ▼
Authentication Layer (JWT)
                │
                ▼
MongoDB Database
                │
 ┌──────────────┼──────────────┐
 │              │              │
 ▼              ▼              ▼
Users      Internships    Applications
```

---

# 🛠️ Tech Stack

## Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* App Router
* Turbopack

## Backend

* Node.js
* Express.js
* TypeScript
* JWT Authentication

## Database

* MongoDB
* Mongoose

## Development Tools

* ts-node-dev
* Concurrently
* ESLint

---

#  Project Structure

```text
internhub/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── screenshots/
│
├── README.md
│
└── .env
```

---

#  Screenshots

##  Landing Page

![Landing Page](screenshots/landing-page.png)

---

##  Login Page

![Login Page](screenshots/login-page.png)

---

##  Student Dashboard

![Student Dashboard](screenshots/student-dashboard.png)

---

##  Internship Listings

![Internship Listings](screenshots/internships.png)

---

## Recruiter Dashboard

![Recruiter Dashboard](screenshots/recruiter-dashboard.png)

---

##  Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

---

##  Notifications Center

![Notifications](screenshots/notifications.png)

---

##  Analytics Dashboard

![Analytics Dashboard](screenshots/analytics.png)

---

#  Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/internhub.git

cd internhub
```

---

## Install Dependencies

### Root Project

```bash
npm install
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

# 🔧 Environment Variables

Create a `.env` file inside the backend directory.

```env
MONGODB_URI=mongodb://127.0.0.1:27017/internship-management

JWT_SECRET=internship_platform_super_secret_key_2024
JWT_EXPIRES_IN=7d

PORT=5000

NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

---

#  Running the Application

## Start MongoDB

Ensure MongoDB is running locally.

```bash
mongod
```

---

## Start Backend

```bash
cd backend

npm run dev
```

Backend:

```text
http://localhost:5000
```

API:

```text
http://localhost:5000/api
```

---

## Start Frontend

```bash
cd frontend

npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

#  API Modules

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

## Student

```http
GET  /api/student/profile
PUT  /api/student/profile
GET  /api/student/applications
```

---

## Internships

```http
GET    /api/internships
GET    /api/internships/:id
POST   /api/internships
PUT    /api/internships/:id
DELETE /api/internships/:id
```

---

## Applications

```http
POST /api/applications
GET  /api/applications
PUT  /api/applications/:id/status
```

---

## Admin

```http
GET    /api/admin/stats
GET    /api/admin/users
DELETE /api/admin/users/:id
GET    /api/admin/analytics
```

---

#  Future Enhancements

* AI Resume Analysis
* Smart Candidate Matching
* AI Interview Preparation
* Resume Builder
* Real-Time Chat
* Email Notifications
* Mobile Application
* AI Internship Recommendation Engine

---

#  Developed For

### Xebia Internship Program

InternHub demonstrates:

* Full-Stack Development
* REST API Design
* Authentication & Authorization
* Database Management
* Scalable Architecture
* Modern UI/UX Design
* Product Thinking & System Design

---

#  License

This project is developed for educational and internship evaluation purposes.

© 2026 InternHub. All Rights Reserved.
