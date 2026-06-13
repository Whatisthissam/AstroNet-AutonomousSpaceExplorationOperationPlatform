# AstroNet DevOps Project Structure

This document outlines the final folder layout of the **AstroNet Platform** following the integration of the enterprise DevOps modules. It describes why every file exists and its role in the system.

---

## 🗂️ Directory Tree

```text
astronet/
├── client/                      # React + Vite Frontend (Unchanged)
│   ├── src/                     # Source files, styles, 3D scripts, endpoints
│   ├── Dockerfile               # NEW: Production multi-stage client build
│   └── nginx.conf               # NEW: Nginx server configuration for React routing
├── server/                      # Node.js + Express Backend (Unchanged)
│   ├── src/                     # Source routers, models, controllers
│   ├── Dockerfile               # NEW: Production backend container build
│   └── server.js                # Core REST API engine
├── docs/                        # NEW: Academic Report and Documentation support
│   └── academic-report-template.md
├── docker/                      # NEW: Container deployment reference manuals
│   └── README.md
├── jenkins/                     # NEW: Continuous Integration pipeline manuals
│   └── jenkins-agents.md
├── terraform/                   # NEW: Infrastructure-as-Code modules for AWS
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── providers.tf
│   └── terraform.tfvars.example
├── kubernetes/                  # NEW: Kubernetes resource deployment manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── autoscaling.yaml
├── monitoring/                  # NEW: Prometheus and Grafana telemetry monitors
│   ├── prometheus.yml
│   └── grafana-dashboard.json
├── logging/                     # NEW: ELK stack pipeline configurations
│   ├── logstash.conf
│   ├── elasticsearch.yml
│   └── kibana-setup.md
├── vault/                       # NEW: HashiCorp Vault secrets management configs
│   ├── vault-config.hcl
│   ├── secrets-bootstrap.sh
│   └── vault-client.js
├── architecture/                # NEW: Architectural layouts with Mermaid code
│   ├── system-architecture.md
│   ├── deployment-architecture.md
│   └── data-flow.md
├── disaster-recovery/           # NEW: Site Reliability backup and recovery SOPs
│   ├── backup-strategy.md
│   ├── restore-procedure.md
│   ├── rollback-procedure.md
│   └── incident-response-plan.md
├── .env.example                 # UPDATED: Environment configuration template
├── .gitignore                   # UPDATED: Git ignore patterns for DevOps caches
├── Dockerfile                   # NEW: Fallback root container builder
├── docker-compose.yml           # UPDATED: Local orchestration of all 9 services
├── Jenkinsfile                  # NEW: Declarative CI/CD pipeline script
├── README.md                    # UPDATED: Academic readme documentation
└── PROJECT_STRUCTURE.md         # NEW: File breakdown list (This document)
```

---

## 📄 DevOps File Registry & Purpose

### 1. Root & Orchestration Files
- **[Dockerfile](file:///Users/sameerrathod/Desktop/astronet/Dockerfile)**: Unified entry-point container builder that packages and executes the backend server.
- **[docker-compose.yml](file:///Users/sameerrathod/Desktop/astronet/docker-compose.yml)**: Orchestrates local execution of all 9 nodes (Database, Client, Server, Vault, Prometheus, Grafana, Elasticsearch, Logstash, Kibana).
- **[Jenkinsfile](file:///Users/sameerrathod/Desktop/astronet/Jenkinsfile)**: Governs pipeline automation. Performs dependency installs, builds, container packaging, registry pushes, K8s deployments, and post-deploy status verification.
- **[.env.example](file:///Users/sameerrathod/Desktop/astronet/.env.example)**: Comprehensive configuration template for environment setup.
- **[.gitignore](file:///Users/sameerrathod/Desktop/astronet/.gitignore)**: Prevents checking in Terraform states, Vault cache keys, and Kubernetes kubeconfig files.

### 2. Client & Server Containerizers
- **[client/Dockerfile](file:///Users/sameerrathod/Desktop/astronet/client/Dockerfile)**: Build stage compiles React static assets; hosting stage serves files securely with Nginx.
- **[client/nginx.conf](file:///Users/sameerrathod/Desktop/astronet/client/nginx.conf)**: Configures Nginx path fallbacks to enable client-side React SPA routing.
- **[server/Dockerfile](file:///Users/sameerrathod/Desktop/astronet/server/Dockerfile)**: Production-ready Node container utilizing light Alpine base, installing only production packages, and running under a non-root `node` user context.

### 3. Infrastructure-as-Code (Terraform)
- **[terraform/providers.tf](file:///Users/sameerrathod/Desktop/astronet/terraform/providers.tf)**: Restricts and defines versions for AWS, Helm, and Kubernetes providers.
- **[terraform/variables.tf](file:///Users/sameerrathod/Desktop/astronet/terraform/variables.tf)**: Declares configuration properties for customizing VPC blocks, instances, and endpoints.
- **[terraform/outputs.tf](file:///Users/sameerrathod/Desktop/astronet/terraform/outputs.tf)**: Outputs security groups, endpoints, and EKS credentials for local reference.
- **[terraform/main.tf](file:///Users/sameerrathod/Desktop/astronet/terraform/main.tf)**: Provisions the virtual cloud network (VPC, Gateway, subnets), EKS Kubernetes cluster, EC2 Bastion host, and DocumentDB server instances.
- **[terraform/terraform.tfvars.example](file:///Users/sameerrathod/Desktop/astronet/terraform/terraform.tfvars.example)**: Provides parameter templates for local TF variables.

### 4. Kubernetes Manifests
- **[kubernetes/namespace.yaml](file:///Users/sameerrathod/Desktop/astronet/kubernetes/namespace.yaml)**: Enforces network isolation under a dedicated `astronet` namespace.
- **[kubernetes/configmap.yaml](file:///Users/sameerrathod/Desktop/astronet/kubernetes/configmap.yaml)**: Maps non-sensitive environment configs (API routing endpoints, DB URL routes).
- **[kubernetes/secret.yaml](file:///Users/sameerrathod/Desktop/astronet/kubernetes/secret.yaml)**: Stores base64-encoded secret keys.
- **[kubernetes/deployment.yaml](file:///Users/sameerrathod/Desktop/astronet/kubernetes/deployment.yaml)**: Defines pods specifications, resource allocations, replication strategies, health status probes, and MongoDB storage claims.
- **[kubernetes/service.yaml](file:///Users/sameerrathod/Desktop/astronet/kubernetes/service.yaml)**: Exposes Pod networks via NodePorts and internal DNS cluster services.
- **[kubernetes/ingress.yaml](file:///Users/sameerrathod/Desktop/astronet/kubernetes/ingress.yaml)**: Defines path-based Ingress rules (`/api` routes to backend API; all others route to Nginx frontend client).
- **[kubernetes/autoscaling.yaml](file:///Users/sameerrathod/Desktop/astronet/kubernetes/autoscaling.yaml)**: Deploys HPAs that scale up or down workloads based on CPU and memory loads.

### 5. Telemetry Monitoring (Prometheus & Grafana)
- **[monitoring/prometheus.yml](file:///Users/sameerrathod/Desktop/astronet/monitoring/prometheus.yml)**: Specifies target scraping schedules for backend telemetry, Nginx indicators, and Vault logs.
- **[monitoring/grafana-dashboard.json](file:///Users/sameerrathod/Desktop/astronet/monitoring/grafana-dashboard.json)**: Panel layout definitions for system stats, database queries, and host metrics graphs.

### 6. Logging (ELK Stack)
- **[logging/logstash.conf](file:///Users/sameerrathod/Desktop/astronet/logging/logstash.conf)**: Specifies TCP port listeners, JSON string processors, and index routers into Elasticsearch indices.
- **[logging/elasticsearch.yml](file:///Users/sameerrathod/Desktop/astronet/logging/elasticsearch.yml)**: Single-node local cluster settings for index ingestion.
- **[logging/kibana-setup.md](file:///Users/sameerrathod/Desktop/astronet/logging/kibana-setup.md)**: Walkthrough instructions explaining data view creation and query syntaxes.

### 7. Key Management (HashiCorp Vault)
- **[vault/vault-config.hcl](file:///Users/sameerrathod/Desktop/astronet/vault/vault-config.hcl)**: Configures Vault's storage location and server listener settings.
- **[vault/secrets-bootstrap.sh](file:///Users/sameerrathod/Desktop/astronet/vault/secrets-bootstrap.sh)**: Automates KV engine initialization, credential writing, policy creations, and access token generation.
- **[vault/vault-client.js](file:///Users/sameerrathod/Desktop/astronet/vault/vault-client.js)**: Demonstrates backend programmatic secrets integration with Vault HTTP API.

### 8. Architectural Diagrams
- **[architecture/system-architecture.md](file:///Users/sameerrathod/Desktop/astronet/architecture/system-architecture.md)**: Details software tiers, logical dependencies, and JWT token authentication sequences.
- **[architecture/deployment-architecture.md](file:///Users/sameerrathod/Desktop/astronet/architecture/deployment-architecture.md)**: Details VPC subnet scopes, routing load balancers, and pod replica mappings.
- **[architecture/data-flow.md](file:///Users/sameerrathod/Desktop/astronet/architecture/data-flow.md)**: Details release pipeline stages from GitHub commits to cluster monitoring metrics.

### 9. Disaster Recovery SOPs
- **[disaster-recovery/backup-strategy.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/backup-strategy.md)**: Outlines dump schedules, retention parameters, and storage class volume snapshot declarations.
- **[disaster-recovery/restore-procedure.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/restore-procedure.md)**: Clear commands to restore database states, PVCs, and Vault Raft states.
- **[disaster-recovery/rollback-procedure.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/rollback-procedure.md)**: Reverting builds with Git, Jenkins releases, K8s undo rollouts, and database down migrations.
- **[disaster-recovery/incident-response-plan.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/incident-response-plan.md)**: Playbook rules mapping diagnostic alerts and resolutions for crashes, outages, and breaches.

### 10. Academic Documentation
- **[docs/academic-report-template.md](file:///Users/sameerrathod/Desktop/astronet/docs/academic-report-template.md)**: Report template structure preloaded with sections and instructions to submit.
