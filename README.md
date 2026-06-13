# 🚀 AstroNet – Autonomous Space Exploration Operations Platform

> **Enterprise-Grade DevOps & Site Reliability Engineering (SRE) Demonstration Project**  
> An academic MERN-stack space mission control and operations center scaled with Terraform, Kubernetes, Jenkins CI/CD, Prometheus, Grafana, ELK Stack, and HashiCorp Vault.

---

## 🌌 Project Overview

**AstroNet** is a real-time NASA-grade space exploration mission control simulation platform. Originally built on a MERN (MongoDB, Express, React, Node.js) stack, this project has been elevated to an **enterprise-ready DevOps showcase**. It features a modern, space-themed futuristic user interface, dynamic telemetry updates, mission configuration panels, system audit logging, and a dedicated DevOps operations control dashboard.

---

## ⚠️ Problem Statement

Space exploration missions involve high-velocity telemetry streams, strict security configurations, and zero-tolerance limits for application downtime. Standard monolithic setups suffer from single-point-of-failure vulnerabilities, untracked operational logs, hardcoded security keys, manual deploy bottlenecks, and lack of system metrics tracking. 

AstroNet addresses these constraints by demonstrating how to migrate a modern full-stack web application into a highly available, monitored, secured, and automated containerized cloud architecture.

---

## 🎯 Objectives

1. **Automation**: Build a complete Jenkins declarative CI/CD pipeline from checkout to verification checks.
2. **Infrastructure-as-Code (IaC)**: Script scalable, repeatable cloud infrastructure components on AWS using Terraform modules.
3. **Container Orchestration**: Standardize microservices scaling, ingress path routing, and volume storage using Kubernetes (EKS).
4. **Telemetry Observability**: Establish Prometheus pollers and Grafana dashboard alerts tracking system health and simulated telemetry values.
5. **Centralized Auditing**: Direct all stdout stream logs through Logstash pipelines into Elasticsearch for Kibana search indexing.
6. **Key Governance**: Move secrets out of configuration files and load them dynamically from a HashiCorp Vault KV secrets engine.
7. **Disaster Recovery**: Implement automated database dumps, pod rollbacks, and recovery playbooks for production outages.

---

## 🏗️ Architecture

AstroNet implements a fully automated DevOps pipeline feeding an isolated cluster environment:

```
[GitHub Repo] ──(Webhook)──> [Jenkins Pipeline] ──(Docker Build)──> [Container Registry]
                                                                          │
[Users / Clients] ──> [AWS ALB / Ingress] ──> [Kubernetes Pods] <─────────┘
                                                    │
             ┌───────────────────┬──────────────────┴──────────────────┐
             ▼                   ▼                                     ▼
     [HashiCorp Vault]   [Prometheus/Grafana]                     [ELK Stack]
     (Secret Lookup)    (Telemetry Observability)              (Centralized Logs)
```

Refer to the following detailed files in the [architecture directory](file:///Users/sameerrathod/Desktop/astronet/architecture):
- [Logical System Architecture](file:///Users/sameerrathod/Desktop/astronet/architecture/system-architecture.md)
- [Kubernetes Deployment Topology](file:///Users/sameerrathod/Desktop/astronet/architecture/deployment-architecture.md)
- [Pipeline & Data Flow Matrix](file:///Users/sameerrathod/Desktop/astronet/architecture/data-flow.md)

---

## 🛠️ Technology Stack

- **Frontend Application**: React 19 (Vite SPA), Tailwind CSS v3, React Router v7, Recharts, Three.js, Lucide Icons.
- **Backend Application**: Node.js, Express.js, Mongoose ODM, Winston Logger, Morgan HTTP logger.
- **Data Store**: MongoDB 7.0 / AWS DocumentDB.
- **CI/CD Pipeline**: Jenkins Declarative DSL, Docker Build Engine.
- **Infrastructure**: Terraform v1.5+, AWS Provider (VPC, Subnets, EKS, DocumentDB, SG).
- **Orchestration**: Kubernetes v1.28+ (Deployments, Services, NodePort, Ingress Routing, HPA, PVC).
- **Monitoring & Metrics**: Prometheus v2.48, Grafana v10.2.
- **Centralized Logging**: Elasticsearch v8.11, Logstash v8.11, Kibana v8.11.
- **Secrets Governance**: HashiCorp Vault v1.15.

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- Docker & Docker Compose

### 1. Initialize Dependency Packages
Run the root-level helper script to install client and server packages simultaneously:
```bash
npm install
npm run install-all
```

### 2. Configure Environment Variables
Duplicate the root environment template into your server folder:
```bash
cp .env.example server/.env
```
*(The default values in `server/.env` are optimized to run locally).*

### 3. Seed Database Collections
Add dummy users, space missions, and logs to MongoDB:
```bash
npm run seed
```
**Login Credentials**:
- **Admin**: `admin@astronet.io` / `Admin@123`
- **Controller**: `controller@astronet.io` / `Control@123`
- **Analyst**: `analyst@astronet.io` / `Analyst@123`

### 4. Run Development Servers
To run both backend API and frontend Vite servers concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🐳 Docker Deployment Instructions

To run the complete suite of AstroNet services along with the monitoring, logging, and security stacks locally:

```bash
# Spin up all containers in detached mode
docker-compose up -d
```

### Running Services URLs:
- **AstroNet Web Client**: `http://localhost:5173`
- **AstroNet REST API**: `http://localhost:5000`
- **Prometheus Dashboard**: `http://localhost:9090`
- **Grafana Dashboard**: `http://localhost:3000` (User: `admin`, Password: `admin`)
- **HashiCorp Vault UI**: `http://localhost:8200` (Dev root token: `root`)
- **Kibana Web Log Feed**: `http://localhost:5601`

---

## ⛵ Kubernetes Deployment Instructions

All Kubernetes manifests are stored inside the [kubernetes directory](file:///Users/sameerrathod/Desktop/astronet/kubernetes).

```bash
# 1. Create namespace
kubectl apply -f kubernetes/namespace.yaml

# 2. Apply config maps and credentials secrets
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml

# 3. Create MongoDB Persistent Volume Claim and Deployments
kubectl apply -f kubernetes/deployment.yaml

# 4. Expose deployments via Services
kubectl apply -f kubernetes/service.yaml

# 5. Apply Ingress path routing
kubectl apply -f kubernetes/ingress.yaml

# 6. Enable HPA autoscaling
kubectl apply -f kubernetes/autoscaling.yaml
```

To access the services inside a local cluster (e.g. Minikube):
```bash
# Fetch access URL for frontend
minikube service astronet-frontend-service -n astronet --url
```

---

## 📈 Monitoring Setup

Prometheus collects operational telemetry, which Grafana visualizes:
1. Ensure the `prometheus` and `grafana` containers are active via Docker.
2. Access **Grafana** (`http://localhost:3000`), navigate to **Connections** > **Data Sources**, and add **Prometheus** (URL: `http://prometheus:9090`).
3. Click **Dashboards** > **New** > **Import**.
4. Upload or copy-paste the JSON file from [grafana-dashboard.json](file:///Users/sameerrathod/Desktop/astronet/monitoring/grafana-dashboard.json) to render the Mission Telemetry dashboard.

---

## 📋 Centralized Logging Setup

Centralized logs are routed via Logstash to Elasticsearch:
1. Logstash listens on TCP port `50000` for application logs (defined in [logstash.conf](file:///Users/sameerrathod/Desktop/astronet/logging/logstash.conf)).
2. Log in to **Kibana** (`http://localhost:5601`), head to **Stack Management** > **Data Views**.
3. Create a data view with the index pattern `astronet-logs-*`.
4. Open the **Discover** tab to view, search, and filter real-time telemetry logs.
5. Refer to [kibana-setup.md](file:///Users/sameerrathod/Desktop/astronet/logging/kibana-setup.md) for detailed KQL queries and dashboard setup.

---

## 🔒 Vault Setup

HashiCorp Vault manages secrets instead of static files:
1. Vault is configured via [vault-config.hcl](file:///Users/sameerrathod/Desktop/astronet/vault/vault-config.hcl).
2. Execute the bootstrap script to initialize paths, write credentials, and set security policies:
   ```bash
   sh vault/secrets-bootstrap.sh
   ```
3. Test integration by running the Node.js client retrieval mock:
   ```bash
   node vault/vault-client.js
   ```

---

## 🚨 Disaster Recovery Strategy

We have established comprehensive plans for system failures, container crashes, and regional outages:
- **Backup Strategy**: Daily MongoDB dumps and EBS snapshot routines. [backup-strategy.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/backup-strategy.md).
- **Restore Procedure**: Rebuilding database states and cluster PVCs. [restore-procedure.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/restore-procedure.md).
- **Rollback Procedure**: Reverting releases using Git, Jenkins, and K8s undo rolls. [rollback-procedure.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/rollback-procedure.md).
- **Incident Response Plan**: SOP playbooks detailing root causes and resolution triggers for EKS outages. [incident-response-plan.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/incident-response-plan.md).

---

## 📸 Screenshots Section Placeholders

For your final academic submission, capture and paste screenshots demonstrating verification:
1. **Docker Compose Orchestration Active**: `[Insert Screenshot of active terminal / Docker Desktop list showing 9 healthy containers]`
2. **Kubernetes Rollout Complete**: `[Insert screenshot of kubectl get pods -n astronet showing active replicas]`
3. **Jenkins Successful Build Stages**: `[Insert screenshot of Jenkins Blue Ocean or Stage View displaying green blocks for all 9 stages]`
4. **Grafana Mission Metrics Active**: `[Insert screenshot of your Mission Control telemetry dashboard]`
5. **Kibana Log Query Result**: `[Insert screenshot of Kibana Discover page filtering log events]`
6. **Vault KV Secrets Storage UI**: `[Insert screenshot of Vault Browser UI showing populated credentials under secret/astronet/config]`

---

## 🚀 Future Enhancements

- **GitOps Implementation**: Integrate ArgoCD to automate deployments directly from Git repository changes.
- **Service Mesh**: Deploy Istio inside the EKS cluster for mtls encrypted pod-to-pod communication.
- **Chaos Engineering**: Integrate Chaos Mesh to test cluster reliability by randomly killing pods during simulation.
