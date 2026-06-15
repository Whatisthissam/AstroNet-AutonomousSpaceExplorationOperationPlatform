# 🚀 AstroNet – Autonomous Space Exploration Operations Platform

A complete DevOps implementation project demonstrating containerization, CI/CD automation, Kubernetes orchestration, monitoring, centralized logging, secrets management, disaster recovery planning, and Infrastructure as Code.

---

# 📖 Project Overview

AstroNet is a web-based mission operations platform designed to simulate mission monitoring and management activities for space exploration systems.

The project focuses on implementing a complete DevOps workflow using industry-standard tools and practices. It demonstrates how modern applications can be containerized, deployed, monitored, secured, and managed efficiently.

---

# ❓ Problem Statement

Modern applications require automated deployment, monitoring, logging, security, and infrastructure management. Traditional deployment methods involve manual configurations that are time-consuming and error-prone.

Managing deployments, monitoring, logs, and secrets separately becomes increasingly difficult as applications scale.

---

# 💡 Proposed Solution

AstroNet integrates multiple DevOps technologies into a single workflow:

* Docker for containerization
* Jenkins for CI/CD automation
* Kubernetes for orchestration
* Prometheus for monitoring
* Grafana for visualization
* ELK Stack for centralized logging
* HashiCorp Vault for secrets management
* Terraform for Infrastructure as Code

This approach improves scalability, reliability, automation, and operational visibility.

---

# 🛠 Technology Stack

| Category               | Technology            |
| ---------------------- | --------------------- |
| Frontend               | React + Vite          |
| Backend                | Node.js + Express     |
| Database               | MongoDB               |
| Version Control        | GitHub                |
| Containerization       | Docker                |
| CI/CD                  | Jenkins               |
| Orchestration          | Kubernetes (Minikube) |
| Monitoring             | Prometheus            |
| Visualization          | Grafana               |
| Logging                | ELK Stack             |
| Secrets Management     | HashiCorp Vault       |
| Infrastructure as Code | Terraform             |

---

# ✨ Key Features

* Containerized application deployment
* Automated CI/CD pipeline
* Kubernetes orchestration
* Monitoring and observability
* Centralized logging
* Secrets management
* Disaster recovery planning
* Infrastructure as Code implementation

---

# 🏗 System Architecture

<p align="center">
  <img src="Implementation-Screenshots/architecture1.png" width="1000"/>
</p>

The architecture combines application services, monitoring tools, logging components, and security services into a single integrated ecosystem.

---

# ⚙️ DevOps Deployment Architecture

<p align="center">
  <img src="Implementation-Screenshots/devopsarchitecture2.png" width="1000"/>
</p>

The deployment workflow automates code delivery from GitHub to Kubernetes through Jenkins and Docker, reducing manual intervention and improving deployment consistency.

---

# 📊 Monitoring & Logging Architecture

<p align="center">
  <img src="Implementation-Screenshots/monitoring.png" width="1000"/>
</p>

Monitoring and logging services work together to provide complete visibility into application performance and operational activities.

---

# 🔄 Disaster Recovery Architecture

<p align="center">
  <img src="Implementation-Screenshots/disaster-recovery.png" width="1000"/>
</p>

If the application stops working due to a failure, the project can be recovered using the GitHub repository, Docker images, and Kubernetes files. These resources help bring the system back online quickly without rebuilding everything from scratch.

---

# 📂 Project Structure

```bash
astronet/
├── client/
├── server/
├── kubernetes/
├── monitoring/
├── logging/
├── vault/
├── terraform/
├── disaster-recovery/
├── Implementation-Screenshots/
├── Jenkinsfile
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# 📸 Application Screens

## Landing Page

![Landing Page](Implementation-Screenshots/LandingPage.png)

AstroNet provides a centralized mission control dashboard where users can access different modules, monitor mission activities, and manage operational information through a user-friendly interface.

---

## Dashboard

![Dashboard](Implementation-Screenshots/Dashboard.png)

The dashboard presents mission-related information in a structured format, making it easier to monitor operations and access important project features.

---

## Analytics Dashboard

![Analytics Dashboard](Implementation-Screenshots/Analytics.png)

Mission insights and operational data are organized through visual components, helping users understand system activity more effectively.

---

# 🐳 Docker Implementation

## Docker Image Creation

![Docker Image Creation](Implementation-Screenshots/dockerimage1.png)

Separate Docker images were created for the frontend and backend services. Packaging the application into containers simplifies deployment and ensures consistency across different systems.

---

## Docker Images Verification

![Docker Images Verification](Implementation-Screenshots/dockerimage2.png)

The required Docker images were successfully built and verified. Successful image creation confirmed that the application was ready for containerized deployment.

---

## Docker Desktop Images

![Docker Desktop Images](Implementation-Screenshots/dockerimage-dashboard.png)

Docker Desktop was used to manage and monitor container images. It provided a convenient interface for viewing image details and deployment resources.

---

## Running Docker Containers

![Docker Containers](Implementation-Screenshots/dockercontrainer1.png)

Application services were launched as independent containers. Running containers confirmed that the application components were functioning correctly within isolated environments.

---

## Container Verification

![Container Verification](Implementation-Screenshots/dockercontainer2.png)

Container status verification ensured that all required services were running correctly and communicating with one another.

---

## Multi-Container Deployment

![Multi Container Deployment](Implementation-Screenshots/dockercontainer3.png)

Multiple application services operated together within a shared environment, demonstrating successful container orchestration.

---

## Docker Compose Deployment

![Docker Compose Deployment](Implementation-Screenshots/dockercontainer4.png)

Multiple services were managed together using Docker Compose. This simplified container orchestration and enabled seamless communication between application components.

---

# 🔄 Jenkins CI/CD

## Jenkins Installation

![Jenkins Installation](Implementation-Screenshots/jenkinimage.png)

Jenkins was configured to automate the build and deployment workflow. Automation reduced manual effort and helped maintain a consistent deployment process.

---

## Jenkins Dashboard

![Jenkins Dashboard](Implementation-Screenshots/jenkinuidashboard.png)

Pipeline jobs, build history, and deployment activities were monitored from a centralized dashboard.

---

## Jenkins Pipeline Failure

![Jenkins Pipeline Failure](Implementation-Screenshots/jenkinpipelinefailure.png)

An initial pipeline issue was encountered during implementation. The error was analyzed through build logs and resolved through troubleshooting.

---

## Jenkins Pipeline Success

![Jenkins Pipeline Success](Implementation-Screenshots/jenkinpipelinesuccess.png)

The automated pipeline completed all configured stages successfully. This confirmed that the CI/CD workflow was functioning as expected.

---

# ☸️ Kubernetes Deployment

## Minikube Installation

![Minikube Installation](Implementation-Screenshots/installed-minikube-causeofStorageIssues.png)

Minikube was installed to create a local Kubernetes environment. It provided a lightweight platform for testing and managing containerized workloads.

---

## Running Minikube Cluster

![Running Minikube Cluster](Implementation-Screenshots/minikubes-running-success.png)

The Kubernetes cluster was started successfully and became ready for deployment activities.

---

## Kubernetes Deployment

![Kubernetes Deployment](Implementation-Screenshots/kubernetes-deployment-success.png)

Application resources were deployed using Kubernetes manifests. The deployment process automated workload management and resource allocation.

---

## Kubernetes Pods

![Kubernetes Pods](Implementation-Screenshots/kubernetes-pods-deployed-and-runningsuccess.png)

Application components were running inside Kubernetes pods. Pods allowed services to be managed, monitored, and restarted automatically when required.

---

# 📈 Monitoring

## Prometheus & Grafana Services

![Prometheus and Grafana](Implementation-Screenshots/prometheus\&grafana-containerRunning.png)

Monitoring services were deployed successfully to collect and visualize application metrics.

---

## Prometheus Dashboard

![Prometheus Dashboard](Implementation-Screenshots/prometheusDashboard.png)

Application metrics were collected and displayed through Prometheus. Monitoring these metrics helps identify performance trends and operational issues.

---

## Grafana Dashboard

![Grafana Dashboard](Implementation-Screenshots/grafana-dashboard.png)

Grafana was integrated to visualize application metrics through dashboards. The dashboard was configured successfully, but no metric data was displayed because of a Prometheus datasource configuration issue.

---

# 📜 ELK Stack Logging

## ELK Stack Deployment

![ELK Stack](Implementation-Screenshots/ELK_ContainerRunning1.png)

Elasticsearch, Logstash, and Kibana services were deployed successfully. Together they provide centralized logging and easier troubleshooting capabilities.

---

## ELK Verification

![ELK Verification](Implementation-Screenshots/ELK_ContainerRunning2.png)

All ELK services were verified and confirmed to be running correctly within the environment.

---

## Kibana Dashboard

![Kibana Dashboard](Implementation-Screenshots/elk dashboard.png)

Kibana was successfully deployed and accessed through the web interface for centralized log management and analysis.

---

# 🔐 HashiCorp Vault

## Vault Deployment

![Vault Deployment](Implementation-Screenshots/vault-running.png)

Sensitive credentials and configuration secrets were managed securely using Vault.

---

## Vault Verification

![Vault Verification](Implementation-Screenshots/vault-running2.png)

Vault services were verified to ensure proper operation of the secret management environment.

---

# 🏗 Terraform (Infrastructure as Code)

## Terraform Installation

![Terraform Installation](Implementation-Screenshots/terraform-installed.png)

Terraform was installed to demonstrate Infrastructure as Code concepts.

---

## Terraform Initialization

![Terraform Initialization](Implementation-Screenshots/terraform-initialised.png)

Required providers and dependencies were downloaded successfully during initialization.

---

## Terraform Validation Error

![Terraform Validation Error](Implementation-Screenshots/terraform-error.png)

Configuration validation identified missing module references and provider configuration issues during testing.

---

# ⚠️ Challenges Faced

* Jenkins pipeline syntax errors during initial setup
* Docker port conflict while deploying backend services
* Kubernetes namespace and deployment configuration issues
* Grafana dashboard showing no metrics due to Prometheus datasource configuration
* Terraform validation errors caused by missing infrastructure references

These challenges provided valuable hands-on troubleshooting experience throughout the project.

---

# 🚀 Future Enhancements

* AWS EKS deployment
* Production-grade Terraform infrastructure
* Advanced Grafana alerting
* Automated backup strategies
* Multi-cluster Kubernetes deployment
* Enhanced monitoring and observability

---

# 🎯 Conclusion

AstroNet successfully demonstrates a complete DevOps workflow using Docker, Jenkins, Kubernetes, Prometheus, Grafana, ELK Stack, Vault, and Terraform. The project provided practical experience with containerization, automation, monitoring, logging, security, and Infrastructure as Code while highlighting real-world deployment challenges and troubleshooting techniques.

---

## 👨‍💻 Author

**Sameer Rathod**



