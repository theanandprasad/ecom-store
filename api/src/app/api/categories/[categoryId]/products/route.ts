/**
 * Category Products API endpoint
 * GET - Get all products for a specific category
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCategoryById, getProductsForCategory } from '@/lib/unified-data-service';

interface RouteParams {
  params: {
    categoryId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { categoryId } = params;
    
    // Check if category exists
    const category = await getCategoryById(categoryId);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort_by = searchParams.get('sort_by') || 'created_at';
    const sort_order = (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc';
    
    // Get products for category
    const result = await getProductsForCategory(categoryId, {
      page,
      limit,
      sort_by,
      sort_order
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products for category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products for category' },
      { status: 500 }
    );
  }
} 