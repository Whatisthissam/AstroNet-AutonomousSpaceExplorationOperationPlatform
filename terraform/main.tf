# ==========================================
# Main Terraform Infrastructure Definition
# ==========================================

# Retrieve availability zones in the current AWS region
data "aws_availability_zones" "available" {
  state = "available"
}

# ------------------------------------------
# VPC & NETWORKING
# ------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.environment}-astronet-vpc"
  }
}

# Public Subnets (Ingress load balancers & Bastion host)
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name                     = "${var.environment}-astronet-public-${count.index + 1}"
    "kubernetes.io/role/elb" = "1" # Required for AWS Load Balancer Controller
  }
}

# Private Subnets (EKS nodes and private services)
resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name                              = "${var.environment}-astronet-private-${count.index + 1}"
    "kubernetes.io/role/internal-elb" = "1" # Required for internal load balancers
  }
}

# Internet Gateway for Public internet traffic
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-astronet-igw"
  }
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"
  tags = {
    Name = "${var.environment}-astronet-nat-eip"
  }
}

# NAT Gateway to allow private pods to connect out safely
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.environment}-astronet-nat"
  }
  depends_on = [aws_internet_gateway.gw]
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "${var.environment}-astronet-public-rt"
  }
}

# Private Route Table routing through NAT Gateway
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "${var.environment}-astronet-private-rt"
  }
}

# Public Subnets Route Table Associations
resource "aws_route_table_association" "public" {
  count          = length(var.public_subnet_cidrs)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private Subnets Route Table Associations
resource "aws_route_table_association" "private" {
  count          = length(var.private_subnet_cidrs)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# ------------------------------------------
# SECURITY GROUPS
# ------------------------------------------

# Bastion SG
resource "aws_security_group" "bastion" {
  name        = "${var.environment}-astronet-bastion-sg"
  description = "Allows SSH access to Bastion Host"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH from authorized IPs"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # In production, lock down to user IP
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "${var.environment}-astronet-bastion-sg"
  }
}

# EKS Cluster SG
resource "aws_security_group" "eks_cluster" {
  name        = "${var.environment}-astronet-eks-cluster-sg"
  description = "EKS control plane communication with worker nodes"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "${var.environment}-astronet-eks-cluster-sg"
  }
}

# EKS Workers SG
resource "aws_security_group" "eks_nodes" {
  name        = "${var.environment}-astronet-eks-nodes-sg"
  description = "Security group for EKS worker nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow traffic from control plane"
    from_port       = 1025
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
  }

  ingress {
    description = "Allow intra-node communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  ingress {
    description = "HTTP Ingress traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS Ingress traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "${var.environment}-astronet-eks-nodes-sg"
  }
}

# Database (DocumentDB/MongoDB) SG
resource "aws_security_group" "mongodb" {
  name        = "${var.environment}-astronet-mongodb-sg"
  description = "Allows EKS nodes to connect to MongoDB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MongoDB access from EKS worker nodes"
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
  }

  ingress {
    description     = "MongoDB access from Bastion"
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-astronet-mongodb-sg"
  }
}

# ------------------------------------------
# INSTANCES & BASTION HOST
# ------------------------------------------
resource "aws_instance" "bastion" {
  ami                    = "ami-0c7217cdde317cfec" # Amazon Linux 2 AMI in us-east-1
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.bastion.id]

  tags = {
    Name = "${var.environment}-astronet-bastion"
  }
}

# ------------------------------------------
# EKS KUBERNETES CLUSTER
# ------------------------------------------

# IAM Role for EKS Control Plane
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.environment}-astronet-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# Provision the EKS Cluster
resource "aws_eks_cluster" "eks" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    security_group_ids      = [aws_security_group.eks_cluster.id]
    subnet_ids              = concat(aws_subnet.public[*].id, aws_subnet.private[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# IAM Role for Worker Nodes
resource "aws_iam_role" "eks_node_role" {
  name = "${var.environment}-astronet-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_registry_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# Provision EKS Node Groups in Private Subnets for Isolation
resource "aws_eks_node_group" "nodes" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "${var.environment}-astronet-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = aws_subnet.private[*].id
  instance_types  = var.eks_instance_types

  scaling_config {
    desired_size = var.eks_desired_capacity
    max_size     = 4
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_registry_policy,
  ]
}

# ------------------------------------------
# DATABASE (AWS DOCUMENTDB - MONGODB COMPATIBLE)
# ------------------------------------------

# Subnet Group for Database
resource "aws_docdb_subnet_group" "db_subnet" {
  name       = "${var.environment}-astronet-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.environment}-astronet-db-subnet-group"
  }
}

# DocumentDB Cluster Configuration
resource "aws_docdb_cluster" "mongodb" {
  cluster_identifier      = "${var.environment}-astronet-mongodb-cluster"
  engine                  = "docdb"
  master_username         = var.db_username
  master_password         = var.db_password
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_docdb_subnet_group.db_subnet.name
  vpc_security_group_ids  = [aws_security_group.mongodb.id]

  tags = {
    Name = "${var.environment}-astronet-mongodb-cluster"
  }
}

# Database Instance Provisioning
resource "aws_docdb_cluster_instance" "cluster_instances" {
  count              = 1
  identifier         = "${var.environment}-astronet-db-instance-${count.index + 1}"
  cluster_identifier = aws_docdb_cluster.mongodb.id
  instance_class     = var.db_instance_class
}
