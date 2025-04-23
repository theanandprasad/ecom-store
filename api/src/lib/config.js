/**
 * Application configuration module
 * Provides centralized access to configuration values and environment variables
 */

// Default configuration values
const DEFAULT_CONFIG = {
  'USE_NEDB': 'false',  // Toggle for using NeDB (true) or static JSON (false)
  'DB_PATH': '/tmp/db', // Default database path in Vercel production
  'API_KEY': '',        // API key for authentication
};

/**
 * Get configuration value from environment or default value
 * @param {string} key - Configuration key
 * @param {string} defaultValue - Optional default value if not found
 * @returns {string} Configuration value
 */
const getConfig = (key, defaultValue) => {
  // Get from process.env or use default
  const configValue = process.env[key] || defaultValue || DEFAULT_CONFIG[key];
  return configValue;
};

/**
 * Check if we're in a Vercel production environment
 * @returns {boolean}
 */
const isVercelProduction = () => {
  return process.env.VERCEL_ENV === 'production';
};

/**
 * Get the appropriate database path based on environment
 * @returns {string} path to database directory
 */
const getDbPath = () => {
  if (isVercelProduction()) {
    return getConfig('DB_PATH');
  }
  
  // In development, use a local db directory
  return process.env.NODE_ENV === 'test' 
    ? './test-db' 
    : './db';
};

/**
 * Check if NeDB should be used instead of static JSON
 * @returns {boolean}
 */
const useNeDb = () => {
  return getConfig('USE_NEDB').toLowerCase() === 'true';
};

module.exports = {
  getConfig,
  isVercelProduction,
  getDbPath,
  useNeDb,
}; 