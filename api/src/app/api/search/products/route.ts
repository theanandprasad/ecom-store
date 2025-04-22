import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { successResponse, errorResponse } from '@/utils/api-utils';
import { Product } from '@/types';

/**
 * GET /api/search/products
 * Search products with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all products
    const products = await DataService.getProducts();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const priceMin = parseFloat(searchParams.get('price_min') || '0');
    const priceMax = parseFloat(searchParams.get('price_max') || 'Infinity');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Validate that the query parameter is provided
    if (!query) {
      return errorResponse('VALIDATION_ERROR', 'query parameter is required');
    }
    
    // Convert query to lowercase for case-insensitive search
    const queryLower = query.toLowerCase();
    
    // Apply filters
    let filteredProducts = products.filter(product => {
      // Text search on name, description, brand, and tags
      const matchesQuery = 
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.brand.toLowerCase().includes(queryLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(queryLower));
      
      // Category filter
      const matchesCategory = !category || 
        product.category.toLowerCase() === category.toLowerCase();
      
      // Price range filter
      const matchesPriceRange =
        product.price.amount >= priceMin &&
        product.price.amount <= priceMax;
      
      // Apply all filters
      return matchesQuery && matchesCategory && matchesPriceRange;
    });
    
    // Sort products
    if (sort) {
      switch (sort) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price.amount - b.price.amount);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price.amount - a.price.amount);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          break;
        default:
          // Default sorting is by relevance, which is already done
          break;
      }
    }
    
    // Extract unique categories and price ranges for filters
    const categories = [...new Set(products.map(p => p.category))];
    
    // Generate price ranges
    const prices = products.map(p => p.price.amount).sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    
    // Create price range buckets
    const priceRanges = [];
    if (prices.length > 0) {
      const rangeSize = (maxPrice - minPrice) / 4; // Split into 4 ranges
      for (let i = 0; i < 4; i++) {
        const start = Math.floor(minPrice + i * rangeSize);
        const end = Math.ceil(minPrice + (i + 1) * rangeSize);
        priceRanges.push(`${start}-${end}`);
      }
    }
    
    // Calculate pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Create simplified product results
    const results = paginatedProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price.amount,
      image: product.images[0] || ''
    }));
    
    // Return search results with filters and pagination
    return successResponse({
      results,
      filters: {
        categories,
        price_ranges: priceRanges
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error searching products:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while searching products'
    );
  }
} 