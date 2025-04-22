import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
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
  { params }: RouteParams
) {
  try {
    const { productId } = params;
    
    // Get the product by ID
    const product = await DataService.getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Return the product
    return successResponse(product);
    
  } catch (error) {
    console.error(`Error fetching product ${params.productId}:`, error);
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
  { params }: RouteParams
) {
  try {
    const { productId } = params;
    
    // Get the product by ID
    const product = await DataService.getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Update the product with new values, keeping existing ones if not provided
    const updatedProduct = {
      ...product,
      name: body.name || product.name,
      description: body.description || product.description,
      price: body.price ? {
        amount: body.price.amount || product.price.amount,
        currency: body.price.currency || product.price.currency
      } : product.price,
      in_stock: body.in_stock !== undefined ? body.in_stock : product.in_stock,
      stock_quantity: body.stock_quantity !== undefined ? body.stock_quantity : product.stock_quantity,
      images: body.images || product.images,
      attributes: body.attributes ? { ...product.attributes, ...body.attributes } : product.attributes,
      category: body.category || product.category,
      brand: body.brand || product.brand,
      tags: body.tags || product.tags,
      specifications: body.specifications ? { ...product.specifications, ...body.specifications } : product.specifications,
      updated_at: new Date().toISOString()
    };
    
    // Get all products
    const products = await DataService.getProducts();
    
    // Find the index of the product to update
    const index = products.findIndex(p => p.id === productId);
    
    // Update the product in the array
    products[index] = updatedProduct;
    
    // Save the updated product
    await DataService.updateProduct(updatedProduct);
    
    // Return the updated product
    return successResponse(updatedProduct);
    
  } catch (error) {
    console.error(`Error updating product ${params.productId}:`, error);
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
  { params }: RouteParams
) {
  try {
    const { productId } = params;
    
    // Get the product by ID
    const product = await DataService.getProductById(productId);
    
    // If product not found, return 404 error
    if (!product) {
      return notFoundResponse('product', productId);
    }
    
    // Get all products
    const products = await DataService.getProducts();
    
    // Filter out the product to delete
    const updatedProducts = products.filter(p => p.id !== productId);
    
    // Return no content (204) on successful deletion
    // Note: In a real implementation, we would save the updated products list
    // For now, we're just simulating the deletion
    return successResponse({ message: "Product deleted successfully" });
    
  } catch (error) {
    console.error(`Error deleting product ${params.productId}:`, error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while deleting the product'
    );
  }
} 