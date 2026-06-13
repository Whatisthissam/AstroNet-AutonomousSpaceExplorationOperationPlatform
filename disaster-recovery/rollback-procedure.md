# AstroNet Disaster Recovery – Rollback Procedure

This document provides procedures to revert code releases, Kubernetes deployments, and database schemas in the event of a critical post-deployment failure.

---

## ⛵ 1. Kubernetes Workload Rollback

If a new application deployment is unstable, crash-looping, or failing health probes, trigger an immediate rollback to the previously stable replica set.

### Step 1: Check rollout status and history
```bash
# Inspect version history
kubectl rollout history deployment/astronet-backend -n astronet
```

### Step 2: Roll back to previous version
```bash
# Rollback to the immediate previous revision
kubectl rollout undo deployment/astronet-backend -n astronet

# Or rollback to a specific stable revision number (e.g. revision 4)
kubectl rollout undo deployment/astronet-backend -n astronet --to-revision=4
```

### Step 3: Monitor rollback status
```bash
kubectl rollout status deployment/astronet-backend -n astronet
```

---

## 🤖 2. Jenkins Git Release Rollback

To revert a release at the VCS level and trigger an automated hotfix build through Jenkins:

### Step 1: Revert the commit in Git
On a developer terminal, identify the commit that caused the failure, revert it, and push to main:
```bash
# Revert commit
git revert <failed-commit-hash> --no-edit

# Push reversion to trigger Jenkins Webhook
git push origin main
```

### Step 2: Force deployment of a specific Git tag
If the automatic pipeline webhook is delayed, open Jenkins, click **Build with Parameters**, and specify a stable tag version (e.g. `v1.2.0`) to trigger the build.

---

## 📦 3. Helm Deployment Rollback (Alternative Orchestration)

If AstroNet is installed using a Helm chart package, revert releases using the Helm CLI:

```bash
# List release history
helm history astronet -n astronet

# Revert to a specific revision (e.g. revision 2)
helm rollback astronet 2 -n astronet
```

---

## 💾 4. MongoDB Schema Rollback

If a database schema change or script deployment breaks backward compatibility:
1. **Restore Pre-Migration Dump**: Follow [restore-procedure.md](file:///Users/sameerrathod/Desktop/astronet/disaster-recovery/restore-procedure.md) to restore from the snapshot taken right before migration.
2. **Execute Down Migration**: If utilizing an automated migration framework (e.g. `db-migrate` or `migrate-mongo`), execute the down command to revert schema versions:
   ```bash
   npm run db-migrate-down --prefix server
   ```
