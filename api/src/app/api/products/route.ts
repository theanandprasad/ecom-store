import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse } from '@/utils/api-utils';

/**
 * GET /api/products
 * Fetch all products with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all products
    const products = await DataService.getProducts();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = parseFloat(searchParams.get('min_price') || '0');
    const maxPrice = parseFloat(searchParams.get('max_price') || 'Infinity');
    const inStock = searchParams.get('in_stock') === 'true';
    
    // Apply filters
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (brand) {
      filteredProducts = filteredProducts.filter(
        product => product.brand.toLowerCase() === brand.toLowerCase()
      );
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(
      product => product.price.amount >= minPrice && product.price.amount <= maxPrice
    );
    
    // Filter by stock status if specified
    if (searchParams.has('in_stock')) {
      filteredProducts = filteredProducts.filter(
        product => product.in_stock === inStock
      );
    }
    
    // Calculate pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedProducts, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching products'
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Missing required fields',
        {
          required_fields: ['name', 'price', 'category']
        }
      );
    }
    
    // Get existing products
    const products = await DataService.getProducts();
    
    // Generate a new product ID
    const productId = `prod_${(products.length + 1).toString().padStart(3, '0')}`;
    
    // Create a new product
    const newProduct = {
      id: productId,
      name: body.name,
      description: body.description || '',
      price: {
        amount: body.price.amount || 0,
        currency: body.price.currency || 'USD'
      },
      in_stock: body.in_stock !== undefined ? body.in_stock : true,
      stock_quantity: body.stock_quantity || 0,
      images: body.images || [],
      attributes: body.attributes || {},
      category: body.category,
      brand: body.brand || '',
      rating: 0,
      review_count: 0,
      tags: body.tags || [],
      specifications: body.specifications || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the new product to the products array
    products.push(newProduct);
    
    // Write the updated products back to the file
    await DataService.updateProduct(newProduct);
    
    // Return the created product
    return successResponse(newProduct);
    
  } catch (error) {
    console.error('Error creating product:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the product'
    );
  }
} 