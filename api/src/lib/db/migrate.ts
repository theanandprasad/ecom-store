/**
 * Database migration utility
 * Normalizes database structure by transforming nested arrays into individual documents
 */
import * as fs from 'fs';
import * as path from 'path';

// Use require instead of import for the database module
const db = require('./index');

/**
 * Normalize database structure - extract all nested arrays into individual documents
 */
export const normalizeDbStructure = async (collectionName: string): Promise<void> => {
  const collection = db.getCollection(collectionName);
  
  // Find all documents
  const docs = await new Promise((resolve, reject) => {
    collection.find({}, (err: Error | null, docs: any[]) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
  
  // Find any document with a nested array
  let hasNestedArrays = false;
  let itemsToAdd: any[] = [];
  let docsToRemove: string[] = [];
  
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
      collection.remove({ _id: { $in: docsToRemove } }, { multi: true }, (err: Error | null, numRemoved: number) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
    
    // Add individual items
    let insertedCount = 0;
    for (const item of itemsToAdd) {
      await new Promise((resolve, reject) => {
        collection.insert(item, (err: Error | null) => {
          if (err) {
            console.error(`Error inserting item into ${collectionName}:`, err);
            reject(err);
          } else {
            insertedCount++;
            resolve(null);
          }
        });
      });
    }
    
    console.log(`${collectionName} database structure normalized. Added ${insertedCount} items.`);
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
    try {
      await normalizeDbStructure(collection);
    } catch (error) {
      console.error(`Error normalizing collection ${collection}:`, error);
    }
  }
  
  console.log('All collections normalized.');
};

export default {
  normalizeDbStructure,
  normalizeAllCollections
}; 