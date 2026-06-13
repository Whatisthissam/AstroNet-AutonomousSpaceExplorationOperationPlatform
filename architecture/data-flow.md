# AstroNet – Operational Data & DevOps Flow

This document outlines the complete lifecycle of a code release and the data flows between application components, users, secrets manager, logs collector, and telemetry monitors.

---

## 🔄 Lifecycle Pipeline Flow

The DevOps pipeline automates the lifecycle from source code changes to deployment and monitoring:

```mermaid
graph LR
    %% Styling
    classDef git fill:#f14e32,stroke:#020817,stroke-width:2px,color:#fff;
    classDef ci fill:#14234b,stroke:#020817,stroke-width:2px,color:#fff;
    classDef docker fill:#00d4ff,stroke:#020817,stroke-width:2px,color:#020817;
    classDef k8s fill:#326ce5,stroke:#020817,stroke-width:2px,color:#fff;
    classDef ops fill:#7b2fff,stroke:#020817,stroke-width:2px,color:#fff;

    %% Nodes
    A["🐱 GitHub Code Commit"]:::git
    B["🤖 Jenkins CI/CD Pipeline"]:::ci
    C["🐳 Docker Image Build"]:::docker
    D["📦 Container Registry"]:::docker
    E["⛵ Kubernetes (EKS) Rollout"]:::k8s
    F["🔒 HashiCorp Vault Secrets"]:::ops
    G["📈 Prometheus Metrics"]:::ops
    H["📋 ELK Stack Logs"]:::ops

    %% Connections
    A -->|Webhook Trigger| B
    B -->|Install & Test| B
    B -->|Build Containers| C
    C -->|Push Images| D
    B -->|Deploy Manifests| E
    E -->|Pull Images| D
    E -->|Lookup Credentials| F
    E -->|Scrape Metrics| G
    E -->|Ship JSON stdout logs| H
```

---

## 📊 Operations Data Flow Matrix

Operational data moves through three primary pipelines:

### 1. Secret Management Flow (Vault)
```
[Vault Storage] ──(Decrypt KV)──> [Vault API (8200)] ──(Bearer Token Auth)──> [AstroNet API Pod] ──(In-Memory Config)
```
- **Context**: During node initialization, the backend makes an authenticated HTTP GET request to Vault.
- **Result**: Connection string credentials and JWT keys are loaded directly into application memory. No plain passwords reside in code.

### 2. Metric Telemetry Flow (Prometheus & Grafana)
```
[Frontend/Backend Pods] 
           │
           ▼ (expose /api/devops/status)
[Prometheus Scraper] ──(Pull Scrape every 15s)──> [Prometheus TSDB] <──(Query PromQL)── [Grafana Dashboards]
```
- **Context**: App workloads expose metrics showing CPU usage, connection rate, active missions, and database locks.
- **Result**: Prometheus polls target endpoints, indexes data points, and feeds Grafana to visualize telemetry alerts.

### 3. Log Aggregator Flow (ELK Stack)
```
[Backend Server Logs (stdout)] ──> [Filebeat DaemonSet] ──> [Logstash Pipeline (50000)]
                                                                     │
                                                                 (JSON filter)
                                                                     ▼
[Kibana Dashboards] <──(Discover queries)── [Elasticsearch Database (9200)]
```
- **Context**: Express server logs API routing errors and mission updates.
- **Result**: Logstash structures, indexes, and publishes events to Elasticsearch, rendering searchable event logs in Kibana.
