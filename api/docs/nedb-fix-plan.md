# NeDB Structure Inconsistency Fix Plan

## Current Issues

From our investigation, we've identified the following issues with the NeDB implementation:

1. **Inconsistent Data Storage Format**:
   - Original mock data is loaded as a single document with a nested array:
     ```js
     {
       "products": [
         { "id": "prod_001", ... },
         { "id": "prod_002", ... }
       ],
       "_id": "AjE8g8D8uAUwCjh7"
     }
     ```
   - New data is stored as individual documents:
     ```js
     {
       "id": "prod_1745392031507172",
       "name": "NeDB Test Product",
       ...,
       "_id": "5RRLLSpFNrVRaS7N"
     }
     ```

2. **Data Access Layer Issues**:
   - The system is falling back to static JSON even when NeDB mode is enabled
   - Server logs show `Reading mock data from: .../mock-data/products.json` despite NeDB being active
   - New data is being created but not properly retrieved or updated

3. **Edge Runtime Errors**:
   - The middleware is causing errors due to Node.js file system operations in Edge Runtime
   - Incorrect Next.js configuration for excluding packages from Edge Runtime

## Fix Plan

### 1. Update Database Initialization Process

File: `api/src/lib/db/setup.js`

Modify the `initializeFromJson` function to handle data properly:

```javascript
const initializeFromJson = async (collection, collectionName) => {
  try {
    const jsonPath = path.join(process.cwd(), 'mock-data', `${collectionName}.json`);
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
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
```

### 2. Create Database Migration Utility

Create a new file: `api/src/lib/db/migrate.ts`

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { getCollection } from './index';

/**
 * Normalize database structure - extract all nested arrays into individual documents
 */
export const normalizeDbStructure = async (collectionName: string): Promise<void> => {
  const collection = getCollection(collectionName);
  
  // Find all documents
  const docs = await new Promise((resolve, reject) => {
    collection.find({}, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
  
  // Find any document with a nested array
  let hasNestedArrays = false;
  let itemsToAdd = [];
  let docsToRemove = [];
  
  // @ts-ignore - docs is any[]
  for (const doc of docs) {
    if (doc[collectionName] && Array.isArray(doc[collectionName])) {
      hasNestedArrays = true;
      itemsToAdd.push(...doc[collectionName]);
      docsToRemove.push(doc._id);
    }
  }
  
  if (hasNestedArrays) {
    console.log(`Normalizing ${collectionName} database structure...`);
    
    // Remove the documents with nested arrays
    await new Promise((resolve, reject) => {
      // @ts-ignore
      collection.remove({ _id: { $in: docsToRemove } }, { multi: true }, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
    
    // Add individual items
    for (const item of itemsToAdd) {
      await new Promise((resolve, reject) => {
        collection.insert(item, (err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });
    }
    
    console.log(`${collectionName} database structure normalized. Added ${itemsToAdd.length} items.`);
  } else {
    console.log(`${collectionName} database structure is already normalized.`);
  }
};

/**
 * Run normalization on all collections
 */
export const normalizeAllCollections = async (): Promise<void> => {
  const collections = [
    'products', 'customers', 'orders', 'carts', 'wishlists', 
    'reviews', 'support_tickets', 'auth_tokens', 'otp_sessions', 
    'promotions', 'returns', 'notifications', 'faq'
  ];
  
  for (const collection of collections) {
    await normalizeDbStructure(collection);
  }
};
```

### 3. Update Data Access Layer

File: `api/src/lib/db/access.ts` - Update the NeDBDataSource class:

```typescript
// Update find method in NeDBDataSource class
async find(query: Query = {}, options: FindOptions = {}): Promise<T[]> {
  const db = await this.getDb();
  
  return new Promise((resolve, reject) => {
    let cursor = db.find(query);
    
    // Apply options
    if (options.sort) {
      cursor = cursor.sort(options.sort);
    }
    
    if (options.skip) {
      cursor = cursor.skip(options.skip);
    }
    
    if (options.limit) {
      cursor = cursor.limit(options.limit);
    }
    
    // Execute the query
    cursor.exec((err, docs) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Process docs that might contain arrays
      let results: T[] = [];
      for (const doc of docs) {
        // Check if document contains an array with the collection name
        if (doc[this.collectionName] && Array.isArray(doc[this.collectionName])) {
          // Filter the nested array based on the query
          const filteredItems = this.filterNestedArray(doc[this.collectionName], query);
          results = results.concat(filteredItems);
        } else {
          // Direct document
          results.push(doc as T);
        }
      }
      
      resolve(results);
    });
  });
}

// Add a helper method to filter nested arrays
private filterNestedArray(items: any[], query: Query): T[] {
  if (Object.keys(query).length === 0) {
    return items as T[];
  }
  
  return items.filter(item => {
    return Object.keys(query).every(key => item[key] === query[key]);
  }) as T[];
}

// Also update findOne to handle both structures
async findOne(query: Query): Promise<T | null> {
  const db = await this.getDb();
  
  return new Promise((resolve, reject) => {
    db.find(query, (err, docs) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (docs.length === 0) {
        // Try to find in nested arrays
        db.find({}, (nestedErr, allDocs) => {
          if (nestedErr) {
            reject(nestedErr);
            return;
          }
          
          for (const doc of allDocs) {
            // Check if document contains an array with the collection name
            if (doc[this.collectionName] && Array.isArray(doc[this.collectionName])) {
              const found = doc[this.collectionName].find(item => {
                return Object.keys(query).every(key => item[key] === query[key]);
              });
              
              if (found) {
                resolve(found as T);
                return;
              }
            }
          }
          
          resolve(null);
        });
      } else {
        resolve(docs[0] as T);
      }
    });
  });
}
```

### 4. Fix the Database Toggle Endpoint

File: `api/src/app/api/admin/database/toggle/route.ts`

```typescript
// When toggling to NeDB mode, reset the database directory first
if (newState) {
  try {
    // Reset database directory first
    const dbDir = path.join(process.cwd(), 'db');
    if (fs.existsSync(dbDir)) {
      // Remove all .db files
      const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.db'));
      for (const file of files) {
        fs.unlinkSync(path.join(dbDir, file));
      }
    }
    
    // Now initialize collections with the fixed initialization logic
    const { initializeAllCollections } = await import('@/lib/db/setup');
    await initializeAllCollections();
  } catch (error) {
    console.error('Error initializing database:', error);
    // Continue anyway - we want to toggle the mode even if initialization fails
  }
}
```

### 5. Create Database Normalization Endpoint

Create a new file: `api/src/app/api/admin/database/normalize/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { normalizeAllCollections } from '@/lib/db/migrate';
import { useNeDb } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Only allow this in development mode for security
    if (process.env.NODE_ENV === 'production' && !request.headers.get('x-admin-key')) {
      return NextResponse.json(
        { error: 'Unauthorized. This endpoint is only available in development mode or with an admin key.' },
        { status: 401 }
      );
    }
    
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return NextResponse.json(
        { error: 'Database normalization is only available when NeDB mode is enabled.' },
        { status: 400 }
      );
    }
    
    // Run the normalization
    await normalizeAllCollections();
    
    return NextResponse.json({
      success: true,
      message: 'Database structure normalized successfully.'
    });
  } catch (error) {
    console.error('Error normalizing database structure:', error);
    
    return NextResponse.json(
      { error: 'Failed to normalize database structure' },
      { status: 500 }
    );
  }
}
```

### 6. Update Next.js Configuration

Fix the Next.js configuration to use the correct property for excluding packages from Edge Runtime:

File: `api/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // This is the correct property for excluding packages from Edge Runtime
  serverExternalPackages: ['nedb', 'fs', 'path']
};

module.exports = nextConfig;
```

## Implementation Strategy

1. Implement the database initialization fix first
2. Create the migration utility and normalization endpoint
3. Update the data access layer
4. Fix the toggle endpoint
5. Apply Next.js configuration changes

## Testing Procedure

After implementing these changes:

1. Toggle to static JSON mode with:
   ```bash
   curl -X POST "http://localhost:3000/api/admin/database/toggle" -u admin:admin123
   ```

2. Toggle back to NeDB mode:
   ```bash
   curl -X POST "http://localhost:3000/api/admin/database/toggle" -u admin:admin123
   ```

3. Run the normalization process:
   ```bash
   curl -X POST "http://localhost:3000/api/admin/database/normalize" -u admin:admin123
   ```

4. Test CRUD operations:
   ```bash
   # Create a product
   curl -X POST "http://localhost:3000/api/products" -u admin:admin123 -H "Content-Type: application/json" -d '{"name": "Test Product", "description": "A test product", "price": 99.99, "image_url": "https://example.com/image.jpg", "category": "Test", "stock": 10}'
   
   # Retrieve the product by ID
   curl -X GET "http://localhost:3000/api/products/prod_ID" -u admin:admin123
   
   # Update the product
   curl -X PATCH "http://localhost:3000/api/products/prod_ID" -u admin:admin123 -H "Content-Type: application/json" -d '{"price": 89.99}'
   ```

## References

- [NeDB GitHub Repository](https://github.com/louischatriot/nedb)
- [Next.js Configuration Documentation](https://nextjs.org/docs/app/api-reference/next-config-js) 