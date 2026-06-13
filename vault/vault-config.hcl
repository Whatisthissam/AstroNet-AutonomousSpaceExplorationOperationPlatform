# ==========================================
# HashiCorp Vault Server Configuration
# ==========================================

# Enable Vault Web UI
ui = true

# File Storage Backend (for academic development & demos)
# Persistent data resides in /vault/data inside the container
storage "file" {
  path = "/vault/data"
}

# TCP Listener configuration
listener "tcp" {
  address     = "0.0.0.0:8200"
  
  # TLS is disabled for ease of local academic orchestration.
  # WARNING: Keep TLS enabled in staging and production!
  tls_disable = "true"
  
  # Optional: Define tls certificate and private key paths
  # tls_cert_file = "/vault/config/ssl/vault.crt"
  # tls_key_file  = "/vault/config/ssl/vault.key"
}

# Disable cluster node communication (not running HA cluster mode)
cluster_addr = "http://127.0.0.1:8201"
api_addr     = "http://127.0.0.1:8200"

# Allow core memory lock to prevent swapping secrets to disk (security best practice)
# Set to false if operating on hosts without IPC lock privileges
disable_mlock = true
