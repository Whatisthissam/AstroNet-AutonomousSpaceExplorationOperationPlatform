# AstroNet Disaster Recovery – Restore Procedure

This guide documents the procedures for recovering database contents, application containers, and secret stores during an outage.

---

## 💾 1. MongoDB Database Restore

If the database becomes corrupted or suffers loss, use this procedure to restore collection states from the latest compressed snapshot:

### Step 1: Download backup package from S3
```bash
aws s3 cp s3://astronet-backups/mongodb/astronet_db_latest.tar.gz /tmp/restore/
```

### Step 2: Unzip the tar archive
```bash
tar -xzf /tmp/restore/astronet_db_latest.tar.gz -C /tmp/restore/dump/
```

### Step 3: Execute `mongorestore` into target cluster
Connect to the database instance and stream collection data:
```bash
# Connect and restore using MONGO_URI
mongorestore --uri="mongodb://astronet_admin:SuperSecurePassword987!@astronet-mongodb:27017/astronet" --drop /tmp/restore/dump/
```
*(Note: The `--drop` flag drops existing collections before restoring, ensuring a clean state).*

### Step 4: Verify Restoration
Access MongoDB shell and query the missions collection to verify database records:
```bash
mongosh "mongodb://astronet_admin:SuperSecurePassword987!@astronet-mongodb:27017/astronet" --eval "db.missions.countDocuments()"
```

---

## ⛵ 2. Kubernetes CSI Volume Restore

To restore the MongoDB storage volume from a Kubernetes volume snapshot:

### Step 1: Create a PVC referencing the volume snapshot
Save the following configuration as `restore-pvc.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
  namespace: astronet
spec:
  storageClassName: ebs-sc # EBS storage class name
  dataSource:
    name: astronet-mongodb-snapshot # Matches snapshot identifier
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

### Step 2: Apply configuration
```bash
kubectl apply -f restore-pvc.yaml
```

---

## 🔒 3. Vault Configurations Restore

If a Vault node fails, restore secret keys and policies:

### Step 1: Recover Vault Storage volumes or restore Raft Snapshot
```bash
# If running Vault with Raft backend, restore snapshot
vault operator raft snapshot restore /tmp/vault_snapshot.snap
```

### Step 2: Unseal the Vault
Supply the shamir keys to unseal the server instance:
```bash
vault operator unseal <UnsealKey-1>
vault operator unseal <UnsealKey-2>
vault operator unseal <UnsealKey-3>
```

### Step 3: Re-execute Bootstrapping (Fallback)
If Vault storage data is entirely lost, execute the bootstrap script to restore basic app policies and secrets:
```bash
sh vault/secrets-bootstrap.sh
```
