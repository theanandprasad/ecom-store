/**
 * Migration script to populate the categories database from existing product data
 * This script extracts unique category names from products and creates category records
 */
const fs = require('fs');
const path = require('path');
const { getDataSource } = require('../lib/db/access');

// Category interface (duplicated here to avoid import issues)
interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image_url?: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface Product {
  id: string;
  name: string;
  category: string;
  [key: string]: any;
}

const MOCK_DATA_DIR = path.join(process.cwd(), 'mock-data');

/**
 * Read products data from the products JSON file
 */
async function readProductsData(): Promise<Product[]> {
  try {
    const filePath = path.join(MOCK_DATA_DIR, 'products.json');
    console.log(`Reading products data from: ${filePath}`);
    
    const fileData = await fs.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileData);
    return data.products || [];
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
}

/**
 * Create categories from unique product categories
 */
async function createCategoriesFromProducts() {
  try {
    // Get products data
    const products = await readProductsData();
    console.log(`Found ${products.length} products`);
    
    // Extract unique categories
    const uniqueCategories = new Set<string>();
    
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    
    console.log(`Found ${uniqueCategories.size} unique categories`);
    
    // Get categories data source
    const categoriesDb = getDataSource<Category>('categories');
    
    // Create categories for each unique category name
    const categories: Category[] = [];
    const now = new Date().toISOString();
    
    // Convert Set to Array before iterating
    const categoryNamesArray = Array.from(uniqueCategories);
    
    let index = 1;
    for (const categoryName of categoryNamesArray) {
      // Generate slug from category name
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
      
      // Create category object
      const category: Category = {
        id: `cat_${index.toString().padStart(3, '0')}`,
        name: categoryName,
        description: `${categoryName} products`,
        slug,
        image_url: `https://example.com/images/categories/${slug}.jpg`,
        parent_id: null,
        created_at: now,
        updated_at: now
      };
      
      categories.push(category);
      index++;
    }
    
    // Clear existing categories and insert new ones
    await categoriesDb.delete({}, { multi: true });
    
    // Insert categories
    for (const category of categories) {
      await categoriesDb.create(category);
      console.log(`Created category: ${category.name} (${category.id})`);
    }
    
    console.log(`Migration complete. Created ${categories.length} categories.`);
  } catch (error) {
    console.error('Error migrating categories:', error);
  }
}

// Run the migration
createCategoriesFromProducts().then(() => {
  console.log('Categories migration completed');
}); 