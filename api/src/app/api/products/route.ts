/**
 * Products API endpoint
 * GET - Get all products with pagination and filtering
 * POST - Create a new product (when NeDB is enabled)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db/services/products';
import { useNeDb } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort_by = searchParams.get('sort_by') || undefined;
    const sort_order = (searchParams.get('sort_order') as 'asc' | 'desc') || undefined;
    
    // Get products
    const result = await getAllProducts({
      page,
      limit,
      category,
      search,
      sort_by,
      sort_order
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to create products.' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const productData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'image_url', 'category', 'stock'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create product
    const newProduct = await createProduct(productData);
    
    return NextResponse.json(
      { product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle specific errors
    if (error instanceof Error && error.message === 'Cannot write to static JSON files') {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to create products.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 