import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';
import { Wishlist, WishlistItem } from '@/types';

interface RouteParams {
  params: {
    wishlistId: string;
  };
}

/**
 * GET /api/wishlists/:wishlistId/items
 * Fetch all items in a specific wishlist
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { wishlistId } = params;
    
    // Get the wishlist by ID
    const wishlist = await DataService.getWishlistById(wishlistId);
    
    // If wishlist not found, return 404 error
    if (!wishlist) {
      return notFoundResponse('wishlist', wishlistId);
    }
    
    // Return the wishlist items
    return successResponse(wishlist.items);
    
  } catch (error) {
    console.error(`Error fetching wishlist items for ${params.wishlistId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the wishlist items'
    );
  }
}

/**
 * POST /api/wishlists/:wishlistId/items
 * Add an item to a wishlist
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { wishlistId } = params;
    
    // Get the wishlist by ID
    const wishlist = await DataService.getWishlistById(wishlistId);
    
    // If wishlist not found, return 404 error
    if (!wishlist) {
      return notFoundResponse('wishlist', wishlistId);
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.product_id) {
      return errorResponse('VALIDATION_ERROR', 'product_id is required');
    }
    
    // Verify the product exists
    const product = await DataService.getProductById(body.product_id);
    if (!product) {
      return notFoundResponse('product', body.product_id);
    }
    
    // Check if product is already in the wishlist
    const existingItem = wishlist.items.find(item => item.product_id === body.product_id);
    if (existingItem) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Product is already in the wishlist',
        { product_id: body.product_id }
      );
    }
    
    // Create a new wishlist item with all required properties
    const now = new Date().toISOString();
    const newItem: WishlistItem = {
      id: `item_${Date.now()}`,
      product_id: body.product_id,
      added_at: now,
      created_at: now,
      updated_at: now
    };
    
    // Add the item to the wishlist
    const updatedWishlist = {
      ...wishlist,
      items: [...wishlist.items, newItem],
      updated_at: now
    };
    
    // In a real implementation, we would save the updated wishlist
    // For now, we're just returning the updated wishlist
    
    // Return the updated wishlist
    return successResponse(updatedWishlist);
    
  } catch (error) {
    console.error(`Error adding item to wishlist ${params.wishlistId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while adding the item to the wishlist'
    );
  }
}

/**
 * DELETE /api/wishlists/:wishlistId/items
 * Remove an item from a wishlist or clear all items
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { wishlistId } = params;
    
    // Get the wishlist by ID
    const wishlist = await DataService.getWishlistById(wishlistId);
    
    // If wishlist not found, return 404 error
    if (!wishlist) {
      return notFoundResponse('wishlist', wishlistId);
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const clearAll = searchParams.get('clear_all') === 'true';
    
    let updatedWishlist: Wishlist;
    
    if (clearAll) {
      // Clear all items from the wishlist
      updatedWishlist = {
        ...wishlist,
        items: [],
        updated_at: new Date().toISOString()
      };
    } else if (productId) {
      // Remove a specific product from the wishlist
      const itemExists = wishlist.items.some(item => item.product_id === productId);
      
      if (!itemExists) {
        return errorResponse(
          'VALIDATION_ERROR',
          'Product not found in the wishlist',
          { product_id: productId }
        );
      }
      
      updatedWishlist = {
        ...wishlist,
        items: wishlist.items.filter(item => item.product_id !== productId),
        updated_at: new Date().toISOString()
      };
    } else {
      return errorResponse(
        'VALIDATION_ERROR',
        'Either product_id or clear_all parameter is required'
      );
    }
    
    // In a real implementation, we would save the updated wishlist
    // For now, we're just returning the updated wishlist
    
    // Return the updated wishlist
    return successResponse(updatedWishlist);
    
  } catch (error) {
    console.error(`Error removing item from wishlist ${params.wishlistId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while removing the item from the wishlist'
    );
  }
} 