// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Learn more: https://jestjs.io/docs/configuration#setupfilesafterenv-array

// Mock the Data Service
jest.mock('./src/lib/data-service', () => ({
  __esModule: true,
  default: {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    getCustomers: jest.fn(),
    getCustomerById: jest.fn(),
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    getOrdersByCustomerId: jest.fn(),
    getCarts: jest.fn(),
    getCartById: jest.fn(),
    getCartByCustomerId: jest.fn(),
    getWishlists: jest.fn(),
    getWishlistById: jest.fn(),
    getWishlistByCustomerId: jest.fn(),
    getReviews: jest.fn(),
    getReviewById: jest.fn(),
    getReviewsByProductId: jest.fn(),
    getPromotions: jest.fn(),
    getPromotionById: jest.fn(),
    getActivePromotions: jest.fn(),
    getSupportTickets: jest.fn(),
    getSupportTicketById: jest.fn(),
    getSupportTicketsByCustomerId: jest.fn(),
    getFAQs: jest.fn(),
    getFAQById: jest.fn(),
    getReturns: jest.fn(),
    getReturnById: jest.fn(),
    getReturnsByCustomerId: jest.fn(),
    getNotifications: jest.fn(),
    getNotificationById: jest.fn(),
    getNotificationsByCustomerId: jest.fn(),
    updateProduct: jest.fn(),
  }
}));

// Mock Next.js Response
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    __esModule: true,
    ...originalModule,
    NextResponse: {
      json: jest.fn((data, options) => ({
        data,
        options,
        headers: new Map(),
      })),
      redirect: jest.fn(),
      next: jest.fn(),
    }
  };
}); 