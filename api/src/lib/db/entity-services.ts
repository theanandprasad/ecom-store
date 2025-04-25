/**
 * Entity Database Services
 * 
 * This file provides database access services for all entity types.
 * It uses the getDataSource utility to automatically handle the data source
 * based on configuration.
 */
import { getDataSource, FindOptions, SortOptions } from './access';

// Define collection types
export type CollectionName = 
  | 'products' 
  | 'customers' 
  | 'orders' 
  | 'carts' 
  | 'wishlists' 
  | 'reviews' 
  | 'support_tickets' 
  | 'faq' 
  | 'promotions' 
  | 'returns' 
  | 'notifications'
  | 'payments'
  | 'categories';

// Define pagination result interface
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Generic functions to create consistent interfaces for all entity types
 */

// Generic get by ID function
export function createGetByIdFunction<T>(collection: CollectionName) {
  return async (id: string): Promise<T | null> => {
    const dataSource = getDataSource<T>(collection);
    return dataSource.findOne({ id });
  };
}

// Generic get all function
export function createGetAllFunction<T>(collection: CollectionName) {
  return async (options: any = {}): Promise<PaginatedResult<T>> => {
    const dataSource = getDataSource<T>(collection);
    
    const {
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc',
      ...filters
    } = options;
    
    // Build query from filters
    const query: Record<string, any> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });
    
    // Build find options
    const findOptions: FindOptions = {
      skip: (page - 1) * limit,
      limit,
      sort: { [sort_by]: sort_order === 'asc' ? 1 : -1 } as SortOptions
    };
    
    // Execute query
    const items = await dataSource.find(query, findOptions);
    const total = await dataSource.count(query);
    
    // Build response
    return {
      items,
      total,
      page,
      limit
    };
  };
}

// Generic create function
export function createCreateFunction<T>(collection: CollectionName) {
  return async (data: Partial<T>): Promise<T> => {
    const dataSource = getDataSource<T>(collection);
    
    // Generate ID and timestamps
    const now = new Date().toISOString();
    const prefix = collection.slice(0, 4);
    const id = `${prefix}_${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Create the new entity
    const newEntity = {
      id,
      created_at: now,
      updated_at: now,
      ...data
    };
    
    return dataSource.create(newEntity as any);
  };
}

// Generic update function
export function createUpdateFunction<T>(collection: CollectionName) {
  return async (id: string, updates: Partial<T>): Promise<T | null> => {
    const dataSource = getDataSource<T>(collection);
    
    // Don't allow updating these fields
    const { id: _, created_at, ...allowedUpdates } = updates as any;
    
    // Add updated timestamp
    const updateData = {
      ...allowedUpdates,
      updated_at: new Date().toISOString()
    };
    
    // Update entity
    const numUpdated = await dataSource.update(
      { id },
      { $set: updateData }
    );
    
    if (numUpdated === 0) {
      return null;
    }
    
    // Return updated entity
    return dataSource.findOne({ id });
  };
}

// Generic delete function
export function createDeleteFunction(collection: CollectionName) {
  return async (id: string): Promise<boolean> => {
    const dataSource = getDataSource(collection);
    const numDeleted = await dataSource.delete({ id });
    return numDeleted > 0;
  };
}

// Services interface
export interface EntityService<T> {
  getById: (id: string) => Promise<T | null>;
  getAll: (options?: any) => Promise<PaginatedResult<T>>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, updates: Partial<T>) => Promise<T | null>;
  delete: (id: string) => Promise<boolean>;
}

// Generate services for all entity types
function generateEntityServices<T>(collection: CollectionName): EntityService<T> {
  return {
    getById: createGetByIdFunction<T>(collection),
    getAll: createGetAllFunction<T>(collection),
    create: createCreateFunction<T>(collection),
    update: createUpdateFunction<T>(collection),
    delete: createDeleteFunction(collection)
  };
}

// Create services for each entity type
export const customerService = generateEntityServices<any>('customers');
export const orderService = generateEntityServices<any>('orders');
export const cartService = generateEntityServices<any>('carts');
export const wishlistService = generateEntityServices<any>('wishlists');
export const reviewService = generateEntityServices<any>('reviews');
export const supportTicketService = generateEntityServices<any>('support_tickets');
export const faqService = generateEntityServices<any>('faq');
export const promotionService = generateEntityServices<any>('promotions');
export const returnService = generateEntityServices<any>('returns');
export const notificationService = generateEntityServices<any>('notifications');
export const paymentService = generateEntityServices<any>('payments');
export const categoryService = generateEntityServices<any>('categories');

// For new collections, you can add them as needed:
// export const newEntityService = generateEntityServices<any>('new_entity');

export default {
  customerService,
  orderService,
  cartService,
  wishlistService,
  reviewService,
  supportTicketService,
  faqService,
  promotionService,
  returnService,
  notificationService,
  paymentService,
  categoryService
}; 