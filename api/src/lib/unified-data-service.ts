/**
 * Unified Data Service
 * 
 * This service acts as a bridge between the static DataService and NeDB-based services.
 * It routes requests to the appropriate service based on the useNeDb configuration.
 */
import { useNeDb } from './config';
import DataService from './data-service';

// Import database services
import * as ProductsDbService from './db/services/products';
import * as CategoriesDbService from './db/services/categories';
import * as EntityServices from './db/entity-services';

/**
 * Product Services
 */
export const getProductById = async (id: string) => {
  if (useNeDb()) {
    return ProductsDbService.getProductById(id);
  }
  return DataService.getProductById(id);
};

export const getProducts = async (options?: any) => {
  if (useNeDb()) {
    return ProductsDbService.getAllProducts(options);
  }
  return DataService.getProducts();
};

export const createProduct = async (productData: any) => {
  if (useNeDb()) {
    return ProductsDbService.createProduct(productData);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create products.');
};

export const updateProduct = async (id: string, updates: any) => {
  if (useNeDb()) {
    return ProductsDbService.updateProduct(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update products.');
};

export const deleteProduct = async (id: string) => {
  if (useNeDb()) {
    return ProductsDbService.deleteProduct(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete products.');
};

/**
 * Customer Services
 */
export const getCustomers = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.customerService.getAll(options);
  }
  return DataService.getCustomers();
};

export const getCustomerById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.customerService.getById(id);
  }
  return DataService.getCustomerById(id);
};

export const createCustomer = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.customerService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create customers.');
};

export const updateCustomer = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.customerService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update customers.');
};

export const deleteCustomer = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.customerService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete customers.');
};

/**
 * Order Services
 */
export const getOrders = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.orderService.getAll(options);
  }
  return DataService.getOrders();
};

export const getOrderById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.orderService.getById(id);
  }
  return DataService.getOrderById(id);
};

export const getOrdersByCustomerId = async (customerId: string) => {
  if (useNeDb()) {
    return EntityServices.orderService.getAll({ customer_id: customerId });
  }
  return DataService.getOrdersByCustomerId(customerId);
};

export const createOrder = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.orderService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create orders.');
};

export const updateOrder = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.orderService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update orders.');
};

export const deleteOrder = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.orderService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete orders.');
};

/**
 * Cart Services
 */
export const getCarts = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.cartService.getAll(options);
  }
  return DataService.getCarts();
};

export const getCartById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.cartService.getById(id);
  }
  return DataService.getCartById(id);
};

export const getCartByCustomerId = async (customerId: string) => {
  if (useNeDb()) {
    return EntityServices.cartService.getAll({ customer_id: customerId });
  }
  return DataService.getCartByCustomerId(customerId);
};

export const createCart = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.cartService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create carts.');
};

export const updateCart = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.cartService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update carts.');
};

export const deleteCart = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.cartService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete carts.');
};

/**
 * Wishlist Services
 */
export const getWishlists = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.wishlistService.getAll(options);
  }
  return DataService.getWishlists();
};

export const getWishlistById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.wishlistService.getById(id);
  }
  return DataService.getWishlistById(id);
};

export const getWishlistByCustomerId = async (customerId: string) => {
  if (useNeDb()) {
    return EntityServices.wishlistService.getAll({ customer_id: customerId });
  }
  return DataService.getWishlistByCustomerId(customerId);
};

export const createWishlist = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.wishlistService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create wishlists.');
};

export const updateWishlist = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.wishlistService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update wishlists.');
};

export const deleteWishlist = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.wishlistService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete wishlists.');
};

/**
 * Review Services
 */
export const getReviews = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.reviewService.getAll(options);
  }
  return DataService.getReviews();
};

export const getReviewById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.reviewService.getById(id);
  }
  return DataService.getReviewById(id);
};

export const getReviewsByProductId = async (productId: string) => {
  if (useNeDb()) {
    return EntityServices.reviewService.getAll({ product_id: productId });
  }
  return DataService.getReviewsByProductId(productId);
};

export const createReview = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.reviewService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create reviews.');
};

export const updateReview = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.reviewService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update reviews.');
};

export const deleteReview = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.reviewService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete reviews.');
};

/**
 * Promotion Services
 */
export const getPromotions = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.promotionService.getAll(options);
  }
  return DataService.getPromotions();
};

export const getPromotionById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.promotionService.getById(id);
  }
  return DataService.getPromotionById(id);
};

export const getActivePromotions = async () => {
  if (useNeDb()) {
    const now = new Date().toISOString();
    return EntityServices.promotionService.getAll({
      start_date: { $lte: now },
      end_date: { $gte: now }
    });
  }
  return DataService.getActivePromotions();
};

export const createPromotion = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.promotionService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create promotions.');
};

export const updatePromotion = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.promotionService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update promotions.');
};

export const deletePromotion = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.promotionService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete promotions.');
};

/**
 * Support Ticket Services
 */
export const getSupportTickets = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.supportTicketService.getAll(options);
  }
  return DataService.getSupportTickets();
};

export const getSupportTicketById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.supportTicketService.getById(id);
  }
  return DataService.getSupportTicketById(id);
};

export const getSupportTicketsByCustomerId = async (customerId: string) => {
  if (useNeDb()) {
    return EntityServices.supportTicketService.getAll({ customer_id: customerId });
  }
  return DataService.getSupportTicketsByCustomerId(customerId);
};

export const createSupportTicket = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.supportTicketService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create support tickets.');
};

export const updateSupportTicket = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.supportTicketService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update support tickets.');
};

export const deleteSupportTicket = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.supportTicketService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete support tickets.');
};

/**
 * FAQ Services
 */
export const getFAQs = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.faqService.getAll(options);
  }
  return DataService.getFAQs();
};

export const getFAQById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.faqService.getById(id);
  }
  return DataService.getFAQById(id);
};

export const createFAQ = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.faqService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create FAQs.');
};

export const updateFAQ = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.faqService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update FAQs.');
};

export const deleteFAQ = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.faqService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete FAQs.');
};

/**
 * Return Services
 */
export const getReturns = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.returnService.getAll(options);
  }
  return DataService.getReturns();
};

export const getReturnById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.returnService.getById(id);
  }
  return DataService.getReturnById(id);
};

export const getReturnsByCustomerId = async (customerId: string) => {
  if (useNeDb()) {
    return EntityServices.returnService.getAll({ customer_id: customerId });
  }
  return DataService.getReturnsByCustomerId(customerId);
};

export const createReturn = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.returnService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create returns.');
};

export const updateReturn = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.returnService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update returns.');
};

export const deleteReturn = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.returnService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete returns.');
};

/**
 * Notification Services
 */
export const getNotifications = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.notificationService.getAll(options);
  }
  return DataService.getNotifications();
};

export const getNotificationById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.notificationService.getById(id);
  }
  return DataService.getNotificationById(id);
};

export const getNotificationsByCustomerId = async (customerId: string) => {
  if (useNeDb()) {
    return EntityServices.notificationService.getAll({ customer_id: customerId });
  }
  return DataService.getNotificationsByCustomerId(customerId);
};

export const createNotification = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.notificationService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create notifications.');
};

export const updateNotification = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.notificationService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update notifications.');
};

export const deleteNotification = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.notificationService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete notifications.');
};

/**
 * Payment Services
 */
export const getPayments = async (options?: any) => {
  if (useNeDb()) {
    return EntityServices.paymentService.getAll(options);
  }
  return { items: [], total: 0, page: 1, limit: 10 }; // No static implementation
};

export const getPaymentById = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.paymentService.getById(id);
  }
  return null; // No static implementation
};

export const createPayment = async (data: any) => {
  if (useNeDb()) {
    return EntityServices.paymentService.create(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create payments.');
};

export const updatePayment = async (id: string, updates: any) => {
  if (useNeDb()) {
    return EntityServices.paymentService.update(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update payments.');
};

export const deletePayment = async (id: string) => {
  if (useNeDb()) {
    return EntityServices.paymentService.delete(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete payments.');
};

/**
 * Category Services
 */
export const getCategories = async (options?: any) => {
  if (useNeDb()) {
    return CategoriesDbService.getAllCategories(options);
  }
  // Fallback for static mode - extract categories from products
  const products = await DataService.getProducts();
  const categorySet = new Set<string>();
  products.forEach(product => {
    if (product.category) {
      categorySet.add(product.category);
    }
  });
  
  // Convert to category objects
  const categories = Array.from(categorySet).map(categoryName => ({
    id: `cat_${categoryName.toLowerCase().replace(/\s+/g, '_')}`,
    name: categoryName,
    description: `${categoryName} products`,
    slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Apply pagination if provided
  const page = options?.page || 1;
  const limit = options?.limit || categories.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    categories: categories.slice(start, end),
    total: categories.length,
    page,
    limit
  };
};

export const getCategoryById = async (id: string) => {
  if (useNeDb()) {
    return CategoriesDbService.getCategoryById(id);
  }
  
  // Fallback for static mode
  const categories = await getCategories();
  return categories.categories.find(cat => cat.id === id) || null;
};

export const getCategoryBySlug = async (slug: string) => {
  if (useNeDb()) {
    return CategoriesDbService.getCategoryBySlug(slug);
  }
  
  // Fallback for static mode
  const categories = await getCategories();
  return categories.categories.find(cat => cat.slug === slug) || null;
};

export const createCategory = async (data: any) => {
  if (useNeDb()) {
    return CategoriesDbService.createCategory(data);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to create categories.');
};

export const updateCategory = async (id: string, updates: any) => {
  if (useNeDb()) {
    return CategoriesDbService.updateCategory(id, updates);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to update categories.');
};

export const deleteCategory = async (id: string) => {
  if (useNeDb()) {
    return CategoriesDbService.deleteCategory(id);
  }
  throw new Error('Write operations not enabled. Enable NeDB mode to delete categories.');
};

export const getProductCountsByCategory = async () => {
  if (useNeDb()) {
    return CategoriesDbService.getProductCountsByCategory();
  }
  
  // Fallback for static mode
  const products = await DataService.getProducts();
  const categoryCounts: Record<string, number> = {};
  
  products.forEach(product => {
    if (product.category) {
      const categoryId = `cat_${product.category.toLowerCase().replace(/\s+/g, '_')}`;
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    }
  });
  
  return categoryCounts;
};

export const getProductsForCategory = async (categoryId: string, options?: any) => {
  if (useNeDb()) {
    return CategoriesDbService.getProductsForCategory(categoryId, options);
  }
  
  // Fallback for static mode
  const category = await getCategoryById(categoryId);
  if (!category) {
    return { products: [], total: 0, page: options?.page || 1, limit: options?.limit || 10 };
  }
  
  // Get products for this category name
  const products = await DataService.getProductsByCategory(category.name);
  
  // Apply pagination
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  // Apply sorting if needed
  let sortedProducts = [...products];
  if (options?.sort_by) {
    const sortOrder = options.sort_order === 'asc' ? 1 : -1;
    sortedProducts = sortedProducts.sort((a, b) => {
      if (a[options.sort_by] < b[options.sort_by]) return -1 * sortOrder;
      if (a[options.sort_by] > b[options.sort_by]) return 1 * sortOrder;
      return 0;
    });
  }
  
  // Return paginated results
  return {
    products: sortedProducts.slice(start, end),
    total: products.length,
    page,
    limit
  };
};

// Default export with all methods
export default {
  // Products
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Customers
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  
  // Orders
  getOrders,
  getOrderById,
  getOrdersByCustomerId,
  createOrder,
  updateOrder,
  deleteOrder,
  
  // Carts
  getCarts,
  getCartById,
  getCartByCustomerId,
  createCart,
  updateCart,
  deleteCart,
  
  // Wishlists
  getWishlists,
  getWishlistById,
  getWishlistByCustomerId,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  
  // Reviews
  getReviews,
  getReviewById,
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
  
  // Promotions
  getPromotions,
  getPromotionById,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  
  // Support Tickets
  getSupportTickets,
  getSupportTicketById,
  getSupportTicketsByCustomerId,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
  
  // FAQs
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  
  // Returns
  getReturns,
  getReturnById,
  getReturnsByCustomerId,
  createReturn,
  updateReturn,
  deleteReturn,
  
  // Notifications
  getNotifications,
  getNotificationById,
  getNotificationsByCustomerId,
  createNotification,
  updateNotification,
  deleteNotification,
  
  // Payments
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  
  // Categories
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductCountsByCategory,
  getProductsForCategory
}; 