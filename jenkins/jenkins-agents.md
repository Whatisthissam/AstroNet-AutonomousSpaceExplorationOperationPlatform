# Jenkins CI/CD Agents and Executor Node Setups

This directory documents the prerequisites and agent configurations for executing the AstroNet pipeline.

---

## 🛠️ Jenkins Agent Prerequisites
The Jenkins node executing the build must have the following binaries installed and configured in its path:
1. **Node.js 18+** (for installing dependencies and compiling Vite frontend assets).
2. **Docker Engine & CLI** (for building container images).
3. **Kubectl** (for initiating rollout deployments).
4. **AWS CLI** (for registry and EKS authentication).

## 🎟️ Required Credentials in Jenkins Credential Store

Ensure the following IDs are added to your Jenkins controller credentials page:

| Credentials ID | Type | Description |
|----------------|------|-------------|
| `astronet-docker-registry` | Username/Password | Credentials to push images to Docker Hub or private ECR registry |
| `astronet-kubeconfig` | Secret File | Kubeconfig file giving administrator permissions to target K8s cluster |
| `astronet-vault-token` | Secret Text | Administrative token used to bootstrap security policies in Vault |

## ⚙️ Triggering Builds via Webhooks
To automate the pipeline:
1. Head to GitHub Repo settings > **Webhooks** > **Add Webhook**.
2. Payload URL: `http://<jenkins_ip>:8080/github-webhook/`.
3. Event trigger: `Just the push event`.
