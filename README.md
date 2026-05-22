# Job Portal System (MERN Stack)

A production-grade Job Portal System built with MongoDB, Express.js, React.js, and Node.js. It serves three distinct user types: Candidates, Employers, and Admins. It features resume parsing, job matching, and role-based access control.

## Features
- **Role-Based Dashboards:** Unique views for Candidates, Employers, and Admins.
- **Resume Parsing:** Extracts skills and text from PDF/DOC uploads using `pdf-parse`.
- **Smart Job Matching:** Automatically calculates a match score (0-100) when candidates apply to jobs based on their skills vs job requirements.
- **Authentication:** JWT (Access & Refresh tokens) + bcrypt.
- **Admin Controls:** User management, job moderation, and system statistics.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, React Router v6, Context API, Lucide Icons.
- **Backend:** Node.js, Express.js, Mongoose, JWT, Multer, Helmet.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Make sure MongoDB is running locally (or update the URI in `.env`).
4. Copy `.env.example` to `.env` and fill in the values.
5. Run the seed script to populate the database: `npm run seed`
6. Start the development server: `npm run dev` (Runs on port 5000)

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Access the application in your browser at `http://localhost:5173`.

## Test Accounts (from seed data)
- **Admin:** `admin1@example.com` / `password123`
- **Employer:** `employer1@example.com` / `password123`
- **Candidate:** `candidate1@example.com` / `password123`

## API Reference
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/auth/login` | POST | Public | Authenticate user |
| `/api/v1/auth/register` | POST | Public | Register new user |
| `/api/v1/jobs` | GET | Public | List all active jobs |
| `/api/v1/jobs` | POST | Employer | Create a new job |
| `/api/v1/applications` | POST | Candidate | Apply for a job (triggers match score) |
| `/api/v1/resume/upload` | POST | Candidate | Upload and parse resume |
| `/api/v1/profile/me` | GET | Authenticated | Get current user profile |
| `/api/v1/admin/stats` | GET | Admin | Get system statistics |
