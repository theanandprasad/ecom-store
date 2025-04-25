const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

// Load the mock data
const productsJsonPath = path.join(process.cwd(), 'mock-data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
console.log('Products data loaded:', productsData.products.length, 'products');

// Print book products
const bookProducts = productsData.products.filter(p => p.category === 'Books');
console.log('Book products found:', bookProducts.length);
console.log('Book product names:', bookProducts.map(p => p.name).join(', '));

// Initialize the database
const dbPath = path.join(process.cwd(), 'db', 'products.db');
const productsDb = new Datastore({ filename: dbPath, autoload: true });

// Clear the database
productsDb.remove({}, { multi: true }, (err) => {
  if (err) {
    console.error('Error clearing products:', err);
    return;
  }
  console.log('Cleared existing products');
  
  // Insert each product
  let insertedCount = 0;
  const insertNext = (index) => {
    if (index >= productsData.products.length) {
      console.log('Finished inserting products. Total inserted:', insertedCount);
      
      // Set up indexes
      productsDb.ensureIndex({ fieldName: 'id', unique: true }, (err) => {
        if (err) console.error('Error creating id index:', err);
        else console.log('Created id index');
        
        productsDb.ensureIndex({ fieldName: 'category' }, (err) => {
          if (err) console.error('Error creating category index:', err);
          else console.log('Created category index');
        });
      });
      
      return;
    }
    
    const product = productsData.products[index];
    console.log('Inserting product:', product.name, '(Category:', product.category, ')');
    
    productsDb.insert(product, (err) => {
      if (err) {
        console.error('Error inserting product:', err);
      } else {
        insertedCount++;
        console.log('Inserted product:', product.name);
      }
      insertNext(index + 1);
    });
  };
  
  insertNext(0);
}); 