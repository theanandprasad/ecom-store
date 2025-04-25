const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

// Load the mock data
const categoriesJsonPath = path.join(process.cwd(), 'mock-data', 'categories.json');
const categoriesData = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf8'));
console.log('Categories data loaded:', categoriesData.categories.length, 'categories');
console.log('Category names:', categoriesData.categories.map(c => c.name).join(', '));

// Initialize the database
const dbPath = path.join(process.cwd(), 'db', 'categories.db');
const categoriesDb = new Datastore({ filename: dbPath, autoload: true });

// Clear the database
categoriesDb.remove({}, { multi: true }, (err) => {
  if (err) {
    console.error('Error clearing categories:', err);
    return;
  }
  console.log('Cleared existing categories');
  
  // Insert each category
  let insertedCount = 0;
  const insertNext = (index) => {
    if (index >= categoriesData.categories.length) {
      console.log('Finished inserting categories. Total inserted:', insertedCount);
      return;
    }
    
    const category = categoriesData.categories[index];
    console.log('Inserting category:', category.name);
    
    categoriesDb.insert(category, (err) => {
      if (err) {
        console.error('Error inserting category:', err);
      } else {
        insertedCount++;
        console.log('Inserted category:', category.name);
      }
      insertNext(index + 1);
    });
  };
  
  insertNext(0);
}); 