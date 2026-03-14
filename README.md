# 🏥 TeleMedAI — AI-Assisted Telemedicine Portal for Rural India
### Based on IEEE CISES 2025 Research Paper

A full-stack MERN application (MongoDB + Express + React + Node.js) featuring:
- JWT Authentication (Login / Register)
- Role-based access (Patient / Doctor / Admin)
- Appointment Booking & Management
- Research Dashboard with Recharts
- Multilingual-ready design

---

## 📁 Project Structure

```
telemedicine/
├── backend/                  ← Node.js + Express + MongoDB
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js           ← JWT middleware
│   ├── models/
│   │   ├── User.js           ← User schema
│   │   ├── Appointment.js    ← Appointment schema
│   │   └── Metric.js         ← Research metric schema
│   ├── routes/
│   │   ├── auth.js           ← /api/auth (login, register, me)
│   │   ├── appointments.js   ← /api/appointments (CRUD)
│   │   └── dashboard.js      ← /api/dashboard/stats
│   ├── seed.js               ← Seed demo data into MongoDB
│   ├── server.js             ← Express app entry point
│   ├── .env                  ← Environment variables
│   └── package.json
│
└── frontend/                 ← React.js app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js  ← Global auth state
    │   ├── pages/
    │   │   ├── LoginPage.js    ← Login + Register UI
    │   │   └── Dashboard.js    ← Full dashboard (4 tabs)
    │   ├── App.js              ← Router setup
    │   ├── index.js            ← React entry
    │   └── index.css           ← Global styles + CSS vars
    └── package.json
```

---

## ⚙️ Prerequisites — Install These First

| Tool | Download |
|------|----------|
| Node.js (v18+) | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |
| VS Code | https://code.visualstudio.com |
| Git (optional) | https://git-scm.com |

---

## 🚀 Step-by-Step Setup in VS Code

### STEP 1 — Open the Project

1. Open **VS Code**
2. Go to **File → Open Folder**
3. Select the `telemedicine/` folder
4. You should see both `backend/` and `frontend/` folders in the Explorer

---

### STEP 2 — Install Recommended VS Code Extensions

Open Extensions panel (`Ctrl+Shift+X`) and install:

- **ES7+ React/Redux/React-Native snippets** — React shortcuts
- **MongoDB for VS Code** — Browse your DB visually
- **Thunder Client** — Test your API routes (like Postman)
- **Prettier** — Code formatting
- **Auto Rename Tag** — HTML/JSX tag helper

---

### STEP 3 — Start MongoDB

#### Option A: MongoDB Compass (GUI)
1. Open **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017`
3. It will auto-create the `telemedicine_db` database when data is inserted

#### Option B: Terminal (Windows)
```bash
# Start MongoDB service
net start MongoDB

# Or run manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

#### Option B: Terminal (Mac/Linux)
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

---

### STEP 4 — Setup the Backend

Open a **new terminal** in VS Code (`Ctrl+`` ` ```)

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# This installs: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon
```

Verify your `.env` file looks like this:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/telemedicine_db
JWT_SECRET=telemedicine_jwt_secret_key_2025
JWT_EXPIRE=7d
NODE_ENV=development
```

---

### STEP 5 — Seed Demo Data

```bash
# Still inside backend/ folder
node seed.js
```

Expected output:
```
✅ MongoDB connected
🗑️  Cleared existing data
🎉 Seed complete! Demo accounts created:

  👤 Patient  → patient@demo.com  / demo1234
  🩺 Doctor   → doctor@demo.com   / demo1234
  🔑 Admin    → admin@demo.com    / demo1234

  4 sample appointments created for the patient.
```

---

### STEP 6 — Start the Backend Server

```bash
# In backend/ folder — starts with auto-reload
npm run dev

# OR without auto-reload
npm start
```

Expected output:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

> ✅ Keep this terminal open. Backend runs on **port 5000**.

---

### STEP 7 — Setup the Frontend

Open a **second terminal** in VS Code (`Ctrl+Shift+`` ` ```)

```bash
# Navigate to frontend folder
cd frontend

# Install all dependencies
npm install

# This installs: react, react-router-dom, axios, recharts
```

---

### STEP 8 — Start the Frontend

```bash
# In frontend/ folder
npm start
```

Expected output:
```
Compiled successfully!

Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

> Browser opens automatically at **http://localhost:3000**

---

### STEP 9 — Use the App

1. Browser opens the **Login page** at `http://localhost:3000`
2. Click **Register** to create a new account, OR
3. Use demo credentials:
   ```
   Email:    patient@demo.com
   Password: demo1234
   ```
4. You'll be redirected to the **Dashboard**

---

## 🖥️ Dashboard Tabs

| Tab | What You'll See |
|-----|----------------|
| **Overview** | Appointment stats, AI performance bar chart, profile info |
| **Appointments** | List all bookings, book new, cancel existing |
| **Research Metrics** | Radar chart, latency line chart, pilot study results |
| **System Flow** | Step-by-step patient journey, future enhancements |

---

## 🔌 API Endpoints Reference

### Auth Routes (`/api/auth`)
```
POST  /api/auth/register    → Create new account
POST  /api/auth/login       → Login, returns JWT token
GET   /api/auth/me          → Get logged-in user (requires token)
```

### Appointment Routes (`/api/appointments`)
```
GET    /api/appointments     → Get all appointments for user
POST   /api/appointments     → Book new appointment
PUT    /api/appointments/:id → Update status (confirm/cancel)
DELETE /api/appointments/:id → Delete appointment
```

### Dashboard Routes (`/api/dashboard`)
```
GET /api/dashboard/stats    → Get counts + research metrics
```

---

## 🧪 Testing API with Thunder Client (VS Code)

1. Open Thunder Client in VS Code sidebar
2. Test **Register**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "test1234",
       "role": "patient"
     }
     ```

3. Test **Login**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "patient@demo.com",
       "password": "demo1234"
     }
     ```
   - Copy the `token` from the response

4. Test **Get My Appointments**:
   - Method: `GET`
   - URL: `http://localhost:5000/api/appointments`
   - Header: `Authorization: Bearer <your_token_here>`

---

## 🗃️ MongoDB Collections (auto-created)

| Collection | Purpose |
|-----------|---------|
| `users` | Registered users (patients, doctors, admins) |
| `appointments` | All booked appointments |
| `metrics` | Research performance metrics (optional) |

View them in **MongoDB Compass** → `telemedicine_db`

---

## ⚠️ Common Issues & Fixes

| Problem | Fix |
|--------|-----|
| `MongoDB connection refused` | Start MongoDB service first (Step 3) |
| `Cannot find module 'express'` | Run `npm install` inside `/backend` |
| `Module not found: recharts` | Run `npm install` inside `/frontend` |
| `Port 3000 already in use` | Close other React apps, or press Y to use next port |
| `Port 5000 already in use` | Change `PORT=5001` in `.env` |
| `Invalid token` | Re-login to get a fresh JWT token |
| `CORS error` | Make sure backend is running on port 5000 |

---

## 🏗️ Tech Stack

```
Frontend:  React 18 · React Router v6 · Axios · Recharts
Backend:   Node.js · Express.js · Mongoose (MongoDB ODM)
Database:  MongoDB (local)
Auth:      JWT (JSON Web Tokens) · bcryptjs password hashing
Styling:   Pure CSS with CSS Variables (no external UI library)
Fonts:     Outfit + JetBrains Mono (Google Fonts)
```

---

## 📖 Research Reference

> **"Designing an AI-Assisted Telemedicine Portal for Rural India"**  
> Bindu Swetha P, Harathi Nimmala, Argha Sarkar, Mayuri Kundu, Sushma K S N  
> IEEE CISES 2025 · DOI: 10.1109/CISES66934.2025.11265573

Key metrics implemented in the dashboard:
- SUS Score: **81.2 / 100** (pilot with 20 rural users)
- AI Intent Recognition: **89.4%** accuracy
- Video Success Rate: **92%** under 3G conditions
- Average Video Latency: **< 600ms**
