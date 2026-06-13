# AstroNet – Deployment Architecture

This document describes the cloud deployment architecture of **AstroNet** on AWS using Kubernetes (EKS).

---

## 🌐 Infrastructure Topology

AstroNet is deployed inside a multi-availability zone VPC. Application pods reside within isolated private subnets, while incoming traffic is routed via public load balancers.

```mermaid
graph TD
    classDef external fill:#ffd700,stroke:#020817,stroke-width:2px,color:#020817;
    classDef public fill:#00d4ff,stroke:#020817,stroke-width:2px,color:#020817;
    classDef private fill:#7b2fff,stroke:#020817,stroke-width:2px,color:#fff;
    classDef database fill:#00ff88,stroke:#020817,stroke-width:2px,color:#020817;

    Client["🌐 External Users"]:::external

    subgraph AWS_VPC ["AWS VPC (10.0.0.0/16)"]
        subgraph Public_Subnets ["Public Subnets (Ingress Zone)"]
            ALB["AWS Application Load Balancer"]:::public
            Bastion["Bastion EC2 Host"]:::public
        end

        subgraph Private_Subnets ["Private Subnets (EKS Cluster Node Group)"]
            subgraph K8S_Namespace ["K8s Namespace: 'astronet'"]
                IngressCtrl["Nginx Ingress Controller"]:::private
                
                FrontendPods["astronet-frontend pods (nginx)"]:::private
                BackendPods["astronet-backend pods (nodejs)"]:::private
                VaultPod["astronet-vault pod (vault)"]:::private
            end
            
            DBCluster["AWS DocumentDB Cluster (MongoDB Engine)"]:::database
        end
    end

    %% Routing Flow
    Client -->|HTTPS Traffic| ALB
    ALB -->|Routings| IngressCtrl
    IngressCtrl -->|Path '/'| FrontendPods
    IngressCtrl -->|Path '/api'| BackendPods
    BackendPods -->|Secure query with credentials| DBCluster
    BackendPods -->|Fetch keys on start| VaultPod
    Bastion -.->|SSH / Tunneling| K8S_Namespace
```

---

## ⛵ Kubernetes Workload Configuration

The application components run as resources inside the target EKS Cluster:

| Resource | Target Deployment | Service Type | Replicas | Autoscaling (HPA) | Port |
|----------|-------------------|--------------|----------|-------------------|------|
| **astronet-frontend** | Web Client UI | NodePort | 2 | Min 2 / Max 5 | 80 |
| **astronet-backend** | Express API Engine | NodePort | 2 | Min 2 / Max 10 | 5000 |
| **astronet-mongodb** | Database State | ClusterIP | 1 | N/A (PVC Backed) | 27017 |
| **astronet-vault** | Secret Management | ClusterIP | 1 | N/A | 8200 |

---

## 🚦 Network Routing & Traffic Ingress
1. **Public Endpoint**: Users access `http://astronet.local` which resolves to the Ingress Controller.
2. **Path Routing**:
   - Matches standard paths `/*` and forwards requests to `astronet-frontend-service` (target port `80`).
   - Matches `/api/*` and rewrites target to pass directly to `astronet-backend-service` (target port `5000`).
3. **Pod Isolation**: NetworkPolicies restrict direct external ingress into database pods (`mongodb`). Only API backend pods are whitelisted to establish connection endpoints on port `27017`.
