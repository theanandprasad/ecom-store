/**
 * Database module for NeDB implementation
 * Manages database connections and provides access to database collections
 */
const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Get database path
const getDbPath = () => {
  if (typeof config.getDbPath === 'function') {
    return config.getDbPath();
  }
  // Fallback if config module is not available
  return './db';
};

// Collection name type
type CollectionName = 
  | 'products' 
  | 'customers' 
  | 'orders'
  | 'carts'
  | 'wishlists'
  | 'reviews'
  | 'support_tickets'
  | 'auth_tokens'
  | 'otp_sessions'
  | 'promotions'
  | 'returns'
  | 'notifications'
  | 'faq'
  | 'categories';

// Collection cache to avoid recreating instances
const collections: Record<string, any> = {};

/**
 * Ensure the database directory exists
 */
const ensureDbDirectory = (): void => {
  const dbDir = getDbPath();
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
};

/**
 * Get or create a database collection
 * @param collectionName The name of the collection
 * @returns A promise that resolves to the collection instance
 */
const getCollection = (collectionName: CollectionName): any => {
  // If we've already initialized this collection, return it
  if (collections[collectionName]) {
    return collections[collectionName];
  }

  // Ensure the database directory exists
  ensureDbDirectory();

  // Create database path
  const dbPath = path.join(getDbPath(), `${collectionName}.db`);
  
  // Create and cache the collection
  collections[collectionName] = new Datastore({ 
    filename: dbPath,
    autoload: true 
  });

  return collections[collectionName];
};

/**
 * Check if a collection is empty
 * @param collection The collection to check
 * @returns A promise that resolves to true if empty, false otherwise
 */
const isCollectionEmpty = (collection: any): Promise<boolean> => {
  return new Promise((resolve) => {
    collection.count({}, (err: Error | null, count: number) => {
      resolve(err !== null || count === 0);
    });
  });
};

/**
 * Load data from a JSON file
 * @param collectionName The name of the collection/JSON file
 * @returns The parsed JSON data
 */
const loadJsonData = (collectionName: CollectionName): any[] => {
  try {
    const jsonPath = path.join(process.cwd(), 'mock-data', `${collectionName}.json`);
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error loading JSON data for ${collectionName}:`, error);
    return [];
  }
};

/**
 * Initialize a collection from JSON data
 * @param collection The collection to initialize
 * @param collectionName The name of the collection/JSON file
 * @returns A promise that resolves when initialization is complete
 */
const initializeFromJson = async (
  collection: any,
  collectionName: CollectionName
): Promise<void> => {
  try {
    // Load the JSON data
    const jsonData = loadJsonData(collectionName);
    
    if (!jsonData || jsonData.length === 0) {
      console.warn(`No data found for ${collectionName}`);
      return;
    }

    // Clear existing data and insert new data
    return new Promise((resolve, reject) => {
      collection.remove({}, { multi: true }, (err: Error | null) => {
        if (err) {
          console.error(`Error clearing ${collectionName}:`, err);
          reject(err);
          return;
        }
        
        collection.insert(jsonData, (insertErr: Error | null) => {
          if (insertErr) {
            console.error(`Error inserting data into ${collectionName}:`, insertErr);
            reject(insertErr);
            return;
          }
          
          console.log(`Successfully initialized ${collectionName} with ${jsonData.length} records`);
          resolve();
        });
      });
    });
  } catch (error) {
    console.error(`Error initializing ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Setup indexes for a collection
 * @param collection The collection to index
 * @param collectionName The name of the collection
 */
const setupIndexes = (collection: any, collectionName: CollectionName): void => {
  // Different indexes based on collection type
  switch (collectionName) {
    case 'products':
      collection.ensureIndex({ fieldName: 'id', unique: true });
      collection.ensureIndex({ fieldName: 'category' });
      break;
    case 'categories':
      collection.ensureIndex({ fieldName: 'id', unique: true });
      collection.ensureIndex({ fieldName: 'slug', unique: true });
      collection.ensureIndex({ fieldName: 'parent_id' });
      break;
    case 'customers':
      collection.ensureIndex({ fieldName: 'id', unique: true });
      collection.ensureIndex({ fieldName: 'email', unique: true });
      break;
    case 'orders':
      collection.ensureIndex({ fieldName: 'id', unique: true });
      collection.ensureIndex({ fieldName: 'customer_id' });
      break;
    case 'auth_tokens':
      collection.ensureIndex({ fieldName: 'token', unique: true });
      collection.ensureIndex({ fieldName: 'customer_id' });
      break;
    case 'otp_sessions':
      collection.ensureIndex({ fieldName: 'id', unique: true });
      collection.ensureIndex({ fieldName: 'phone' });
      break;
    // Add other collections as needed
  }
};

/**
 * Initialize a collection if it's empty
 * @param collectionName The name of the collection
 */
const initializeCollectionIfEmpty = async (collectionName: CollectionName): Promise<any> => {
  const collection = getCollection(collectionName);
  
  // Set up indexes
  setupIndexes(collection, collectionName);
  
  // Check if it's empty
  const empty = await isCollectionEmpty(collection);
  if (empty) {
    await initializeFromJson(collection, collectionName);
  }
  
  return collection;
};

// Export functions
module.exports = {
  getCollection,
  initializeCollectionIfEmpty,
  isCollectionEmpty,
  initializeFromJson,
  loadJsonData,
  setupIndexes,
}; 