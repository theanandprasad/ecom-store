/**
 * Application configuration module
 * Provides centralized access to configuration values and environment variables
 */

// Config types
type ConfigKey = 'USE_NEDB' | 'DB_PATH' | 'API_KEY';

// Default configuration values
const DEFAULT_CONFIG: Record<ConfigKey, string> = {
  'USE_NEDB': 'true',  // Toggle for using NeDB (true) or static JSON (false)
  'DB_PATH': '/tmp/db', // Default database path in Vercel production
  'API_KEY': '',        // API key for authentication
};

/**
 * Get configuration value from environment or default value
 * @param key Configuration key
 * @param defaultValue Optional default value if not found
 * @returns Configuration value
 */
export const getConfig = (key: ConfigKey, defaultValue?: string): string => {
  // Get from process.env or use default
  const configValue = process.env[key] || defaultValue || DEFAULT_CONFIG[key];
  return configValue;
};

/**
 * Check if we're in a Vercel production environment
 * @returns boolean
 */
export const isVercelProduction = (): boolean => {
  return process.env.VERCEL_ENV === 'production';
};

/**
 * Get the appropriate database path based on environment
 * @returns string path to database directory
 */
export const getDbPath = (): string => {
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
 * @returns boolean
 */
export const useNeDb = (): boolean => {
  return getConfig('USE_NEDB').toLowerCase() === 'true';
};

export default {
  getConfig,
  isVercelProduction,
  getDbPath,
  useNeDb,
}; 