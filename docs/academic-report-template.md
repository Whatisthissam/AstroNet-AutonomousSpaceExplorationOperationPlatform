# Academic Report: AstroNet DevOps Platform Integration
**Course**: Advanced Systems Engineering & DevOps  
**Semester Project Deliverable**  

---

## 👥 Project Team Details

- **Author / Student Name**: `[Your Name Here]`
- **Student ID**: `[Your ID Here]`
- **Project Role**: DevOps / Reliability Engineer
- **Institution**: `[Your University Name]`

---

## 🌌 1. Project Overview & Objectives

AstroNet is an Autonomous Space Exploration Operations Platform designed to simulate real-time satellite telemetry, mission control, and incident reporting. The core application runs on a MERN (MongoDB, Express, React, Node.js) stack. 

The objective of this project was to upgrade AstroNet into an **enterprise-grade DevOps showcase** by implementing:
- **Containerization**: Dual Dockerfiles and Docker Compose orchestration.
- **Continuous Integration / Continuous Deployment (CI/CD)**: A 9-stage automated Jenkins pipeline.
- **Infrastructure-as-Code (IaC)**: Terraform scripts provisioning AWS networks, EC2 Bastion, and EKS Kubernetes clusters.
- **Microservices Orchestration**: Kubernetes configurations for deployment scalability and path-based routing.
- **Telemetry Monitoring**: Prometheus scrapers paired with Grafana dashboard visualizations.
- **Log Aggregator**: ELK (Elasticsearch, Logstash, Kibana) pipeline parsing application events.
- **Secrets Management**: HashiCorp Vault secrets engines protecting database connections and signature tokens.
- **Disaster Recovery (DR)**: Runbooks covering database dumps, pod rollbacks, and incident triage.

---

## 🏗️ 2. Architectural Diagrams

Detailed architectural layouts are documented under the [architecture directory](file:///Users/sameerrathod/Desktop/astronet/architecture).

### 2.1 Logical System Flow
`[Insert System Architecture Diagram Here. Refer to system-architecture.md]`

### 2.2 Infrastructure & Network Layout
`[Insert K8s Deployment Architecture Diagram Here. Refer to deployment-architecture.md]`

---

## 📦 3. Deployment Evidence

Use this section to document evidence of the containerized environment.

### 3.1 Docker Compose Execution
`[Insert Screenshot of 'docker-compose up -d' running successfully showing all 9 containers active]`

### 3.2 Kubernetes Workloads Status
Run the following commands inside the cluster context and paste the output:

```bash
# Output from: kubectl get all -n astronet
`[Paste command output showing frontend/backend deployments and services running]`

# Output from: kubectl get hpa -n astronet
`[Paste command output showing horizontal pod autoscaler parameters]`
```

---

## 📈 4. Monitoring & Telemetry Evidence

Document telemetry metrics collection status.

### 4.1 Prometheus Active Scrape Targets
`[Insert Screenshot of Prometheus targets page (http://localhost:9090/targets) showing astronet-backend, astronet-frontend, and vault in greenUP status]`

### 4.2 Grafana Mission Dashboard
`[Insert Screenshot of your imported Grafana dashboard showing graphs for active missions, CPU/Memory telemetry, and API latency]`

---

## 📋 5. Logging & Auditing Evidence

Document centralized logs indexing.

### 5.1 Kibana Discover Feed
`[Insert Screenshot of Kibana Discover page showing incoming json logs from astronet-logs-* data view]`

### 5.2 Kibana Query Log Evidence
```kql
# Query run: level: "error"
`[Paste screenshot or log lines of queried error events]`
```

---

## 🔒 6. Secrets Security Evidence

Document Vault access controls.

### 6.1 Vault Secret Retrieval Log
```bash
# Run command: node vault/vault-client.js
`[Paste output showing config values fetched from Vault HTTP API]`
```

---

## 🚨 7. Disaster Recovery Execution Evidence

Detail verification checks on rollback processes.

```bash
# Output of rollout rollback verification:
# kubectl rollout undo deployment/astronet-backend -n astronet
`[Paste output verifying successful undo rollout of backend pods]`
```

---

## 📝 8. Discussion & Lessons Learned
`[Document challenges encountered during integration, such as configuring CORS headers, handling Vault token authentication, or scaling Kubernetes pods under load. Highlight recommendations for future production systems].`
