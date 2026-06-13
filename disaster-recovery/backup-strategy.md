# AstroNet Disaster Recovery – Backup Strategy

This document details the automated backup strategy, schedules, and retention policies for the **AstroNet Platform** data layers.

---

## 📅 Backup Policy Summary

| Data Layer | Backup Method | Trigger / Frequency | Retention | Storage Class / Target |
|------------|---------------|---------------------|-----------|------------------------|
| **MongoDB Database** | `mongodump` binary + gzip | Daily at 02:00 UTC (Cron) | 30 Days | AWS S3 Bucket (`astronet-backups`) |
| **Kubernetes Volumes**| Velero / CSI Snapshot | Weekly (Sundays 00:00 UTC) | 60 Days | AWS EBS Volume Snapshots |
| **Secret Configurations**| Vault JSON export (encrypted)| On changes / Weekly | 90 Days | Secure offline storage Vault-KMIP |
| **Docker Images** | Versioned Registry tags | Triggered by CI pipeline | Indefinite | Amazon Elastic Container Registry |

---

## 💾 1. MongoDB Backup Automation Script

This script represents the cron-activated routine to dump database collections and upload to S3:

```bash
#!/bin/bash
# Description: Automated MongoDB Backup Routine
# Scheduled via Kubernetes CronJob or system crontab

BACKUP_DIR="/tmp/mongodump"
BUCKET_NAME="astronet-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="astronet_db_$TIMESTAMP.tar.gz"

echo "🏁 Starting MongoDB backup process..."

# Create clean backup directory
mkdir -p $BACKUP_DIR

# Run dump from container context
mongodump --uri="${MONGO_URI}" --out=$BACKUP_DIR

# Compress the dumped folders
tar -czf $BACKUP_DIR/$BACKUP_NAME -C $BACKUP_DIR .

# Upload archive to AWS S3 (assumes authenticated IAM roles for service accounts)
aws s3 cp $BACKUP_DIR/$BACKUP_NAME s3://$BUCKET_NAME/mongodb/$BACKUP_NAME

# Prune old backups locally
rm -rf $BACKUP_DIR

echo "✅ Backup successfully uploaded to s3://$BUCKET_NAME/mongodb/$BACKUP_NAME"
```

---

## 🗄️ 2. Kubernetes CSI Volume Snapshot Configuration

This Kubernetes manifest defines the StorageClass CSI snapshot trigger configurations:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: astronet-ebs-snapshot-class
  namespace: astronet
driver: ebs.csi.aws.com
deletionPolicy: Delete # Retain snapshots on claim deletes if set to 'Retain'
parameters:
  tag: "Project=AstroNet,Environment=Production"
```

Then, triggering a snapshot manually looks like this:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: astronet-mongodb-snapshot
  namespace: astronet
spec:
  volumeSnapshotClassName: astronet-ebs-snapshot-class
  source:
    persistentVolumeClaimName: mongodb-pvc
```
