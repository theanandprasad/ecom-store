import { NextRequest } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db/services/products';
import { useNeDb } from '@/lib/config';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} from '@/utils/api-utils';

interface RouteParams {
  params: {
    productId: string;
  };
}

/**
 * GET /api/products/:productId
 * Fetch a specific product by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Safely extract productId from params
    const productId = context.params.productId;
    
    // Get the product by ID
    const product = await getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Return the product
    return successResponse(product);
    
  } catch (error) {
    console.error(`Error fetching product:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching the product'
    );
  }
}

/**
 * PUT /api/products/:productId
 * Update a specific product by ID
 */
export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Safely extract productId from params
    const productId = context.params.productId;
    
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Write operations not enabled. Enable NeDB mode to update products.'
      );
    }
    
    // First check if product exists
    const product = await getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Create update object with new values, keeping existing ones if not provided
    const updates = {
      name: body.name || product.name,
      description: body.description || product.description,
      price: body.price !== undefined ? body.price : product.price,
      stock: body.stock !== undefined ? body.stock : product.stock,
      image_url: body.image_url || product.image_url,
      category: body.category || product.category,
      // Add additional fields as needed
      updated_at: new Date().toISOString()
    };
    
    // Update the product
    const updatedProduct = await updateProduct(productId, updates);
    
    // If update failed
    if (!updatedProduct) {
      return errorResponse(
        'INTERNAL_SERVER_ERROR',
        'Failed to update product'
      );
    }
    
    // Return the updated product
    return successResponse(updatedProduct);
    
  } catch (error) {
    console.error(`Error updating product:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while updating the product'
    );
  }
}

/**
 * DELETE /api/products/:productId
 * Delete a specific product by ID
 */
export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Safely extract productId from params
    const productId = context.params.productId;
    
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return errorResponse(
        'VALIDATION_ERROR', 
        'Write operations not enabled. Enable NeDB mode to delete products.'
      );
    }
    
    // First check if product exists
    const product = await getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Delete the product
    const success = await deleteProduct(productId);
    
    // If deletion failed
    if (!success) {
      return errorResponse(
        'INTERNAL_SERVER_ERROR',
        'Failed to delete product'
      );
    }
    
    // Return success message
    return successResponse({ message: "Product deleted successfully" });
    
  } catch (error) {
    console.error(`Error deleting product:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the product'
    );
  }
} 