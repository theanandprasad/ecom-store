/**
 * Data access layer
 * Provides a unified interface for accessing data from either NeDB or static JSON files
 * Implements the data source switch functionality
 */
const fs = require('fs');
const path = require('path');
const config = require('../config');
const db = require('./setup');

/**
 * Get data source for a collection
 * @param {string} collectionName Collection name
 * @returns {Object} Data source with CRUD methods
 */
const getDataSource = (collectionName) => {
  // Check if we should use NeDB
  if (config.useNeDb()) {
    return new NeDBDataSource(collectionName);
  }
  
  // Otherwise use static JSON
  return new StaticJsonDataSource(collectionName);
};

/**
 * NeDB implementation of DataSource
 */
class NeDBDataSource {
  /**
   * @param {string} collectionName 
   */
  constructor(collectionName) {
    this.collectionName = collectionName;
  }
  
  /**
   * Initialize the collection and return it
   * @returns {Promise<Object>} NeDB collection
   */
  async getDb() {
    return await db.initializeCollectionIfEmpty(this.collectionName);
  }
  
  /**
   * Find a single document
   * @param {Object} query Query object
   * @returns {Promise<Object|null>} Matching document or null
   */
  async findOne(query) {
    const collection = await this.getDb();
    
    return new Promise((resolve, reject) => {
      collection.findOne(query, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(doc || null);
      });
    });
  }
  
  /**
   * Find multiple documents
   * @param {Object} query Query object
   * @param {Object} options Find options
   * @returns {Promise<Array>} Array of matching documents
   */
  async find(query = {}, options = {}) {
    const collection = await this.getDb();
    
    return new Promise((resolve, reject) => {
      let cursor = collection.find(query);
      
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
        
        resolve(docs);
      });
    });
  }
  
  /**
   * Count documents
   * @param {Object} query Query object
   * @returns {Promise<number>} Count of matching documents
   */
  async count(query = {}) {
    const collection = await this.getDb();
    
    return new Promise((resolve, reject) => {
      collection.count(query, (err, count) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(count);
      });
    });
  }
  
  /**
   * Create a new document
   * @param {Object} doc Document to create
   * @returns {Promise<Object>} Created document
   */
  async create(doc) {
    const collection = await this.getDb();
    
    return new Promise((resolve, reject) => {
      collection.insert(doc, (err, newDoc) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(newDoc);
      });
    });
  }
  
  /**
   * Update documents
   * @param {Object} query Query to match documents
   * @param {Object} update Update to apply
   * @param {Object} options Update options
   * @returns {Promise<number>} Number of documents updated
   */
  async update(query, update, options = {}) {
    const collection = await this.getDb();
    
    return new Promise((resolve, reject) => {
      collection.update(query, update, options, (err, numAffected) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(numAffected);
      });
    });
  }
  
  /**
   * Delete documents
   * @param {Object} query Query to match documents
   * @param {Object} options Delete options
   * @returns {Promise<number>} Number of documents deleted
   */
  async delete(query, options = {}) {
    const collection = await this.getDb();
    
    return new Promise((resolve, reject) => {
      collection.remove(query, options, (err, numRemoved) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(numRemoved);
      });
    });
  }
  
  /**
   * Reset the collection to its initial state from JSON
   */
  async reset() {
    const collection = await this.getDb();
    await db.initializeFromJson(collection, this.collectionName);
  }
}

/**
 * Static JSON implementation of DataSource
 */
class StaticJsonDataSource {
  /**
   * @param {string} collectionName 
   */
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.cachedData = null;
  }
  
  /**
   * Load data from JSON file
   * @returns {Array} Array of objects from JSON
   */
  loadData() {
    // Use cached data if available
    if (this.cachedData) {
      return this.cachedData;
    }
    
    try {
      const jsonPath = path.join(process.cwd(), 'mock-data', `${this.collectionName}.json`);
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      // Cache the data
      this.cachedData = data;
      
      return data;
    } catch (error) {
      console.error(`Error loading JSON data for ${this.collectionName}:`, error);
      return [];
    }
  }
  
  /**
   * Find a single document
   * @param {Object} query Query object
   * @returns {Promise<Object|null>} Matching document or null
   */
  async findOne(query) {
    const data = this.loadData();
    
    // Simple query implementation for static JSON
    const result = data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
    
    return result || null;
  }
  
  /**
   * Find multiple documents
   * @param {Object} query Query object
   * @param {Object} options Find options
   * @returns {Promise<Array>} Array of matching documents
   */
  async find(query = {}, options = {}) {
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
    
    return result;
  }
  
  /**
   * Apply sorting to results
   * @param {Array} data Data array
   * @param {Object} sort Sort options
   * @returns {Array} Sorted array
   */
  applySorting(data, sort) {
    return [...data].sort((a, b) => {
      for (const [field, order] of Object.entries(sort)) {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
      }
      return 0;
    });
  }
  
  /**
   * Count documents
   * @param {Object} query Query object
   * @returns {Promise<number>} Count of matching documents
   */
  async count(query = {}) {
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
  async create() {
    throw new Error('Cannot write to static JSON files');
  }
  
  /**
   * Update documents - not supported in static JSON mode
   */
  async update() {
    throw new Error('Cannot write to static JSON files');
  }
  
  /**
   * Delete documents - not supported in static JSON mode
   */
  async delete() {
    throw new Error('Cannot write to static JSON files');
  }
  
  /**
   * Reset the collection - not needed in static JSON mode
   */
  async reset() {
    // Clear the cache to force reload of data
    this.cachedData = null;
  }
}

module.exports = {
  getDataSource
}; 