import fs from 'fs';
import path from 'path';
import { 
  Product, 
  Customer, 
  Order, 
  Cart, 
  Wishlist, 
  Review, 
  Promotion, 
  SupportTicket, 
  FAQ, 
  Return, 
  Notification 
} from '../types';

// Define the path to the mock data directory - now it's inside the api directory
const MOCK_DATA_DIR = path.join(process.cwd(), 'mock-data');

// Generic interface for all data collections
interface DataCollections {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  carts: Cart[];
  wishlists: Wishlist[];
  reviews: Review[];
  promotions: Promotion[];
  support_tickets: SupportTicket[];
  faq: FAQ[];
  returns: Return[];
  notifications: Notification[];
}

// Generic data wrapper for all JSON files
interface DataWrapper<T> {
  [key: string]: T[];
}

/**
 * Generic function to read data from a JSON file
 * @param filename - The name of the JSON file (without extension)
 * @returns The data from the file as an array
 */
async function readData<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(MOCK_DATA_DIR, `${filename}.json`);
    console.log(`Reading mock data from: ${filePath}`);
    
    const fileData = await fs.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileData) as DataWrapper<T>;
    const key = Object.keys(data)[0]; // Get the root key (e.g., "products")
    return data[key] as T[];
  } catch (error) {
    console.error(`Error reading ${filename}.json:`, error);
    return [];
  }
}

/**
 * Generic function to write data to a JSON file
 * @param filename - The name of the JSON file (without extension)
 * @param data - The data to write to the file
 * @returns True if successful, false otherwise
 */
async function writeData<T>(filename: string, data: T[]): Promise<boolean> {
  try {
    const filePath = path.join(MOCK_DATA_DIR, `${filename}.json`);
    
    // Try to get the root key from the existing file
    let key = filename; // Default to filename if file doesn't exist
    try {
      const fileData = await fs.promises.readFile(filePath, 'utf-8');
      const existingData = JSON.parse(fileData) as DataWrapper<T>;
      key = Object.keys(existingData)[0]; // Get the root key (e.g., "products")
    } catch (err) {
      // If file doesn't exist, use the filename as key
      console.log(`Creating new file: ${filePath}`);
    }
    
    // Create the new data object with the root key
    const newData: DataWrapper<T> = { [key]: data } as DataWrapper<T>;
    
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(newData, null, 4),
      'utf-8'
    );
    return true;
  } catch (error) {
    console.error(`Error writing to ${filename}.json:`, error);
    return false;
  }
}

// Export specific data access functions
export const DataService = {
  // Products
  getProducts: () => readData<Product>('products'),
  getProductById: async (id: string) => {
    const products = await readData<Product>('products');
    return products.find(product => product.id === id);
  },
  getProductsByCategory: async (categoryName: string) => {
    const products = await readData<Product>('products');
    return products.filter(product => product.category === categoryName);
  },
  
  // Categories - derived from products for static mode
  getCategories: async () => {
    const products = await readData<Product>('products');
    const categorySet = new Set<string>();
    
    products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    
    return Array.from(categorySet).map(categoryName => ({
      id: `cat_${categoryName.toLowerCase().replace(/\s+/g, '_')}`,
      name: categoryName,
      description: `${categoryName} products`,
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  },
  getCategoryById: async (id: string) => {
    const categories = await DataService.getCategories();
    return categories.find(category => category.id === id);
  },
  getCategoryBySlug: async (slug: string) => {
    const categories = await DataService.getCategories();
    return categories.find(category => category.slug === slug);
  },
  getProductCountsByCategory: async () => {
    const products = await readData<Product>('products');
    const categoryCounts: Record<string, number> = {};
    
    products.forEach(product => {
      if (product.category) {
        const categoryId = `cat_${product.category.toLowerCase().replace(/\s+/g, '_')}`;
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      }
    });
    
    return categoryCounts;
  },
  
  // Customers
  getCustomers: () => readData<Customer>('customers'),
  getCustomerById: async (id: string) => {
    const customers = await readData<Customer>('customers');
    return customers.find(customer => customer.id === id);
  },
  
  // Orders
  getOrders: () => readData<Order>('orders'),
  getOrderById: async (id: string) => {
    const orders = await readData<Order>('orders');
    return orders.find(order => order.id === id);
  },
  getOrdersByCustomerId: async (customerId: string) => {
    const orders = await readData<Order>('orders');
    return orders.filter(order => order.customer_id === customerId);
  },
  
  // Carts
  getCarts: () => readData<Cart>('carts'),
  getCartById: async (id: string) => {
    const carts = await readData<Cart>('carts');
    return carts.find(cart => cart.id === id);
  },
  getCartByCustomerId: async (customerId: string) => {
    const carts = await readData<Cart>('carts');
    return carts.find(cart => cart.customer_id === customerId);
  },
  
  // Wishlists
  getWishlists: () => readData<Wishlist>('wishlists'),
  getWishlistById: async (id: string) => {
    const wishlists = await readData<Wishlist>('wishlists');
    return wishlists.find(wishlist => wishlist.id === id);
  },
  getWishlistByCustomerId: async (customerId: string) => {
    const wishlists = await readData<Wishlist>('wishlists');
    return wishlists.find(wishlist => wishlist.customer_id === customerId);
  },
  
  // Reviews
  getReviews: () => readData<Review>('reviews'),
  getReviewById: async (id: string) => {
    const reviews = await readData<Review>('reviews');
    return reviews.find(review => review.id === id);
  },
  getReviewsByProductId: async (productId: string) => {
    const reviews = await readData<Review>('reviews');
    return reviews.filter(review => review.product_id === productId);
  },
  
  // Promotions
  getPromotions: () => readData<Promotion>('promotions'),
  getPromotionById: async (id: string) => {
    const promotions = await readData<Promotion>('promotions');
    return promotions.find(promotion => promotion.id === id);
  },
  getActivePromotions: async () => {
    const promotions = await readData<Promotion>('promotions');
    const now = new Date().toISOString();
    return promotions.filter(
      promotion => promotion.start_date <= now && promotion.end_date >= now
    );
  },
  
  // Support tickets
  getSupportTickets: () => readData<SupportTicket>('support_tickets'),
  getSupportTicketById: async (id: string) => {
    const tickets = await readData<SupportTicket>('support_tickets');
    return tickets.find(ticket => ticket.id === id);
  },
  getSupportTicketsByCustomerId: async (customerId: string) => {
    const tickets = await readData<SupportTicket>('support_tickets');
    return tickets.filter(ticket => ticket.customer_id === customerId);
  },
  
  // FAQs
  getFAQs: () => readData<FAQ>('faq'),
  getFAQById: async (id: string) => {
    const faqs = await readData<FAQ>('faq');
    return faqs.find(faq => faq.id === id);
  },
  
  // Returns
  getReturns: () => readData<Return>('returns'),
  getReturnById: async (id: string) => {
    const returns = await readData<Return>('returns');
    return returns.find(returnItem => returnItem.id === id);
  },
  getReturnsByCustomerId: async (customerId: string) => {
    const returns = await readData<Return>('returns');
    return returns.filter(returnItem => returnItem.customer_id === customerId);
  },
  
  // Notifications
  getNotifications: () => readData<Notification>('notifications'),
  getNotificationById: async (id: string) => {
    const notifications = await readData<Notification>('notifications');
    return notifications.find(notification => notification.id === id);
  },
  getNotificationsByCustomerId: async (customerId: string) => {
    const notifications = await readData<Notification>('notifications');
    return notifications.filter(notification => notification.customer_id === customerId);
  },
};

export default DataService; 