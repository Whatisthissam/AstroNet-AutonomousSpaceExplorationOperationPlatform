# ==========================================
# HashiCorp Vault Client Secrets Integration
# ==========================================

/**
 * This script demonstrates how the AstroNet Express backend retrieves configuration
 * parameters dynamically from HashiCorp Vault's KV engine instead of loading
 * plain text .env configurations.
 */

const axios = require('axios');

// Fetch Vault configuration from process environment (or fallback to defaults)
const VAULT_ADDR = process.env.VAULT_ADDR || 'http://localhost:8200';
const VAULT_TOKEN = process.env.VAULT_TOKEN || 'root'; // The client token authorized via read policy
const SECRET_PATH = 'secret/data/astronet/config';    // KV path containing credentials

/**
 * Fetches application secrets from HashiCorp Vault.
 * @returns {Promise<Object>} Object containing database credentials and keys.
 */
async function fetchVaultSecrets() {
  console.log(`📡 Fetching application configurations from Vault: ${VAULT_ADDR}/${SECRET_PATH}`);
  
  try {
    const response = await axios.get(`${VAULT_ADDR}/v1/${SECRET_PATH}`, {
      headers: {
        'X-Vault-Token': VAULT_TOKEN,
        'Content-Type': 'application/json',
      }
    });

    // Vault KV version 2 nests data inside data.data
    const secrets = response.data.data.data;
    
    if (!secrets) {
      throw new Error('Vault response did not contain data credentials.');
    }
    
    console.log('✅ Configurations loaded successfully from Vault!');
    return {
      MONGO_URI: secrets.MONGO_URI,
      JWT_SECRET: secrets.JWT_SECRET,
      JWT_EXPIRES_IN: secrets.JWT_EXPIRES_IN || '7d',
      NASA_API_KEY: secrets.NASA_API_KEY,
    };
  } catch (error) {
    console.error('❌ Failed to fetch secrets from Vault API:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    
    // In demo environments, we can fallback to standard environment variables
    console.log('⚠️ Falling back to local process environment variables...');
    return {
      MONGO_URI: process.env.MONGO_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    };
  }
}

// Module export for application bootstrap
module.exports = { fetchVaultSecrets };

// Self execution check (if running script directly with node)
if (require.main === module) {
  fetchVaultSecrets().then(config => {
    console.log('\n🔒 Initialized Config Object Structure:');
    console.log({
      MONGO_URI: config.MONGO_URI ? '****** [LOADED]' : 'NOT LOADED',
      JWT_SECRET: config.JWT_SECRET ? '****** [LOADED]' : 'NOT LOADED',
      JWT_EXPIRES_IN: config.JWT_EXPIRES_IN,
      NASA_API_KEY: config.NASA_API_KEY ? '****** [LOADED]' : 'NOT LOADED',
    });
  });
}
