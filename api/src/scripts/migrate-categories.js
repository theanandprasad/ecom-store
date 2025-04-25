/**
 * Migration script to populate the categories database from existing product data
 * This script extracts unique category names from products and creates category records
 */
const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

// Setup paths
const MOCK_DATA_DIR = path.join(process.cwd(), 'mock-data');
const DB_DIR = path.join(process.cwd(), 'db');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create/load databases
const productsDb = new Datastore({ 
  filename: path.join(DB_DIR, 'products.db'),
  autoload: true 
});

const categoriesDb = new Datastore({ 
  filename: path.join(DB_DIR, 'categories.db'),
  autoload: true 
});

// Set up indexes
categoriesDb.ensureIndex({ fieldName: 'id', unique: true });
categoriesDb.ensureIndex({ fieldName: 'slug', unique: true });
categoriesDb.ensureIndex({ fieldName: 'parent_id' });

/**
 * Read products data from the products JSON file (if needed)
 */
async function readProductsData() {
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
 * Get products from the database
 */
function getProductsFromDb() {
  return new Promise((resolve, reject) => {
    productsDb.find({}, (err, docs) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(docs || []);
    });
  });
}

/**
 * Create categories from unique product categories
 */
async function createCategoriesFromProducts() {
  try {
    // Get products from DB or fallback to JSON file
    let products = [];
    try {
      products = await getProductsFromDb();
      console.log(`Found ${products.length} products in database`);
      if (products.length === 0) {
        // Fallback to JSON file
        products = await readProductsData();
        console.log(`Found ${products.length} products in JSON file`);
      }
    } catch (error) {
      console.error('Error reading products from database:', error);
      // Fallback to JSON file
      products = await readProductsData();
      console.log(`Found ${products.length} products in JSON file`);
    }
    
    // Extract unique categories
    const uniqueCategories = new Set();
    
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    
    console.log(`Found ${uniqueCategories.size} unique categories`);
    
    // Create categories for each unique category name
    const categories = [];
    const now = new Date().toISOString();
    
    // Convert Set to Array before iterating
    const categoryNamesArray = Array.from(uniqueCategories);
    
    let index = 1;
    for (const categoryName of categoryNamesArray) {
      // Generate slug from category name
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
      
      // Create category object
      const category = {
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
    
    // Clear existing categories
    return new Promise((resolve, reject) => {
      categoriesDb.remove({}, { multi: true }, async (err) => {
        if (err) {
          console.error('Error clearing categories:', err);
          reject(err);
          return;
        }
        
        // Insert categories one by one
        for (const category of categories) {
          await new Promise((resolveInsert, rejectInsert) => {
            categoriesDb.insert(category, (insertErr, newDoc) => {
              if (insertErr) {
                console.error(`Error creating category ${category.name}:`, insertErr);
                rejectInsert(insertErr);
                return;
              }
              console.log(`Created category: ${category.name} (${category.id})`);
              resolveInsert(newDoc);
            });
          });
        }
        
        console.log(`Migration complete. Created ${categories.length} categories.`);
        resolve(categories);
      });
    });
  } catch (error) {
    console.error('Error migrating categories:', error);
    throw error;
  }
}

// Run the migration
createCategoriesFromProducts()
  .then(() => {
    console.log('Categories migration completed successfully');
  })
  .catch(error => {
    console.error('Categories migration failed:', error);
  }); 