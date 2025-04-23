/**
 * Products service
 * Provides business logic and operations for working with products
 */
import { getDataSource, FindOptions } from '../access';

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Get all products with pagination and filtering
 */
export const getAllProducts = async (
  options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}
): Promise<{ products: Product[]; total: number; page: number; limit: number }> => {
  const { 
    page = 1, 
    limit = 10,
    category,
    search,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = options;
  
  // Get products data source
  const productsDb = getDataSource<Product>('products');
  
  // Build query
  const query: Record<string, any> = {};
  
  // Add category filter if provided
  if (category) {
    query.category = category;
  }
  
  // Add search filter if provided
  // Note: This is a simplistic approach. In a real app with NeDB,
  // you would use a more sophisticated query with $regex
  if (search) {
    // This will be replaced with a more sophisticated implementation
    // when actually using NeDB's query capabilities
  }
  
  // Build find options
  const findOptions: FindOptions = {
    skip: (page - 1) * limit,
    limit,
    sort: { [sort_by]: sort_order === 'asc' ? 1 : -1 }
  };
  
  // Execute query
  const products = await productsDb.find(query, findOptions);
  const total = await productsDb.count(query);
  
  return {
    products,
    total,
    page,
    limit
  };
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  const productsDb = getDataSource<Product>('products');
  return productsDb.findOne({ id });
};

/**
 * Create a new product
 */
export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'rating' | 'reviews_count'>): Promise<Product> => {
  const productsDb = getDataSource<Product>('products');
  
  // Generate ID and timestamps
  const now = new Date().toISOString();
  const id = `prod_${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
  // Create the new product with all required fields
  const newProduct = {
    id,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    image_url: productData.image_url,
    category: productData.category,
    stock: productData.stock,
    rating: 0,
    reviews_count: 0,
    created_at: now,
    updated_at: now,
    ...productData // Include any additional fields from productData
  };
  
  return productsDb.create(newProduct);
};

/**
 * Update a product
 */
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  const productsDb = getDataSource<Product>('products');
  
  // Don't allow updating these fields
  const { id: _, created_at, ...allowedUpdates } = updates;
  
  // Add updated timestamp
  const updateData = {
    ...allowedUpdates,
    updated_at: new Date().toISOString()
  };
  
  // Update product
  const numUpdated = await productsDb.update(
    { id }, 
    { $set: updateData }
  );
  
  if (numUpdated === 0) {
    return null;
  }
  
  // Return updated product
  return productsDb.findOne({ id });
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  const productsDb = getDataSource<Product>('products');
  const numDeleted = await productsDb.delete({ id });
  return numDeleted > 0;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const productsDb = getDataSource<Product>('products');
  return productsDb.find({ category });
};

/**
 * Reset products data to initial state
 */
export const resetProductsData = async (): Promise<void> => {
  const productsDb = getDataSource<Product>('products');
  await productsDb.reset();
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  resetProductsData
}; 