# AstroNet – System Architecture

This document describes the logical software architecture of the **AstroNet Autonomous Space Exploration Operations Platform** and how the system components interact with databases and security elements.

---

## 🏗️ Logical Tier Architecture

AstroNet follows a decoupled, three-tier software model extended with enterprise DevOps services.

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#00d4ff,stroke:#020817,stroke-width:2px,color:#020817;
    classDef backend fill:#7b2fff,stroke:#020817,stroke-width:2px,color:#fff;
    classDef database fill:#00ff88,stroke:#020817,stroke-width:2px,color:#020817;
    classDef security fill:#ff6b35,stroke:#020817,stroke-width:2px,color:#fff;

    %% Components
    subgraph UI ["Presentation Layer (Vite + React)"]
        A["Dashboard & Gauges"]:::frontend
        B["3D Earth WebGL Scene"]:::frontend
        C["DevOps Console UI"]:::frontend
    end

    subgraph API ["Logic Layer (Express API Server)"]
        D["Auth Middleware (JWT)"]:::backend
        E["Telemetry Simulator Engine"]:::backend
        F["Missions & Incident Handlers"]:::backend
    end

    subgraph SEC ["Security Context"]
        G["HashiCorp Vault"]:::security
    end

    subgraph DATA ["Storage Layer"]
        H["MongoDB Database"]:::database
    end

    %% Interactions
    UI -->|HTTPS REST Request| API
    API -->|Read Secrets / KV| SEC
    API -->|JSON Queries / Writes| DATA
```

---

## 🛠️ Component Breakdown

### 1. Presentation Layer (React SPA)
- **Vite Bundler**: Compiles Javascript/JSX assets. served statically via an Nginx container on port `80`.
- **Three.js / React Three Fiber**: Generates the 3D orbit telemetric simulations (Earth sphere, satellite positioning).
- **Recharts**: Plots telemetry streams (sensor values, power rates, connection bandwidth).

### 2. Logic Layer (Express.js Backend)
- **REST Endpoints**: Routes located in [routes directory](file:///Users/sameerrathod/Desktop/astronet/server/src/routes) managing `/api/auth`, `/api/missions`, `/api/telemetry`, `/api/incidents`, `/api/logs`, `/api/users`, and `/api/devops`.
- **Telemetry Engine**: Emits periodic randomized telemetry data simulating spacecraft orbital changes.
- **Winston / Morgan Logger**: Collects server access outputs and formats them into JSON lines.

### 3. Storage Layer (MongoDB)
- **Mongoose ODM**: Governs schemas for Users, Missions, Telemetry logs, and Incident history tables.
- **Persistent Storage**: Connected via Mongo URI connection string.

### 4. Vault Security Context
- **KV Storage**: Stores database passwords, encryption salts, and JWT secrets.
- **Client Retrieval**: Backend fetches secrets during container startup using the token `VAULT_TOKEN`.

---

## 🔒 Authentication Flow
User authentication utilizes stateless JWT tokens stored in the browser's LocalStorage or Cookies.

```mermaid
sequenceDiagram
    autonumber
    actor User as Space Controller
    participant React as React Frontend
    participant Server as Express Server
    participant DB as MongoDB

    User->>React: Enters credentials & clicks Login
    React->>Server: HTTP POST /api/auth/login
    Server->>DB: Query User record by Email
    DB-->>Server: Return hashed password & role
    Server->>Server: Verify Password (bcryptjs)
    Server->>Server: Sign token with JWT Secret
    Server-->>React: Send Status 200 + Signed JWT Token
    Note over React,User: Token saved in Context state
    React->>User: Route to Mission Dashboard
```
