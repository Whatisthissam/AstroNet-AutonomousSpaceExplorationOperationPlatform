# 🚀 AstroNet – Autonomous Space Exploration Operations Platform

> **Production-quality MERN Stack NASA Mission Control Platform**  
> Built for DevOps semester project demonstration.

![AstroNet Banner](https://img.shields.io/badge/AstroNet-Mission_Control-00d4ff?style=for-the-badge&logo=rocket&logoColor=white)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-7b2fff?style=for-the-badge)
![Docker Ready](https://img.shields.io/badge/Docker-Ready-00ff88?style=for-the-badge&logo=docker)

---

## 🌌 Overview

AstroNet is a full-stack MERN application simulating a real NASA-grade mission control center. It features a futuristic space-themed UI, real-time simulated telemetry, mission management, incident tracking, system logs, and a comprehensive DevOps operations dashboard.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🌍 **3D Earth Globe** | Interactive R3F/Three.js Earth with orbiting satellites |
| 📡 **Live Telemetry** | Auto-refreshing simulated spacecraft sensor data |
| 🚀 **Mission Control** | Full mission CRUD with health scoring |
| ⚠️ **Incident Management** | Timeline-based incident tracking with recovery actions |
| 📊 **Analytics** | Recharts visualizations (Area, Bar, Line, Radar) |
| 📋 **System Logs** | Searchable, filterable log stream with severity levels |
| 🛠️ **DevOps Dashboard** | Docker, K8s, Jenkins, Terraform, Prometheus, Grafana, ELK, Vault |
| 👑 **Admin Panel** | User management, mission registry, service health |
| 🔐 **JWT Auth** | Role-based access (Admin, Controller, Analyst) |

---

## 🗂️ Project Structure

```
astronet/
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Navbar, AppLayout, Starfield
│   │   │   ├── three/         # HeroScene (3D Earth + Satellites)
│   │   │   └── ui/            # GlassCard, StatusBadge, StatCounter, TelemetryGauge
│   │   ├── context/           # AuthContext (JWT)
│   │   ├── pages/             # Landing, Login, Dashboard, Telemetry, Analytics,
│   │   │                      # Incidents, SystemLogs, DevOps, AdminPanel
│   │   └── services/          # axios API layer
│   └── tailwind.config.js
│
├── server/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── config/db.js       # MongoDB connection
│   │   ├── models/            # User, Mission, Telemetry, Incident, Log
│   │   ├── controllers/       # auth, mission, telemetry, incident, log, devops, user, analytics
│   │   ├── routes/            # REST API routes
│   │   └── middleware/        # JWT auth, error handler
│   ├── scripts/seed.js        # Database seeder
│   └── server.js
│
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7+ (or Docker)
- npm 9+

### 1. Clone & Setup

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

```bash
cp .env.example server/.env
# Edit server/.env if needed (defaults work for local development)
```

### 3. Seed the Database

```bash
cd server
node scripts/seed.js
```

Output:
```
✅ Connected to MongoDB
👥 Created 4 users
🚀 Created 5 missions
⚠️  Created incidents
📋 Created 15 log entries
📡 Created telemetry data

📌 Login credentials:
   Admin:      admin@astronet.io    / Admin@123
   Controller: controller@astronet.io / Control@123
   Analyst:    analyst@astronet.io   / Analyst@123
```

### 4. Start Development Servers

```bash
# Terminal 1 – Backend (port 5001)
cd server && npm run dev

# Terminal 2 – Frontend (port 5173)
cd client && npm run dev
```

Open: **http://localhost:5173**

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

Access at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/auth/register` | ❌ | Register user |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/missions` | ✅ | All missions |
| GET | `/api/missions/stats` | ✅ | Mission statistics |
| POST | `/api/missions` | ✅ Controller | Create mission |
| GET | `/api/telemetry/live` | ✅ | Live simulated telemetry |
| GET | `/api/incidents` | ✅ | All incidents |
| POST | `/api/incidents/:id/timeline` | ✅ | Add timeline event |
| GET | `/api/logs` | ✅ | System logs (searchable) |
| GET | `/api/devops/status` | ✅ | DevOps services status |
| GET | `/api/analytics/overview` | ✅ | Chart data |
| GET | `/api/users` | ✅ Admin | User management |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--space-900` | `#020817` | Primary background |
| `--cyan` | `#00d4ff` | Primary accent, links |
| `--nebula` | `#7b2fff` | Secondary accent, admin |
| `--rocket` | `#ff6b35` | Alerts, critical states |
| `--mission-green` | `#00ff88` | Active/nominal states |
| `--gold` | `#ffd700` | Warnings, standby |

- **Fonts**: Orbitron (headings) + Inter (body) + JetBrains Mono (code)
- **Glassmorphism**: `backdrop-blur-md` + `rgba(255,255,255,0.05)`

---

## 👥 Roles & Permissions

| Role | Access |
|------|--------|
| **Admin** | Full access — user management, delete missions |
| **Controller** | Create/update missions, manage incidents |
| **Analyst** | Read-only access to all data |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — SPA framework
- **React Router v6** — Client-side routing
- **Tailwind CSS v3** — Utility-first styling
- **Framer Motion** — Animations and transitions
- **Three.js** + **React Three Fiber** + **Drei** — 3D Earth scene
- **Recharts** — Data visualization
- **Axios** — HTTP client
- **Lucide React** — Icon library
- **React Hot Toast** — Notifications
- **date-fns** — Date formatting

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — Database + ODM
- **JWT** + **bcryptjs** — Authentication
- **Helmet** + **CORS** — Security middleware
- **Morgan** + **Winston** — Logging
- **dotenv** — Environment configuration

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | 3D Hero, Stats, Features, CTA |
| Login | `/login` | JWT authentication |
| Dashboard | `/dashboard` | Mission board, alerts, telemetry feed |
| Telemetry | `/telemetry` | Live gauges, subsystem status |
| Analytics | `/analytics` | Recharts visualizations |
| Incidents | `/incidents` | Timeline, recovery actions |
| System Logs | `/logs` | Searchable log stream |
| DevOps | `/devops` | 8 service cards + deployments |
| Admin | `/admin` | Users, missions, service health |

---

*Built with ❤️ for the stars* 🌌
