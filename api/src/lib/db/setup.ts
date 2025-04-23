/**
 * Database setup script
 * Initializes all collections on first run
 */
const fs = require('fs');
const path = require('path');
const db = require('./index');

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
  | 'faq';

// List of all collections to initialize
const collections: CollectionName[] = [
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
const initializeAllCollections = async (): Promise<void> => {
  console.log('Initializing all collections...');
  
  // Check which JSON files actually exist
  const mockDataDir = path.join(process.cwd(), 'mock-data');
  const existingFiles = fs.readdirSync(mockDataDir)
    .filter((file: string) => file.endsWith('.json'))
    .map((file: string) => file.replace('.json', ''));
  
  // Only initialize collections that have corresponding JSON files
  const collectionsToInitialize = collections.filter(collection => 
    existingFiles.includes(collection)
  );
  
  console.log(`Found ${collectionsToInitialize.length} collections to initialize.`);
  
  // Initialize each collection in parallel
  await Promise.all(
    collectionsToInitialize.map(async collection => {
      try {
        console.log(`Initializing collection: ${collection}`);
        await db.initializeCollectionIfEmpty(collection);
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
  initializeAllCollections
}; 