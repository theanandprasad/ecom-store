const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

// Load the mock data
const reviewsJsonPath = path.join(process.cwd(), 'mock-data', 'reviews.json');
const reviewsData = JSON.parse(fs.readFileSync(reviewsJsonPath, 'utf8'));
console.log('Reviews data loaded:', reviewsData.reviews.length, 'reviews');

// Print book reviews
const bookProductIds = ['prod_006', 'prod_007'];
const bookReviews = reviewsData.reviews.filter(r => bookProductIds.includes(r.product_id));
console.log('Book reviews found:', bookReviews.length);
console.log('Book review titles:', bookReviews.map(r => r.title).join(', '));

// Initialize the database
const dbPath = path.join(process.cwd(), 'db', 'reviews.db');
const reviewsDb = new Datastore({ filename: dbPath, autoload: true });

// Clear the database
reviewsDb.remove({}, { multi: true }, (err) => {
  if (err) {
    console.error('Error clearing reviews:', err);
    return;
  }
  console.log('Cleared existing reviews');
  
  // Insert each review
  let insertedCount = 0;
  const insertNext = (index) => {
    if (index >= reviewsData.reviews.length) {
      console.log('Finished inserting reviews. Total inserted:', insertedCount);
      
      // Set up indexes
      reviewsDb.ensureIndex({ fieldName: 'id', unique: true }, (err) => {
        if (err) console.error('Error creating id index:', err);
        else console.log('Created id index');
        
        reviewsDb.ensureIndex({ fieldName: 'product_id' }, (err) => {
          if (err) console.error('Error creating product_id index:', err);
          else console.log('Created product_id index');
          
          reviewsDb.ensureIndex({ fieldName: 'customer_id' }, (err) => {
            if (err) console.error('Error creating customer_id index:', err);
            else console.log('Created customer_id index');
          });
        });
      });
      
      return;
    }
    
    const review = reviewsData.reviews[index];
    console.log('Inserting review:', review.title, '(Product ID:', review.product_id, ')');
    
    reviewsDb.insert(review, (err) => {
      if (err) {
        console.error('Error inserting review:', err);
      } else {
        insertedCount++;
        console.log('Inserted review:', review.title);
      }
      insertNext(index + 1);
    });
  };
  
  insertNext(0);
}); 