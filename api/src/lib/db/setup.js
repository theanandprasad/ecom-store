/**
 * Database setup script
 * Initializes all collections on first run
 */
const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

// Collection cache
const collections = {};

// Get database path
const getDbPath = () => {
  // In production Vercel environment
  if (process.env.VERCEL_ENV === 'production') {
    return '/tmp/db';
  }
  
  // In development, use a local directory
  return path.join(process.cwd(), 'db');
};

/**
 * Ensure the database directory exists
 */
const ensureDbDirectory = () => {
  const dbDir = getDbPath();
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  return dbDir;
};

/**
 * Get or create a database collection
 * @param {string} collectionName The name of the collection
 * @returns {Datastore} The database collection
 */
const getCollection = (collectionName) => {
  // If we've already initialized this collection, return it
  if (collections[collectionName]) {
    return collections[collectionName];
  }

  // Ensure the database directory exists
  const dbDir = ensureDbDirectory();

  // Create database path
  const dbPath = path.join(dbDir, `${collectionName}.db`);
  
  // Create and cache the collection
  collections[collectionName] = new Datastore({ 
    filename: dbPath,
    autoload: true 
  });

  return collections[collectionName];
};

/**
 * Check if a collection is empty
 * @param {Datastore} collection The collection to check
 * @returns {Promise<boolean>} A promise that resolves to true if empty, false otherwise
 */
const isCollectionEmpty = (collection) => {
  return new Promise((resolve) => {
    collection.count({}, (err, count) => {
      resolve(err !== null || count === 0);
    });
  });
};

/**
 * Load data from a JSON file
 * @param {string} collectionName The name of the collection/JSON file
 * @returns {Array} The parsed JSON data
 */
const loadJsonData = (collectionName) => {
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
 * @param {Datastore} collection The collection to initialize
 * @param {string} collectionName The name of the collection/JSON file
 * @returns {Promise<void>} A promise that resolves when initialization is complete
 */
const initializeFromJson = async (collection, collectionName) => {
  try {
    // Load the JSON data
    const jsonData = loadJsonData(collectionName);
    
    if (!jsonData || (Array.isArray(jsonData) && jsonData.length === 0)) {
      console.warn(`No data found for ${collectionName}`);
      return;
    }

    // Clear existing data
    await new Promise((resolve, reject) => {
      collection.remove({}, { multi: true }, (err) => {
        if (err) {
          console.error(`Error clearing ${collectionName}:`, err);
          reject(err);
          return;
        }
        resolve();
      });
    });
    
    // Extract items to insert - handle both array and nested array formats
    const dataToInsert = Array.isArray(jsonData) 
      ? jsonData
      : (jsonData[collectionName] && Array.isArray(jsonData[collectionName]))
        ? jsonData[collectionName]
        : [jsonData];
    
    // Insert each item individually
    let insertedCount = 0;
    for (const item of dataToInsert) {
      await new Promise((resolve, reject) => {
        collection.insert(item, (err) => {
          if (err) {
            console.error(`Error inserting item into ${collectionName}:`, err);
            reject(err);
            return;
          }
          insertedCount++;
          resolve();
        });
      });
    }
    
    console.log(`Successfully initialized ${collectionName} with ${insertedCount} records`);
  } catch (error) {
    console.error(`Error initializing ${collectionName} from JSON:`, error);
    throw error;
  }
};

/**
 * Setup indexes for a collection
 * @param {Datastore} collection The collection to index
 * @param {string} collectionName The name of the collection
 */
const setupIndexes = (collection, collectionName) => {
  // Different indexes based on collection type
  switch (collectionName) {
    case 'products':
      collection.ensureIndex({ fieldName: 'id', unique: true });
      collection.ensureIndex({ fieldName: 'category' });
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
 * @param {string} collectionName The name of the collection
 * @returns {Promise<Datastore>} A promise that resolves to the collection
 */
const initializeCollectionIfEmpty = async (collectionName) => {
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

// List of all collections to initialize
const collections_to_initialize = [
  'products',
  'customers',
  'orders',
  'carts',
  'wishlists',
  'reviews',
  'support_tickets',
  'auth_tokens',
  'otp_sessions',
  'promotions',
  'returns',
  'notifications',
  'faq'
];

/**
 * Initialize all collections
 */
const initializeAllCollections = async () => {
  console.log('Initializing all collections...');
  
  // Check which JSON files actually exist
  const mockDataDir = path.join(process.cwd(), 'mock-data');
  const existingFiles = fs.readdirSync(mockDataDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  // Only initialize collections that have corresponding JSON files
  const collectionsToInitialize = collections_to_initialize.filter(collection => 
    existingFiles.includes(collection)
  );
  
  console.log(`Found ${collectionsToInitialize.length} collections to initialize.`);
  
  // Initialize each collection in parallel
  await Promise.all(
    collectionsToInitialize.map(async collection => {
      try {
        console.log(`Initializing collection: ${collection}`);
        await initializeCollectionIfEmpty(collection);
        console.log(`✓ Collection initialized: ${collection}`);
      } catch (error) {
        console.error(`Error initializing collection ${collection}:`, error);
      }
    })
  );
  
  console.log('All collections initialized.');
};

/**
 * Run the setup if this file is executed directly
 */
if (require.main === module) {
  initializeAllCollections()
    .then(() => {
      console.log('Setup completed successfully.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = {
  getCollection,
  initializeCollectionIfEmpty,
  isCollectionEmpty,
  initializeFromJson,
  loadJsonData,
  setupIndexes,
  initializeAllCollections,
  ensureDbDirectory
}; 