/**
 * Categories API endpoint
 * GET - Get all categories with pagination and filtering
 * POST - Create a new category (when NeDB is enabled)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/unified-data-service';
import { useNeDb } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const parent_id = searchParams.get('parent_id') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort_by = searchParams.get('sort_by') || undefined;
    const sort_order = (searchParams.get('sort_order') as 'asc' | 'desc') || undefined;
    
    // Get categories
    const result = await getCategories({
      page,
      limit,
      parent_id,
      search,
      sort_by,
      sort_order
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to create categories.' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const categoryData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'slug'];
    const missingFields = requiredFields.filter(field => !categoryData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create category
    const newCategory = await createCategory(categoryData);
    
    return NextResponse.json(
      { category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle specific errors
    if (error instanceof Error && error.message === 'Cannot write to static JSON files') {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to create categories.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 