# Plan for Copying Static JSON Data to NeDB Database

## Overview
This plan outlines the process of setting up a NeDB database within the Vercel deployment directory to make the static JSON mock data writable. NeDB provides MongoDB-like functionality with a JSON file-based storage system, making it ideal for this transition. The database will be initialized from the existing JSON data and will support full CRUD operations.

## Steps

### 1. Setup NeDB Dependencies
- Add `nedb` package to the project's `/api/package.json`
- Install dependencies using `npm install` from the `/api` directory
- Make sure the dependency is properly included in the Vercel deployment bundle

### 2. Create Database Structure
- Create a `/api/src/lib/db` directory to store the database implementation
  - `db/index.js` - Main entry point for database operations
  - `db/collections.js` - Collection initialization and management
  - `db/access.js` - Data access layer with toggle functionality
  - `db/utils.js` - Database utility functions
- The actual database files will be stored in the `/tmp` directory at runtime in Vercel
- Use existing project structure and conventions for consistency

### 3. Database Initialization Script
- Create initialization logic in `/api/src/lib/db/init.js`
- The script will:
  - Create database collections if they don't exist
  - Load data from the static JSON files into the corresponding collections
  - Set up appropriate indexes for frequently queried fields
  - Configure persistence settings for reliable data storage
- Make the initialization automatic at runtime when needed

### 4. Data Source Switch Implementation
- Create a configuration system with a data source toggle flag in `/api/src/lib/config.js`
- Implementation options:
  - Environment variable (e.g., `USE_NEDB=true/false`)
  - Configuration file with a toggle setting
  - Feature flag in the application settings
- Create a data access layer in `/api/src/lib/db/access.js` that switches between data sources:
  - When flag is OFF: read directly from static JSON files (original behavior)
  - When flag is ON: read/write to the NeDB database
- Ensure all API handlers use this data access layer instead of direct data access
- Add ability to reset the database to original JSON state when needed

### 5. CRUD Operations Implementation
- Create standardized service functions in `/api/src/lib/db/services/`:
  - `/api/src/lib/db/services/products.js`
  - `/api/src/lib/db/services/customers.js`
  - `/api/src/lib/db/services/orders.js`
  - etc. for each data type
- Implement CRUD operations in each service:
  - Create: Insert new records into collections
  - Read: Query collections with various filters and projections
  - Update: Modify existing records with various update operators
  - Delete: Remove records from collections
- Implement MongoDB-like query capabilities using NeDB's built-in operators
- Add support for pagination, sorting, and filtering in read operations

### 6. API Integration
- Update existing API routes to use the data access layer:
  - Modify files in `/api/src/app/api/*` to import from the new database services
  - Example: `/api/src/app/api/customers/[id]/route.ts` would import from `/api/src/lib/db/services/customers.js`
- Implement proper error handling for database operations
- Ensure all write operations are properly validated
- Add endpoints to:
  - Check current data source status
  - Toggle data source at runtime (if needed)
  - Reinitialize database from static JSON if corrupted
  - Perform maintenance operations (compaction, reindexing)

### 7. Migration Strategy
- Create a version control system for the database structure in `/api/src/lib/db/migrations/`
- Implement a simple migration system to handle schema changes
- Ensure migrations run automatically when the application deploys

### 8. Database Utilities
- Create utility functions in `/api/src/lib/db/utils.js` for database management:
  - Database initialization and connection management
  - Index creation and maintenance
  - Data validation before write operations
  - Error handling and logging
  - Backup and restore functionality

### 9. Vercel Deployment Configuration
- Configure NeDB to work within Vercel's serverless functions environment:
  - Set the database file location to `/tmp` directory for writable access in Vercel
  - Update the `/api/deploy.sh` script to include NeDB configuration
  - Add NeDB-related environment variables to Vercel project settings
- Add initialization check at the start of each serverless function to ensure database is ready
- Implement a database warm-up strategy to handle cold starts efficiently
- Configure proper error handling for database file access limitations in Vercel
- Ensure all database code is properly bundled within the Vercel deployment

### 10. Testing
- Create tests in `/api/src/__tests__/db/` for database functionality:
  - Test all CRUD operations
  - Test data source switching functionality
  - Verify data consistency when switching between sources
  - Test database initialization process
  - Test data integrity after migration from static JSON
- Implement mock Vercel environment for testing database persistence
- Create integration tests for API routes using the database

### 11. Backup Strategy
- Implement a periodic backup mechanism for the database
- Consider exporting data back to the original JSON format for versioning purposes
- Implement a simple rollback mechanism for failed database operations

## Technical Considerations
- NeDB is suitable for this use case because:
  - It provides a MongoDB-like API familiar to many developers
  - It stores data in JSON format, compatible with the existing data
  - It supports indexing for better query performance
  - It offers robust CRUD operations with transaction-like atomicity
  - It works well in both development and production environments
  - It can operate entirely in-memory with optional persistence

- NeDB implementation specifics:
  - Each collection is stored in a separate file
  - Data is automatically persisted to disk by default
  - Supports both in-memory and persistent modes
  - Provides automatic compaction of database files
  - Supports rich querying with MongoDB-compatible operators

- Considerations for NeDB in the Vercel environment:
  - File-based storage has limitations in the `/tmp` directory
  - Need to handle database initialization on cold starts
  - The size is limited to available storage in the Vercel environment
  - Consider in-memory operation with scheduled persistence for better performance
  - Database files in `/tmp` will not persist across function invocations
  - Need to implement re-initialization from static data when needed

- Data source switching has these benefits:
  - Allows easy rollback to known-good static data
  - Simplifies development and testing
  - Provides a fallback mechanism if database becomes corrupted
  - Enables gradual migration to database-backed storage

## Implementation Example
```javascript
// /api/src/lib/db/index.js
const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');
const { getConfig } = require('../config');

// Determine environment-appropriate database path
const getDbDirectory = () => {
  // Use environment variable to determine if we're in Vercel production
  if (process.env.VERCEL_ENV === 'production') {
    const tmpDir = path.join('/tmp', 'db');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return tmpDir;
  }
  
  // Use local directory for development
  const localDir = path.join(process.cwd(), 'db');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  return localDir;
};

// Collection cache
const collections = {};

// Initialize or get a collection
const getCollection = async (collectionName) => {
  if (!collections[collectionName]) {
    const dbDir = getDbDirectory();
    collections[collectionName] = new Datastore({
      filename: path.join(dbDir, `${collectionName}.db`),
      autoload: true
    });
    
    // Set up indexes if needed
    if (collectionName === 'products') {
      collections[collectionName].ensureIndex({ fieldName: 'id', unique: true });
    } else if (collectionName === 'customers') {
      collections[collectionName].ensureIndex({ fieldName: 'email', unique: true });
    }
    
    // Check if collection needs initialization
    const isEmpty = await isCollectionEmpty(collections[collectionName]);
    if (isEmpty) {
      await initializeFromJson(collections[collectionName], collectionName);
    }
  }
  
  return collections[collectionName];
};

// Helper to check if collection is empty
const isCollectionEmpty = (collection) => {
  return new Promise((resolve) => {
    collection.count({}, (err, count) => {
      resolve(err || count === 0);
    });
  });
};

// Initialize collection from JSON file
const initializeFromJson = async (collection, collectionName) => {
  try {
    const jsonPath = path.join(process.cwd(), 'mock-data', `${collectionName}.json`);
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    return new Promise((resolve, reject) => {
      // Clear existing data if any
      collection.remove({}, { multi: true }, () => {
        // Insert JSON data
        collection.insert(jsonData, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  } catch (error) {
    console.error(`Error initializing ${collectionName} from JSON:`, error);
    throw error;
  }
};

module.exports = {
  getCollection,
  initializeFromJson
};
```

```javascript
// /api/src/lib/db/access.js
const fs = require('fs');
const path = require('path');
const { getCollection } = require('./index');
const { getConfig } = require('../config');

// Data access factory with toggle capability
const getDataSource = (collectionName) => {
  const useNeDb = getConfig('USE_NEDB', 'false') === 'true';
  
  if (useNeDb) {
    return {
      findOne: async (query) => {
        const collection = await getCollection(collectionName);
        return new Promise((resolve, reject) => {
          collection.findOne(query, (err, doc) => {
            if (err) reject(err);
            else resolve(doc);
          });
        });
      },
      
      find: async (query = {}, options = {}) => {
        const collection = await getCollection(collectionName);
        return new Promise((resolve, reject) => {
          let cursor = collection.find(query);
          
          if (options.sort) {
            cursor = cursor.sort(options.sort);
          }
          
          if (options.skip) {
            cursor = cursor.skip(options.skip);
          }
          
          if (options.limit) {
            cursor = cursor.limit(options.limit);
          }
          
          cursor.exec((err, docs) => {
            if (err) reject(err);
            else resolve(docs);
          });
        });
      },
      
      create: async (doc) => {
        const collection = await getCollection(collectionName);
        return new Promise((resolve, reject) => {
          collection.insert(doc, (err, newDoc) => {
            if (err) reject(err);
            else resolve(newDoc);
          });
        });
      },
      
      update: async (query, update, options = { multi: false }) => {
        const collection = await getCollection(collectionName);
        return new Promise((resolve, reject) => {
          collection.update(query, update, options, (err, numAffected) => {
            if (err) reject(err);
            else resolve(numAffected);
          });
        });
      },
      
      delete: async (query, options = { multi: false }) => {
        const collection = await getCollection(collectionName);
        return new Promise((resolve, reject) => {
          collection.remove(query, options, (err, numRemoved) => {
            if (err) reject(err);
            else resolve(numRemoved);
          });
        });
      },
      
      reset: async () => {
        const collection = await getCollection(collectionName);
        return initializeFromJson(collection, collectionName);
      }
    };
  } else {
    // Use static JSON files
    return {
      findOne: async (query) => {
        const jsonPath = path.join(process.cwd(), 'mock-data', `${collectionName}.json`);
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Simple query implementation for static JSON
        if (typeof query === 'object') {
          return data.find(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
          }) || null;
        }
        
        return null;
      },
      
      find: async (query = {}) => {
        const jsonPath = path.join(process.cwd(), 'mock-data', `${collectionName}.json`);
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Simple filtering for static JSON
        if (Object.keys(query).length === 0) {
          return data;
        }
        
        return data.filter(item => {
          return Object.keys(query).every(key => item[key] === query[key]);
        });
      },
      
      // Write operations throw errors in static JSON mode
      create: () => Promise.reject(new Error("Cannot write to static JSON files")),
      update: () => Promise.reject(new Error("Cannot write to static JSON files")),
      delete: () => Promise.reject(new Error("Cannot write to static JSON files"))
    };
  }
};

module.exports = {
  getDataSource
};
```

```javascript
// Example API route using the data source
// /api/src/app/api/customers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db/access';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customersDb = getDataSource('customers');
    const customer = await customersDb.findOne({ id: params.id });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const customersDb = getDataSource('customers');
    
    // Attempt update
    const numUpdated = await customersDb.update(
      { id: params.id },
      { $set: body }
    );
    
    if (numUpdated === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    // Get updated customer
    const updatedCustomer = await customersDb.findOne({ id: params.id });
    return NextResponse.json({ customer: updatedCustomer });
  } catch (error) {
    // Handle specific errors
    if (error.message === "Cannot write to static JSON files") {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to write data.' },
        { status: 400 }
      );
    }
    
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Next Steps
After implementing this basic solution, consider future enhancements:
- Implement caching layer for frequently accessed data
- Add full-text search capabilities for text fields
- Develop more sophisticated data migration tools
- Consider moving to a full MongoDB database if data complexity grows
- Add data analytics and reporting capabilities
- Explore Vercel Edge Config or similar for more persistent storage options 