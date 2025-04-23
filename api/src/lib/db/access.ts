/**
 * Data access layer
 * Provides a unified interface for accessing data from either NeDB or static JSON files
 * Implements the data source switch functionality
 */
import * as fs from 'fs';
import * as path from 'path';
import { useNeDb } from '../config';
import { CollectionName, getCollection, initializeCollectionIfEmpty } from './index';

// Basic query type
export type Query = Record<string, any>;

// Sort options
export type SortOptions = Record<string, 1 | -1>;

// Find options
export interface FindOptions {
  sort?: SortOptions;
  skip?: number;
  limit?: number;
  projection?: Record<string, 0 | 1>;
}

// Update options
export interface UpdateOptions {
  multi?: boolean;
  upsert?: boolean;
  returnUpdatedDocs?: boolean;
}

// Delete options
export interface DeleteOptions {
  multi?: boolean;
}

/**
 * Data source interface - defines operations available on both data sources
 */
export interface DataSource<T = any> {
  findOne: (query: Query) => Promise<T | null>;
  find: (query?: Query, options?: FindOptions) => Promise<T[]>;
  count: (query?: Query) => Promise<number>;
  create: (doc: Partial<T>) => Promise<T>;
  update: (query: Query, update: any, options?: UpdateOptions) => Promise<number>;
  delete: (query: Query, options?: DeleteOptions) => Promise<number>;
  reset: () => Promise<void>;
}

/**
 * Get data source for a collection
 * @param collectionName Collection name
 * @returns DataSource instance
 */
export const getDataSource = <T = any>(collectionName: CollectionName): DataSource<T> => {
  // Check if we should use NeDB
  if (useNeDb()) {
    return new NeDBDataSource<T>(collectionName);
  }
  
  // Otherwise use static JSON
  return new StaticJsonDataSource<T>(collectionName);
};

/**
 * NeDB implementation of DataSource
 */
class NeDBDataSource<T = any> implements DataSource<T> {
  private collectionName: CollectionName;
  
  constructor(collectionName: CollectionName) {
    this.collectionName = collectionName;
  }
  
  /**
   * Initialize the collection and return it
   * @returns NeDB collection
   */
  private async getDb() {
    return await initializeCollectionIfEmpty(this.collectionName);
  }
  
  /**
   * Find a single document
   * @param query Query object
   * @returns Matching document or null
   */
  async findOne(query: Query): Promise<T | null> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      db.findOne(query, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (doc) {
          resolve(doc as T);
          return;
        }
        
        // If not found, try to search in nested arrays
        db.find({}, (nestedErr, allDocs) => {
          if (nestedErr) {
            reject(nestedErr);
            return;
          }
          
          // Look for the document in nested arrays
          for (const doc of allDocs) {
            if (doc[this.collectionName] && Array.isArray(doc[this.collectionName])) {
              const found = doc[this.collectionName].find((item: any) => {
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
      });
    });
  }
  
  /**
   * Find multiple documents
   * @param query Query object
   * @param options Find options
   * @returns Array of matching documents
   */
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
      
      if (options.projection) {
        cursor = cursor.projection(options.projection);
      }
      
      // Execute the query
      cursor.exec((err, docs) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Process results to handle nested arrays
        let results: T[] = [];
        
        // Process standard documents
        for (const doc of docs) {
          // Check if document is a wrapper with nested array
          if (doc[this.collectionName] && Array.isArray(doc[this.collectionName])) {
            // Process nested array - filter by query if needed
            const nestedItems = this.filterNestedArray(doc[this.collectionName], query);
            results.push(...nestedItems);
          } else {
            // It's a normal document
            results.push(doc as T);
          }
        }
        
        // Apply client-side sorting and pagination if we have nested results
        if (results.length > 0 && options) {
          // Sort if needed
          if (options.sort) {
            results = this.sortResults(results, options.sort);
          }
          
          // Apply skip/limit if needed
          if (typeof options.skip === 'number') {
            results = results.slice(options.skip);
          }
          
          if (typeof options.limit === 'number') {
            results = results.slice(0, options.limit);
          }
        }
        
        resolve(results);
      });
    });
  }
  
  /**
   * Sort results array
   * @param results Array to sort
   * @param sort Sort options
   * @returns Sorted array
   */
  private sortResults(results: T[], sort: SortOptions): T[] {
    return [...results].sort((a, b) => {
      for (const [field, order] of Object.entries(sort)) {
        const aValue = this.getNestedValue(a, field);
        const bValue = this.getNestedValue(b, field);
        
        if (aValue < bValue) return -1 * order;
        if (aValue > bValue) return 1 * order;
      }
      return 0;
    });
  }
  
  /**
   * Get a nested value from an object using dot notation
   * @param obj Object to get value from
   * @param path Path to value using dot notation
   * @returns Value at path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, key) => curr && curr[key], obj);
  }
  
  /**
   * Filter a nested array based on query
   * @param items Array to filter
   * @param query Query to match
   * @returns Filtered array
   */
  private filterNestedArray(items: any[], query: Query): T[] {
    if (Object.keys(query).length === 0) {
      return items as T[];
    }
    
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    }) as T[];
  }
  
  /**
   * Count documents
   * @param query Query object
   * @returns Count of matching documents
   */
  async count(query: Query = {}): Promise<number> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      db.count(query, (err, count) => {
        if (err) {
          reject(err);
          return;
        }
        
        // If we have results, return them
        if (count > 0) {
          resolve(count);
          return;
        }
        
        // If not found, try to search in nested arrays
        db.find({}, (nestedErr, allDocs) => {
          if (nestedErr) {
            reject(nestedErr);
            return;
          }
          
          let nestedCount = 0;
          
          // Look for items in nested arrays
          for (const doc of allDocs) {
            if (doc[this.collectionName] && Array.isArray(doc[this.collectionName])) {
              const nestedItems = this.filterNestedArray(doc[this.collectionName], query);
              nestedCount += nestedItems.length;
            }
          }
          
          resolve(count + nestedCount);
        });
      });
    });
  }
  
  /**
   * Create a new document
   * @param doc Document to create
   * @returns Created document
   */
  async create(doc: Partial<T>): Promise<T> {
    const db = await this.getDb();
    
    return new Promise((resolve, reject) => {
      db.insert(doc as any, (err, newDoc) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(newDoc as T);
      });
    });
  }
  
  /**
   * Update documents
   * @param query Query to match documents
   * @param update Update to apply
   * @param options Update options
   * @returns Number of documents updated
   */
  async update(query: Query, update: any, options: UpdateOptions = {}): Promise<number> {
    const db = await this.getDb();
    let totalUpdated = 0;
    
    // First, update regular documents
    const regularUpdated = await new Promise<number>((resolve, reject) => {
      db.update(query, update, options, (err, numAffected) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(numAffected);
      });
    });
    
    totalUpdated += regularUpdated;
    
    // If no options.multi is false and we updated something, we're done
    if (options.multi === false && regularUpdated > 0) {
      return totalUpdated;
    }
    
    // Check for documents in nested arrays
    const allDocs = await new Promise<any[]>((resolve, reject) => {
      db.find({}, (err, docs) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(docs);
      });
    });
    
    // Look for items in nested arrays that match the query
    for (const doc of allDocs) {
      if (doc[this.collectionName] && Array.isArray(doc[this.collectionName])) {
        let updated = false;
        
        // Update items that match the query
        for (let i = 0; i < doc[this.collectionName].length; i++) {
          const item = doc[this.collectionName][i];
          
          if (Object.keys(query).every(key => item[key] === query[key])) {
            // Apply update
            if (update.$set) {
              Object.assign(doc[this.collectionName][i], update.$set);
            }
            
            // Handle other update operators as needed
            
            updated = true;
            totalUpdated++;
            
            // If not updating multiple, break after first match
            if (options.multi === false) {
              break;
            }
          }
        }
        
        // If we updated an item in the array, save the parent document
        if (updated) {
          await new Promise<void>((resolve, reject) => {
            db.update({ _id: doc._id }, doc, {}, (err) => {
              if (err) {
                reject(err);
                return;
              }
              
              resolve();
            });
          });
          
          // If not updating multiple and we updated something, we're done
          if (options.multi === false) {
            break;
          }
        }
      }
    }
    
    return totalUpdated;
  }
  
  /**
   * Delete documents
   * @param query Query to match documents
   * @param options Delete options
   * @returns Number of documents deleted
   */
  async delete(query: Query, options: DeleteOptions = {}): Promise<number> {
    const db = await this.getDb();
    let totalDeleted = 0;
    
    // First, delete regular documents
    const regularDeleted = await new Promise<number>((resolve, reject) => {
      db.remove(query, options, (err, numRemoved) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(numRemoved);
      });
    });
    
    totalDeleted += regularDeleted;
    
    // If no options.multi is false and we deleted something, we're done
    if (options.multi === false && regularDeleted > 0) {
      return totalDeleted;
    }
    
    // Check for documents in nested arrays
    const allDocs = await new Promise<any[]>((resolve, reject) => {
      db.find({}, (err, docs) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(docs);
      });
    });
    
    // Look for items in nested arrays that match the query
    for (const doc of allDocs) {
      if (doc[this.collectionName] && Array.isArray(doc[this.collectionName])) {
        const initialLength = doc[this.collectionName].length;
        
        // Remove items that match the query
        doc[this.collectionName] = doc[this.collectionName].filter((item: any) => {
          return !Object.keys(query).every(key => item[key] === query[key]);
        });
        
        const numRemovedFromArray = initialLength - doc[this.collectionName].length;
        
        // If we removed items from the array, save the parent document
        if (numRemovedFromArray > 0) {
          await new Promise<void>((resolve, reject) => {
            db.update({ _id: doc._id }, doc, {}, (err) => {
              if (err) {
                reject(err);
                return;
              }
              
              resolve();
            });
          });
          
          totalDeleted += numRemovedFromArray;
          
          // If not deleting multiple and we deleted something, we're done
          if (options.multi === false) {
            break;
          }
        }
      }
    }
    
    return totalDeleted;
  }
  
  /**
   * Reset the collection to its initial state from JSON
   */
  async reset(): Promise<void> {
    const db = await this.getDb();
    const { initializeFromJson } = require('./setup');
    await initializeFromJson(db, this.collectionName);
  }
}

// Type for document with fields as any
type AnyFieldsDocument = Record<string, any>;

/**
 * Static JSON implementation of DataSource
 */
class StaticJsonDataSource<T = any> implements DataSource<T> {
  private collectionName: CollectionName;
  private cachedData: AnyFieldsDocument[] | null = null;
  
  constructor(collectionName: CollectionName) {
    this.collectionName = collectionName;
  }
  
  /**
   * Load data from JSON file
   * @returns Array of objects from JSON
   */
  private loadData(): AnyFieldsDocument[] {
    // Use cached data if available
    if (this.cachedData) {
      return this.cachedData;
    }
    
    try {
      const jsonPath = path.join(process.cwd(), 'mock-data', `${this.collectionName}.json`);
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      let data = JSON.parse(rawData) as AnyFieldsDocument | AnyFieldsDocument[];
      
      // Handle both array and nested array formats
      let dataArray: AnyFieldsDocument[];
      if (Array.isArray(data)) {
        dataArray = data;
      } else if (data[this.collectionName] && Array.isArray(data[this.collectionName])) {
        dataArray = data[this.collectionName];
      } else {
        dataArray = [data];
      }
      
      // Cache the data
      this.cachedData = dataArray;
      
      return dataArray;
    } catch (error) {
      console.error(`Error loading JSON data for ${this.collectionName}:`, error);
      return [];
    }
  }
  
  /**
   * Find a single document
   * @param query Query object
   * @returns Matching document or null
   */
  async findOne(query: Query): Promise<T | null> {
    const data = this.loadData();
    
    // Simple query implementation for static JSON
    const result = data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
    
    return result as T || null;
  }
  
  /**
   * Find multiple documents
   * @param query Query object
   * @param options Find options
   * @returns Array of matching documents
   */
  async find(query: Query = {}, options: FindOptions = {}): Promise<T[]> {
    const data = this.loadData();
    
    // Filter data based on query
    let result = Object.keys(query).length === 0 
      ? [...data] 
      : data.filter(item => {
          return Object.keys(query).every(key => item[key] === query[key]);
        });
    
    // Apply sort
    if (options.sort) {
      result = this.applySorting(result, options.sort);
    }
    
    // Apply pagination
    if (typeof options.skip === 'number') {
      result = result.slice(options.skip);
    }
    
    if (typeof options.limit === 'number') {
      result = result.slice(0, options.limit);
    }
    
    // Apply projection
    if (options.projection) {
      result = this.applyProjection(result, options.projection);
    }
    
    return result as T[];
  }
  
  /**
   * Apply sorting to results
   * @param data Data array
   * @param sort Sort options
   * @returns Sorted array
   */
  private applySorting(data: AnyFieldsDocument[], sort: SortOptions): AnyFieldsDocument[] {
    return [...data].sort((a, b) => {
      for (const [field, order] of Object.entries(sort)) {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
      }
      return 0;
    });
  }
  
  /**
   * Apply projection to results
   * @param data Data array
   * @param projection Projection options
   * @returns Projected array
   */
  private applyProjection(data: AnyFieldsDocument[], projection: Record<string, 0 | 1>): AnyFieldsDocument[] {
    const includeMode = Object.values(projection).includes(1);
    
    return data.map(item => {
      const result: Record<string, any> = {};
      
      if (includeMode) {
        // Include only specified fields
        Object.keys(projection).forEach(field => {
          if (projection[field] === 1) {
            result[field] = item[field];
          }
        });
      } else {
        // Include all except specified fields
        Object.keys(item).forEach(field => {
          if (projection[field] !== 0) {
            result[field] = item[field];
          }
        });
      }
      
      return result;
    });
  }
  
  /**
   * Count documents
   * @param query Query object
   * @returns Count of matching documents
   */
  async count(query: Query = {}): Promise<number> {
    const data = this.loadData();
    
    // Count matching documents
    if (Object.keys(query).length === 0) {
      return data.length;
    }
    
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    }).length;
  }
  
  /**
   * Create a new document - not supported in static JSON mode
   */
  async create(): Promise<T> {
    throw new Error('Cannot write to static JSON files');
  }
  
  /**
   * Update documents - not supported in static JSON mode
   */
  async update(): Promise<number> {
    throw new Error('Cannot write to static JSON files');
  }
  
  /**
   * Delete documents - not supported in static JSON mode
   */
  async delete(): Promise<number> {
    throw new Error('Cannot write to static JSON files');
  }
  
  /**
   * Reset the collection - not needed in static JSON mode
   */
  async reset(): Promise<void> {
    // Clear the cache to force reload of data
    this.cachedData = null;
  }
}

export default {
  getDataSource
}; 