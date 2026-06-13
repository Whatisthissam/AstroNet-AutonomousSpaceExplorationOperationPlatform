# AstroNet Docker Configuration Registry & Guides

This directory houses additional dockerization templates and guidelines for enterprise staging.

---

## 📦 Docker Registry Details
In production, container images should be tagged and pushed to a secure repository:
- **AWS ECR**: `<aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/astronet-client`
- **Docker Hub**: `astronet/astronet-client`

## 🛡️ Image Security Scanning
Always scan built containers for vulnerabilities before deploying to EKS:
```bash
# Scan Express server container using Trivy
trivy image astronet-server:latest
```

## ⚙️ Docker Daemon Configurations
Ensure Docker Daemon limits log output sizes inside `/etc/docker/daemon.json` to prevent disk saturation:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```
