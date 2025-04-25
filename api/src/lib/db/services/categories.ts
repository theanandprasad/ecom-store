/**
 * Categories service
 * Provides business logic and operations for working with categories
 */
import { getDataSource, FindOptions } from '../access';
import { getProductsByCategory } from './products';

// Category interface
export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url?: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Get all categories with optional filtering
 */
export const getAllCategories = async (
  options: {
    page?: number;
    limit?: number;
    parent_id?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}
): Promise<{ categories: Category[]; total: number; page: number; limit: number }> => {
  const { 
    page = 1, 
    limit = 10,
    parent_id,
    search,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = options;
  
  // Get categories data source
  const categoriesDb = getDataSource<Category>('categories');
  
  // Build query
  const query: Record<string, any> = {};
  
  // Add parent_id filter if provided
  if (parent_id !== undefined) {
    query.parent_id = parent_id;
  }
  
  // Add search filter if provided
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
  const categories = await categoriesDb.find(query, findOptions);
  const total = await categoriesDb.count(query);
  
  return {
    categories,
    total,
    page,
    limit
  };
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const categoriesDb = getDataSource<Category>('categories');
  return categoriesDb.findOne({ id });
};

/**
 * Get a category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const categoriesDb = getDataSource<Category>('categories');
  return categoriesDb.findOne({ slug });
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  const categoriesDb = getDataSource<Category>('categories');
  
  // Generate ID and timestamps
  const now = new Date().toISOString();
  const id = `cat_${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
  // Create the new category with all required fields
  const newCategory = {
    id,
    name: categoryData.name,
    description: categoryData.description,
    slug: categoryData.slug,
    parent_id: categoryData.parent_id || null,
    created_at: now,
    updated_at: now,
    ...categoryData // Include any additional fields from categoryData
  };
  
  return categoriesDb.create(newCategory);
};

/**
 * Update an existing category
 */
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<Category | null> => {
  const categoriesDb = getDataSource<Category>('categories');
  
  // Check if category exists
  const existingCategory = await getCategoryById(id);
  if (!existingCategory) {
    return null;
  }
  
  // Update the category
  const now = new Date().toISOString();
  const updateData = {
    ...categoryData,
    updated_at: now
  };
  
  await categoriesDb.update({ id }, { $set: updateData });
  
  // Return the updated category
  return getCategoryById(id);
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  const categoriesDb = getDataSource<Category>('categories');
  
  // Check if category exists
  const existingCategory = await getCategoryById(id);
  if (!existingCategory) {
    return false;
  }
  
  // Delete the category
  const result = await categoriesDb.delete({ id });
  return result > 0;
};

/**
 * Get product counts by category
 */
export const getProductCountsByCategory = async (): Promise<Record<string, number>> => {
  const categoriesDb = getDataSource<Category>('categories');
  const categories = await categoriesDb.find({});
  const result: Record<string, number> = {};
  
  // Get product counts for each category
  for (const category of categories) {
    const products = await getProductsByCategory(category.name);
    result[category.id] = products.length;
  }
  
  return result;
};

/**
 * Get products for a category
 */
export const getProductsForCategory = async (
  categoryId: string,
  options: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}
): Promise<{ products: any[]; total: number; page: number; limit: number }> => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    return { products: [], total: 0, page: options.page || 1, limit: options.limit || 10 };
  }
  
  // Get products by category name (maintaining compatibility with existing implementation)
  const productsDb = getDataSource('products');
  
  // Direct database access to handle the nested products array
  const allProductsDoc = await productsDb.findOne({});
  let products: any[] = [];
  
  if (allProductsDoc && allProductsDoc.products && Array.isArray(allProductsDoc.products)) {
    // Filter the products array to find matching category
    products = allProductsDoc.products.filter((product: any) => 
      product.category && product.category === category.name
    );
  } else {
    // Fall back to the standard function if needed
    products = await getProductsByCategory(category.name);
  }

  console.log(`Found ${products.length} products for category ${category.name} (${categoryId})`);
  
  // Apply pagination
  const page = options.page || 1;
  const limit = options.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  // Apply sorting if needed
  let sortedProducts = [...products];
  if (options.sort_by) {
    const sortOrder = options.sort_order === 'asc' ? 1 : -1;
    sortedProducts = sortedProducts.sort((a, b) => {
      const aValue = a[options.sort_by!];
      const bValue = b[options.sort_by!];
      if (aValue < bValue) return -1 * sortOrder;
      if (aValue > bValue) return 1 * sortOrder;
      return 0;
    });
  }
  
  // Return paginated results
  return {
    products: sortedProducts.slice(start, end),
    total: products.length,
    page,
    limit
  };
};

export default {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductCountsByCategory,
  getProductsForCategory
}; 