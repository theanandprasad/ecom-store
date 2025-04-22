import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse } from '@/utils/api-utils';
import { Wishlist } from '@/types';

/**
 * GET /api/wishlists
 * Fetch all wishlists with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all wishlists
    const wishlists = await DataService.getWishlists();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const customerId = searchParams.get('customer_id');
    
    // Apply filters
    let filteredWishlists = wishlists;
    
    // Filter by customer ID if provided
    if (customerId) {
      filteredWishlists = filteredWishlists.filter(
        wishlist => wishlist.customer_id === customerId
      );
    }
    
    // Calculate pagination
    const total = filteredWishlists.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedWishlists = filteredWishlists.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedWishlists, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching wishlists'
    );
  }
}

/**
 * POST /api/wishlists
 * Create a new wishlist
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_id) {
      return errorResponse('VALIDATION_ERROR', 'customer_id is required');
    }
    
    // Check if a wishlist already exists for this customer
    const wishlists = await DataService.getWishlists();
    const existingWishlist = wishlists.find(w => w.customer_id === body.customer_id);
    
    if (existingWishlist) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'A wishlist already exists for this customer',
        { existing_wishlist_id: existingWishlist.id }
      );
    }
    
    // Create a new wishlist
    const newWishlist: Wishlist = {
      id: `wish_${Date.now()}`,
      customer_id: body.customer_id,
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, we would save the new wishlist
    // For now, we're just returning the new wishlist
    
    // Return the created wishlist
    return successResponse(newWishlist);
    
  } catch (error) {
    console.error('Error creating wishlist:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while creating the wishlist'
    );
  }
} 