# 🏥 TeleMedAI — AI-Assisted Telemedicine Portal for Rural India
### Based on IEEE CISES 2025 Research Paper

A full-stack MERN application (MongoDB + Express + React + Node.js) featuring:
- JWT Authentication (Login / Register)
- Role-based access (Patient / Doctor / Admin)
- Appointment Booking & Management
- Research Dashboard with Recharts
- Multilingual-ready design

🚀 Features

Secure JWT Authentication (Login / Register)

Role-based access control (Patient / Doctor / Admin)

Appointment booking and management

Research dashboard with analytics charts

Multilingual-ready interface for rural accessibility

Scalable MERN stack architecture

🛠 Tech Stack
Frontend

React.js

CSS

Recharts

Backend

Node.js

Express.js

Database

MongoDB

Authentication

JWT (JSON Web Tokens)

📊 Dashboard Features

Appointment statistics

User analytics

Healthcare access metrics

Research-based data visualization
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

