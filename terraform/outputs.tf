# ==========================================
# Terraform Output Parameters
# ==========================================

output "vpc_id" {
  description = "The ID of the generated VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "eks_cluster_name" {
  description = "The name of the provisioned Elastic Kubernetes Service cluster"
  value       = aws_eks_cluster.eks.name
}

output "eks_cluster_endpoint" {
  description = "The HTTPS API endpoint of the EKS cluster control plane"
  value       = aws_eks_cluster.eks.endpoint
}

output "eks_cluster_certificate_authority" {
  description = "The base64 encoded certificate authority data for cluster connection"
  value       = aws_eks_cluster.eks.certificate_authority[0].data
}

output "db_connection_endpoint" {
  description = "The private DNS endpoint of the Mongo/DocumentDB database instance"
  value       = aws_docdb_cluster.mongodb.endpoint
}

output "bastion_public_ip" {
  description = "The public IP of the Bastion node for secure private routing"
  value       = aws_instance.bastion.public_ip
}
