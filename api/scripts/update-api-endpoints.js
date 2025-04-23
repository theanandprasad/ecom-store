#!/usr/bin/env node

/**
 * API Endpoint Migration Script
 * 
 * This script updates all API endpoints listed in the supported-use-cases.md and authentication.md
 * documents to ensure they consistently use the unified data service for database access.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Base directories
const API_DIR = path.join(__dirname, '..', 'src', 'app', 'api');
const TEMPLATE_PATH = path.join(__dirname, 'unified-service-template.txt');

// List of all endpoints from documentation
const ENDPOINTS_TO_UPDATE = [
  // Customer endpoints
  'customers/[customerId]/route.ts',
  'customers/route.ts',
  'customers/[customerId]/addresses/route.ts',
  'customers/[customerId]/addresses/[addressId]/route.ts',
  'customers/[customerId]/cart/route.ts',
  'customers/[customerId]/loyalty/route.ts',
  'customers/[customerId]/notifications/route.ts',
  'customers/[customerId]/orders/route.ts',
  'customers/[customerId]/returns/route.ts',
  'customers/[customerId]/reviews/route.ts',
  'customers/[customerId]/support-tickets/route.ts',
  'customers/[customerId]/wishlist/route.ts',
  
  // Order endpoints
  'orders/route.ts',
  'orders/[orderId]/route.ts',
  
  // Product endpoints
  'products/route.ts',
  'products/[productId]/route.ts',
  'products/[productId]/reviews/route.ts',
  'search/products/route.ts',
  
  // Cart endpoints
  'carts/route.ts',
  'carts/[cartId]/route.ts',
  'carts/[cartId]/items/route.ts',
  
  // Wishlist endpoints
  'wishlists/route.ts',
  'wishlists/[wishlistId]/route.ts',
  'wishlists/[wishlistId]/items/route.ts',
  
  // Return endpoints
  'returns/route.ts',
  
  // Support endpoints
  'support/tickets/route.ts',
  'support/tickets/[ticketId]/route.ts',
  
  // FAQ endpoints
  'faq/route.ts',
  'faq/lookup/route.ts',
  
  // Promotion endpoints
  'promotions/route.ts',
  'promotions/[promotionId]/route.ts',
  
  // Auth endpoints
  'auth/send-otp/route.ts',
  'auth/verify-otp/route.ts',
  'auth/login/route.ts',
  'auth/password-reset/route.ts',
  
  // Checkout endpoints
  'checkout/route.ts',
  'shipping/validate/route.ts',
  'payments/route.ts'
];

// Check if required files exist
function checkPrerequisites() {
  // Check if unified-data-service.ts exists
  const unifiedServicePath = path.join(__dirname, '..', 'src', 'lib', 'unified-data-service.ts');
  if (!fs.existsSync(unifiedServicePath)) {
    console.error('❌ Error: unified-data-service.ts does not exist.');
    console.log('Please create the unified data service first.');
    process.exit(1);
  }
  
  console.log('✅ Found unified-data-service.ts');
}

// Create template for service imports
function createServiceTemplate() {
  const template = 
`import { NextRequest } from 'next/server';
import * as UnifiedDataService from '@/lib/unified-data-service';
import { useNeDb } from '@/lib/config';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';`;

  fs.writeFileSync(TEMPLATE_PATH, template);
  console.log('✅ Created template file');
}

// Process a single route file
function updateRouteFile(routePath) {
  const filePath = path.join(API_DIR, routePath);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${routePath}`);
    return false;
  }
  
  console.log(`Processing ${routePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Replace DataService import with unified data service
  if (content.includes('import DataService from')) {
    content = content.replace(
      /import DataService from ['"]@\/lib\/data-service['"];/,
      `import * as UnifiedDataService from '@/lib/unified-data-service';\nimport { useNeDb } from '@/lib/config';`
    );
    updated = true;
  }

  // Fix params destructuring
  if (content.includes('{ params }:')) {
    content = content.replace(
      /\{\s*params\s*\}:\s*RouteParams/g,
      'context: RouteParams'
    );
    updated = true;
  }

  // Replace params.paramName with context.params.paramName
  const paramMatches = content.match(/const\s*\{\s*([a-zA-Z0-9_]+)\s*\}\s*=\s*params/g);
  if (paramMatches) {
    paramMatches.forEach(match => {
      const paramName = match.match(/const\s*\{\s*([a-zA-Z0-9_]+)\s*\}/)[1];
      content = content.replace(
        match,
        `const ${paramName} = context.params.${paramName}`
      );
    });
    updated = true;
  }

  // Replace DataService method calls with UnifiedDataService
  const dataServiceMethods = [
    'getProducts', 'getProductById', 'getCustomers', 'getCustomerById',
    'getOrders', 'getOrderById', 'getOrdersByCustomerId', 'getCarts',
    'getCartById', 'getCartByCustomerId', 'getWishlists', 'getWishlistById',
    'getWishlistByCustomerId', 'getReviews', 'getReviewById', 'getReviewsByProductId',
    'getPromotions', 'getPromotionById', 'getActivePromotions', 'getSupportTickets',
    'getSupportTicketById', 'getSupportTicketsByCustomerId', 'getFAQs', 'getFAQById',
    'getReturns', 'getReturnById', 'getReturnsByCustomerId', 'getNotifications',
    'getNotificationById', 'getNotificationsByCustomerId'
  ];

  dataServiceMethods.forEach(method => {
    const regex = new RegExp(`DataService\\.${method}\\(`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, `UnifiedDataService.${method}(`);
      updated = true;
    }
  });

  // Add NeDB check before write operations
  if (content.includes('PUT') || content.includes('POST') || content.includes('DELETE')) {
    // Add NeDB check if it doesn't already exist
    if (!content.includes('useNeDb()') && !content.includes('if (!useNeDb())')) {
      const putMatch = content.match(/export\s+async\s+function\s+PUT[\s\S]*?try\s*{[\s\S]*?const\s+[a-zA-Z0-9_]+\s*=/);
      const postMatch = content.match(/export\s+async\s+function\s+POST[\s\S]*?try\s*{[\s\S]*?const\s+[a-zA-Z0-9_]+\s*=/);
      const deleteMatch = content.match(/export\s+async\s+function\s+DELETE[\s\S]*?try\s*{[\s\S]*?const\s+[a-zA-Z0-9_]+\s*=/);
      
      if (putMatch) {
        content = content.replace(
          putMatch[0],
          putMatch[0] + `
    
    // Check if NeDB is enabled for write operations
    if (!useNeDb()) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Write operations not enabled. Enable NeDB mode for this operation.'
      );
    }
    `
        );
        updated = true;
      }
      
      if (postMatch && !routePath.includes('auth/')) {
        content = content.replace(
          postMatch[0],
          postMatch[0] + `
    
    // Check if NeDB is enabled for write operations
    if (!useNeDb()) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Write operations not enabled. Enable NeDB mode for this operation.'
      );
    }
    `
        );
        updated = true;
      }
      
      if (deleteMatch) {
        content = content.replace(
          deleteMatch[0],
          deleteMatch[0] + `
    
    // Check if NeDB is enabled for write operations
    if (!useNeDb()) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Write operations not enabled. Enable NeDB mode for this operation.'
      );
    }
    `
        );
        updated = true;
      }
    }
  }

  // Update error logging to remove direct params reference
  content = content.replace(
    /console\.error\(`.*\$\{params\.[a-zA-Z0-9_]+\}.*`,/g,
    'console.error(`Error:`,');
  updated = true;

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${routePath}`);
    return true;
  } else {
    console.log(`⏭️ No changes needed for ${routePath}`);
    return false;
  }
}

// Ensure the parent directories exist for a file
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
  return true;
}

// Main function
async function main() {
  console.log('\n=== API Endpoint Database Migration Tool ===\n');
  console.log('Updating API endpoints to use unified data service...\n');
  
  // Check prerequisites
  checkPrerequisites();
  
  // Create template file
  createServiceTemplate();
  
  // Update each endpoint
  let updated = 0;
  let notFound = 0;
  
  for (const endpoint of ENDPOINTS_TO_UPDATE) {
    try {
      const result = updateRouteFile(endpoint);
      if (result) updated++;
    } catch (error) {
      console.error(`❌ Error updating ${endpoint}:`, error.message);
      notFound++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Total endpoints in documentation: ${ENDPOINTS_TO_UPDATE.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Not found/errors: ${notFound}`);
  
  // Cleanup
  if (fs.existsSync(TEMPLATE_PATH)) {
    fs.unlinkSync(TEMPLATE_PATH);
  }
  
  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Restart your API server');
  console.log('2. Test key endpoints to verify database access');
  console.log('3. Implement NeDB services for additional entity types as needed');
}

// Run the script
main().catch(error => {
  console.error('Error running script:', error);
  process.exit(1);
}); 