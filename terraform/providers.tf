# ==========================================
# Terraform Provider Configuration
# ==========================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Configures remote state storage. For academic demos, this is commented out
  # and defaults to local state storage. In production, configure an S3 bucket.
  /*
  backend "s3" {
    bucket         = "astronet-terraform-state-bucket"
    key            = "state/astronet.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "astronet-terraform-locks"
  }
  */
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "AstroNet"
      ManagedBy   = "Terraform"
    }
  }
}

# Fetch details of AWS identity (Account ID, ARN)
data "aws_caller_identity" "current" {}

# Fetch details about EKS cluster token for K8s authentication
data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_name
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}
