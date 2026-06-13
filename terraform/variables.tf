# ==========================================
# Terraform Input Variables Definition
# ==========================================

variable "aws_region" {
  type        = string
  description = "The target AWS region for deployment"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Deployment lifecycle stage (dev, staging, prod)"
  default     = "dev"
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the Virtual Private Cloud (VPC)"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR list for public subnets (Ingress controllers and Bastion)"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR list for private subnets (Application workloads and databases)"
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "cluster_name" {
  type        = string
  description = "Name of the EKS Kubernetes cluster"
  default     = "astronet-eks-cluster"
}

variable "eks_instance_types" {
  type        = list(string)
  description = "AWS EC2 instance types to use for EKS node groups"
  default     = ["t3.medium"]
}

variable "eks_desired_capacity" {
  type        = number
  description = "Target number of node instances running in cluster"
  default     = 2
}

variable "db_instance_class" {
  type        = string
  description = "Instance class for database (e.g. MongoDB/DocumentDB)"
  default     = "db.t3.medium"
}

variable "db_name" {
  type        = string
  description = "Default database name initialized on startup"
  default     = "astronet"
}

variable "db_username" {
  type        = string
  description = "Administrator login username for DB"
  default     = "astronet_admin"
  sensitive   = true
}

variable "db_password" {
  type        = string
  description = "Administrator login password for DB"
  sensitive   = true
}
