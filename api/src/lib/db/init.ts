/**
 * Database initialization module
 * This file is imported at app startup to initialize the database
 */
import { useNeDb } from '../config';

// Initialize database only if we're not in middleware (Edge Runtime)
// This check avoids process.cwd() errors in Edge Runtime
if (typeof process !== 'undefined' && typeof process.cwd === 'function' && useNeDb()) {
  // Dynamic import to avoid Edge Runtime errors
  const setupModule = require('./setup');
  if (setupModule && typeof setupModule.initializeAllCollections === 'function') {
    setupModule.initializeAllCollections()
      .then(() => console.log('Database initialized'))
      .catch((err: Error) => console.error('Error initializing database:', err));
  }
}

export default {
  // This is intentionally empty - this file only runs the initialization
}; 