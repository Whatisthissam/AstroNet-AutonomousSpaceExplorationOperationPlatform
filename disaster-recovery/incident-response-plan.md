# AstroNet – Incident Response Plan

This document details the standard operating procedures (SOPs) for diagnosing and resolving outages across the AstroNet application suite.

---

## 🚨 Incident Response Workflow

When an alert fires in Grafana or Prometheus, the responder should execute the following triage steps:

```
[Grafana Alert / Outage Report] ──> [1. Verify & Triage] ──> [2. Diagnose Logs] ──> [3. Mitigate & Resolve] ──> [4. Root Cause Analysis (RCA)]
```

---

## 🗄️ Outage Scenarios & Resolution Playbooks

### Scenario 1: Application / API Failures (HTTP 500s or 504 Gateway Timeouts)
- **Symptom**: Clients receive server errors or timeouts. DevOps Dashboard shows API indicators offline.
- **Diagnostic Procedures**:
  1. Verify backend health endpoint: `curl http://astronet.api.local/api/health`
  2. Inspect HTTP status codes and route response latency in Grafana.
  3. Query Kibana for logs containing: `level: "error"` or `message: "database connection"`.
- **Mitigation Action**:
  - Restart backend pods: `kubectl rollout restart deployment/astronet-backend -n astronet`.

### Scenario 2: Container Failure (CrashLoopBackOff)
- **Symptom**: Pod status shows `CrashLoopBackOff` in `kubectl get pods`.
- **Diagnostic Procedures**:
  1. Inspect container crash reasons: `kubectl describe pod <pod-name> -n astronet`
  2. Read stderr logs: `kubectl logs <pod-name> -n astronet --previous`
- **Mitigation Action**:
  - Revert recent configuration changes if environment variables or secrets are missing.
  - Revert image tag to last working build in the deployment manifest.

### Scenario 3: Pod Failures (Pending / Out of Memory)
- **Symptom**: Pods remain in `Pending` state or show `OOMKilled`.
- **Diagnostic Procedures**:
  1. Run `kubectl describe pod <pod-name> -n astronet` to verify scheduling constraints.
  2. Check resource limits vs node availability.
- **Mitigation Action**:
  - Adjust container resource requests/limits in `deployment.yaml`.
  - Add more workers if EKS node groups are fully saturated.

### Scenario 4: EKS Node Outages
- **Symptom**: EKS nodes show status `NotReady`. Pods evicted or failing schedules.
- **Diagnostic Procedures**:
  1. Check node statuses: `kubectl get nodes`
  2. Inspect AWS Console EC2 Health dashboards to check for hypervisor status check failures.
- **Mitigation Action**:
  - Let AWS Auto Scaling replace the failed instance automatically.
  - Force cordon/drain the failing node to reschedule active pods:
    ```bash
    kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
    ```

### Scenario 5: Database Outage (MongoDB Offline)
- **Symptom**: Backend logs emit: `Mongoose connection error: Connection refused`.
- **Diagnostic Procedures**:
  1. Test DB socket connection from backend container.
  2. Inspect MongoDB instance system logs.
- **Mitigation Action**:
  - Restart database deployment: `kubectl rollout restart deployment/astronet-mongodb -n astronet`.
  - If database files are corrupted, restore data from the latest snapshot using [restore-procedure.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/restore-procedure.md).

### Scenario 6: AWS Cloud Region Outage
- **Symptom**: Complete loss of AWS us-east-1 resources.
- **Diagnostic Procedures**:
  1. Check AWS Service Health Dashboard.
- **Mitigation Action**:
  - Update DNS records (Route 53) to route all traffic to the active replica environment running in us-west-2 region.
  - Re-run Terraform scripts against the secondary backup region to spin up auxiliary node groups if needed.

### Scenario 7: Security Breach / Key Compromise
- **Symptom**: Unauthorized data access or exposed JWT secrets.
- **Diagnostic Procedures**:
  1. Audit server logs in Kibana to identify unauthorized API call sources.
- **Mitigation Action**:
  1. **Revoke Keys**: Rotate JWT Secret in HashiCorp Vault.
  2. **Run Bootstrap**: Re-execute `secrets-bootstrap.sh` to apply new configuration values.
  3. **Force Deployment**: Restart backend pods to load the updated secrets from Vault, invalidating all outstanding user sessions.
