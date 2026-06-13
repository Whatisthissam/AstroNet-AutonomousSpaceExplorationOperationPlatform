#!/bin/sh
# ==========================================
# HashiCorp Vault Secrets Bootstrapping Script
# ==========================================

echo "🔄 Bootstrapping HashiCorp Vault secrets for AstroNet..."

# Expose Vault server address locally
export VAULT_ADDR="http://localhost:8200"

# Note: Dev Vault starts unsealed with token="root". 
# For production, you must run vault operator init, save the keys, and unseal!
export VAULT_TOKEN="root"

# 1. Wait until Vault is responsive
until vault status > /dev/null 2>&1; do
  echo "⏳ Waiting for Vault server to start..."
  sleep 2
done

echo "✅ Vault is responsive!"

# 2. Enable KV Secrets Engine (Version 2)
# Check if kv engine is already enabled
if vault secrets list | grep -q "secret/"; then
  echo "ℹ️ KV Secrets Engine is already enabled."
else
  echo "🔌 Enabling Key-Value Secrets Engine v2 under 'secret/' path..."
  vault secrets enable -version=2 kv
fi

# 3. Write Sensitive Application Credentials
echo "🔑 Writing AstroNet credentials..."
vault kv put secret/astronet/config \
  MONGO_URI="mongodb://astronet-mongodb:27017/astronet" \
  JWT_SECRET="astronet_super_secret_jwt_key_change_in_production_2024" \
  JWT_EXPIRES_IN="7d" \
  NASA_API_KEY="DEMO_KEY_NASA_TELEMETRY_API_KEY_VAL"

# 4. Read credentials back to verify write
echo "🔍 Verifying written credentials..."
vault kv get secret/astronet/config

# 5. Create App Read-Only Security Policy
echo "📄 Generating read-only access control policy..."
cat <<EOF > /tmp/astronet-policy.hcl
# Allow read-only access to AstroNet application configuration secrets
path "secret/data/astronet/*" {
  capabilities = ["read"]
}
EOF

# Write policy to Vault
vault policy write astronet-read-policy /tmp/astronet-policy.hcl
rm /tmp/astronet-policy.hcl

# 6. Generate a Token tied to the Read-Only Policy
echo "🎟️ Creating access token for the AstroNet backend server..."
APP_TOKEN=$(vault token create -policy="astronet-read-policy" -field=token)

echo "===================================================="
echo "🎉 Secrets bootstrapping completed successfully!"
echo "🎟️ App Access Token: ${APP_TOKEN}"
echo "Use this token inside server configurations to securely fetch environment variables."
echo "===================================================="
