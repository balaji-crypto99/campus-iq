# Campus IQ - AI-Powered Campus Grievance Intelligence & Early Warning System

**Campus IQ** is a production-ready, full-stack campus grievance intelligence and early warning system designed for educational institutions. It empowers students to submit grievances and utilizes an AI analysis pipeline to evaluate priority, calculate severity scores (0–100), classify categories, detect duplicate clusters, route to departments, and generate executive daily intelligence reports.

---

## 🚀 Key Features & Capabilities

- **Autonomous AI Intelligence Engine**: Auto-classifies category, subcategory, priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), severity score (0–100), sentiment, and recommended actions.
- **Pluggable AI Abstraction**: Supports Google Gemini, OpenAI, or Built-in Smart Heuristic AI Engine fallback (zero setup required).
- **Duplicate & Cluster Detection**: Multi-parameter similarity matching comparing location, category, description, and keywords to identify campus hotspots.
- **Role-Based Access Control (RBAC)**: Secure Student & Administrator portals powered by JWT authentication and bcrypt password hashing.
- **Campus Hotspot Mapping**: Interactive visual analytics highlighting high-severity complaint clusters across academic blocks, labs, cafeteria, and residential hostels.
- **On-Demand Executive AI Reports**: Generates daily campus health summaries and action plans based on MongoDB data.
- **Zero-Friction In-Memory DB Fallback**: Connects to MongoDB, with automatic failover to `mongodb-memory-server` if local MongoDB is not running.

---

## 📁 Project Structure

```text
Project 1/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js)
│   │   ├── controllers/ (authController, grievanceController, aiController, analyticsController, notificationController, userController)
│   │   ├── middleware/ (auth.js, validate.js, errorHandler.js)
│   │   ├── models/ (User, Grievance, AIAnalysis, Department, Notification, ActivityLog)
│   │   ├── routes/ (authRoutes, grievanceRoutes, aiRoutes, analyticsRoutes, notificationRoutes, userRoutes)
│   │   ├── services/
│   │   │   └── ai/ (aiProvider.js, geminiProvider.js, openaiProvider.js, fallbackProvider.js, promptTemplates.js)
│   │   ├── utils/ (duplicateDetector.js)
│   │   └── server.js
│   ├── tests/ (auth.test.js, grievance.test.js)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/ (Navbar, Sidebar, Footer, StatCard, StatusBadge, PriorityBadge, Timeline, ComplaintCard, HotspotMap, Modal, LoadingSpinner)
│   │   ├── context/ (AuthContext, NotificationContext)
│   │   ├── pages/ (Landing, Login, Register, StudentDashboard, AdminDashboard, GrievanceSubmit, GrievanceDetail, AdminGrievances, AnalyticsPage, AIInsightsPage, NotificationsPage, ProfilePage, NotFound)
│   │   ├── services/ (api.js)
│   │   ├── utils/ (constants.js, formatters.js)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── database/
│   └── seed/ (seed.js)
└── README.md
```

---

## 🔑 Demo Accounts

For immediate testing, run the seed script to create realistic data and test using these pre-seeded accounts:

### 1. Student Portal Account
- **Email**: `student@campus.edu`
- **Password**: `password123`

### 2. Administrator Portal Account
- **Email**: `admin@campus.edu`
- **Password**: `password123`

---

## 🛠️ Step-by-Step Installation & Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Environment Variables Configuration

#### `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_iq
JWT_SECRET=campus_iq_super_secret_jwt_key_2026_secure
AI_PROVIDER=fallback   # Options: fallback | gemini | openai
AI_API_KEY=            # Optional: your Gemini or OpenAI API Key
AI_MODEL=gemini-2.5-flash
```

#### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Seeding

Run the seed script to populate **50 realistic users** and **100 campus grievances** with pre-computed AI analysis:

```bash
cd backend
npm run seed
```

---

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
# Server runs at http://localhost:5000
```

### Start Frontend Server (In a separate terminal)
```bash
cd frontend
npm run dev
# App runs at http://localhost:3000
```

---

## 🧪 Automated Testing

To run the backend integration test suite (Auth, Grievances, AI Provider Validation, Analytics):
```bash
cd backend
npm test
```

---

## 🔌 API Documentation Summary

### Authentication APIs
- `POST /api/auth/register` — Register a new student or admin account
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Grievances APIs
- `POST /api/grievances` — Submit complaint & execute AI analysis pipeline
- `GET /api/grievances` — Search & filter grievances (role-scoped)
- `GET /api/grievances/:id` — Retrieve full complaint details & AI analysis
- `PUT /api/grievances/:id` — Update status, priority, department (Admin)
- `DELETE /api/grievances/:id` — Delete grievance record (Admin)

### AI Intelligence APIs
- `POST /api/ai/analyze/:grievanceId` — Re-execute AI analysis
- `POST /api/ai/daily-report` — Generate executive AI daily report based on database metrics
- `POST /api/ai/related/:grievanceId` — Find related complaint clusters

### Analytics APIs
- `GET /api/analytics/overview` — High-level grievance KPI metrics
- `GET /api/analytics/categories` — Complaint volume by category
- `GET /api/analytics/departments` — Workload by department
- `GET /api/analytics/locations` — Hotspot complaint counts & severity scores
- `GET /api/analytics/trends` — 14-day grievance volume time series

---

## 🛡️ Security Features
- **Password Hashing**: Passwords stored using `bcryptjs` with salt factor 10.
- **JWT Authorization**: Token-based authentication with role verification (`requireStudent`, `requireAdmin`).
- **Input Validation**: `express-validator` sanitization on all POST endpoints.
- **Error Handling**: Centralized error middleware ensuring safe HTTP status responses without exposing internal stack traces in production.

---

## 📌 Deployment Instructions

### Production Build
1. Build frontend bundle: `cd frontend && npm run build`
2. Serve static assets via Nginx or Express `express.static`.
3. Set environment variable `NODE_ENV=production`.
4. Deploy backend to Node.js hosting platform (Render, Railway, AWS ECS) and database to MongoDB Atlas.
