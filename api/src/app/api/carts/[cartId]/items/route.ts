import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';
import { Cart, CartItem } from '@/types';

interface RouteParams {
  params: {
    cartId: string;
  };
}

/**
 * GET /api/carts/:cartId/items
 * Fetch items in a specific cart
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { cartId } = params;
    
    // Get the cart by ID
    const cart = await DataService.getCartById(cartId);
    
    // If cart not found, return 404 error
    if (!cart) {
      return notFoundResponse('cart', cartId);
    }
    
    // Return the cart items
    return successResponse(cart.items);
    
  } catch (error) {
    console.error(`Error fetching items for cart ${params.cartId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the cart items'
    );
  }
}

/**
 * POST /api/carts/:cartId/items
 * Add an item to a cart
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { cartId } = params;
    
    // Get the cart by ID
    const cart = await DataService.getCartById(cartId);
    
    // If cart not found, return 404 error
    if (!cart) {
      return notFoundResponse('cart', cartId);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.product_id || !body.quantity) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Missing required fields',
        {
          required_fields: ['product_id', 'quantity']
        }
      );
    }
    
    // Check if product exists and is in stock
    const product = await DataService.getProductById(body.product_id);
    if (!product) {
      return errorResponse(
        'PRODUCT_NOT_FOUND',
        `Product with ID '${body.product_id}' not found`,
        { product_id: body.product_id }
      );
    }
    
    if (!product.in_stock || product.stock_quantity < body.quantity) {
      return errorResponse(
        'VALIDATION_ERROR',
        `Product '${product.name}' is not available in the requested quantity`,
        { 
          product_id: body.product_id,
          requested_quantity: body.quantity,
          available_quantity: product.stock_quantity
        }
      );
    }
    
    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id === body.product_id
    );
    
    // If the product is already in the cart, update the quantity
    if (existingItemIndex !== -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + body.quantity;
      
      // Check if the new quantity exceeds the available stock
      if (newQuantity > product.stock_quantity) {
        return errorResponse(
          'VALIDATION_ERROR',
          `Cannot add ${body.quantity} more units of '${product.name}'. Exceeds available stock.`,
          {
            product_id: body.product_id,
            current_quantity: cart.items[existingItemIndex].quantity,
            requested_quantity: body.quantity,
            available_quantity: product.stock_quantity
          }
        );
      }
      
      // Update the quantity
      cart.items[existingItemIndex].quantity = newQuantity;
      
      // Update the price (in case it changed)
      cart.items[existingItemIndex].price = {
        amount: product.price.amount,
        currency: product.price.currency
      };
    } else {
      // Generate a new item ID
      const itemId = `item_${(cart.items.length + 1).toString().padStart(3, '0')}`;
      
      // Add the new item to the cart
      const newItem: CartItem = {
        id: itemId,
        product_id: body.product_id,
        quantity: body.quantity,
        price: {
          amount: product.price.amount,
          currency: product.price.currency
        }
      };
      
      cart.items.push(newItem);
    }
    
    // Recalculate the total amount
    cart.total_amount.amount = cart.items.reduce(
      (total, item) => total + (item.price.amount * item.quantity),
      0
    );
    
    // Update the cart's updated_at timestamp
    cart.updated_at = new Date().toISOString();
    
    // In a real implementation, we would save the updated cart
    // For now, we're just simulating the update
    
    // Return the updated cart
    return successResponse(cart);
    
  } catch (error) {
    console.error(`Error adding item to cart ${params.cartId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while adding the item to the cart'
    );
  }
}

/**
 * DELETE /api/carts/:cartId/items
 * Remove all items from a cart
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { cartId } = params;
    
    // Get the cart by ID
    const cart = await DataService.getCartById(cartId);
    
    // If cart not found, return 404 error
    if (!cart) {
      return notFoundResponse('cart', cartId);
    }
    
    // Clear the cart items
    cart.items = [];
    
    // Reset the total amount
    cart.total_amount.amount = 0;
    
    // Update the cart's updated_at timestamp
    cart.updated_at = new Date().toISOString();
    
    // In a real implementation, we would save the updated cart
    // For now, we're just simulating the update
    
    // Return the updated cart
    return successResponse(cart);
    
  } catch (error) {
    console.error(`Error clearing items from cart ${params.cartId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while clearing the cart items'
    );
  }
} 