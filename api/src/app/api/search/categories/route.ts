/**
 * Categories Search API endpoint
 * GET - Search for categories by name, description, etc.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/unified-data-service';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    // Get all categories
    const result = await getCategories({ search: query, page, limit });
    
    // If using static mode, we need to filter the results manually
    // since the getCategories may not support the search parameter
    if (!result.categories.some(cat => 
      cat.name.toLowerCase().includes(query.toLowerCase()) || 
      cat.description.toLowerCase().includes(query.toLowerCase())
    )) {
      // Manually filter categories
      const allResult = await getCategories({ limit: 1000 }); // Get more categories to filter from
      const filteredCategories = allResult.categories.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase()) || 
        cat.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Apply pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return NextResponse.json({
        categories: filteredCategories.slice(start, end),
        total: filteredCategories.length,
        page,
        limit
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching categories:', error);
    return NextResponse.json(
      { error: 'Failed to search categories' },
      { status: 500 }
    );
  }
} 