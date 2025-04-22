import { NextRequest } from 'next/server';
import { GET, POST } from '../app/api/products/[productId]/reviews/route';
import DataService from '../lib/data-service';

const mockDataService = DataService as jest.Mocked<typeof DataService>;

// Mock params for route handler
const mockParams = {
  params: {
    productId: 'prod_001'
  }
};

describe('Reviews API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products/:productId/reviews', () => {
    it('should return reviews for a product', async () => {
      // Mock product
      const mockProduct = {
        id: 'prod_001',
        name: 'Test Product 1',
        description: 'Test description 1',
        price: { amount: 99.99, currency: 'USD' },
        in_stock: true,
        stock_quantity: 10,
        images: [],
        attributes: {},
        category: 'Test Category',
        brand: 'Test Brand',
        rating: 4.5,
        review_count: 10,
        tags: [],
        specifications: {},
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      // Mock reviews
      const mockReviews = [
        {
          id: 'rev_001',
          product_id: 'prod_001',
          customer_id: 'cust_001',
          rating: 5,
          title: 'Great product',
          content: 'I love this product!',
          verified_purchase: true,
          helpful_votes: 10,
          status: 'APPROVED',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'rev_002',
          product_id: 'prod_001',
          customer_id: 'cust_002',
          rating: 4,
          title: 'Good product',
          content: 'Good but could be better',
          verified_purchase: true,
          helpful_votes: 5,
          status: 'APPROVED',
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        }
      ];

      // Setup mocks
      mockDataService.getProductById.mockResolvedValue(mockProduct);
      mockDataService.getReviewsByProductId.mockResolvedValue(mockReviews);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/products/prod_001/reviews');

      // Call the handler
      const response = await GET(request, mockParams);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getProductById).toHaveBeenCalledWith('prod_001');
      expect(mockDataService.getReviewsByProductId).toHaveBeenCalledWith('prod_001');
      expect(responseData.data).toEqual(mockReviews);
      expect(responseData.meta.total).toBe(2);
      expect(responseData.meta.page).toBe(1);
      expect(responseData.meta.limit).toBe(20);
    });

    it('should return 404 if product not found', async () => {
      // Setup mocks
      mockDataService.getProductById.mockResolvedValue(null);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/products/invalid_id/reviews');

      // Call the handler
      const response = await GET(request, { params: { productId: 'invalid_id' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getProductById).toHaveBeenCalledWith('invalid_id');
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('NOT_FOUND');
    });

    it('should filter reviews by status', async () => {
      // Mock product
      const mockProduct = { id: 'prod_001', name: 'Test Product' };

      // Mock reviews
      const mockReviews = [
        {
          id: 'rev_001',
          product_id: 'prod_001',
          customer_id: 'cust_001',
          rating: 5,
          title: 'Great product',
          content: 'I love this product!',
          verified_purchase: true,
          helpful_votes: 10,
          status: 'APPROVED',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'rev_002',
          product_id: 'prod_001',
          customer_id: 'cust_002',
          rating: 4,
          title: 'Good product',
          content: 'Good but could be better',
          verified_purchase: true,
          helpful_votes: 5,
          status: 'PENDING',
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        }
      ];

      // Setup mocks
      mockDataService.getProductById.mockResolvedValue(mockProduct);
      mockDataService.getReviewsByProductId.mockResolvedValue(mockReviews);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/products/prod_001/reviews?status=approved');

      // Call the handler
      const response = await GET(request, mockParams);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(responseData.data.length).toBe(1);
      expect(responseData.data[0].id).toBe('rev_001');
      expect(responseData.meta.total).toBe(1);
    });
  });

  describe('POST /api/products/:productId/reviews', () => {
    it('should create a new review', async () => {
      // Mock product
      const mockProduct = { id: 'prod_001', name: 'Test Product' };
      
      // Mock reviews
      const mockReviews = [];

      // Setup mocks
      mockDataService.getProductById.mockResolvedValue(mockProduct);
      mockDataService.getReviews.mockResolvedValue(mockReviews);

      // Create a mock request
      const requestBody = {
        customer_id: 'cust_001',
        rating: 5,
        title: 'Amazing product',
        content: 'This product exceeded my expectations!',
        verified_purchase: true
      };

      const request = new NextRequest('http://localhost:3000/api/products/prod_001/reviews', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await POST(request, mockParams);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getProductById).toHaveBeenCalledWith('prod_001');
      expect(mockDataService.getReviews).toHaveBeenCalled();
      expect(responseData.data.product_id).toBe('prod_001');
      expect(responseData.data.customer_id).toBe('cust_001');
      expect(responseData.data.rating).toBe(5);
      expect(responseData.data.title).toBe('Amazing product');
      expect(responseData.data.status).toBe('PENDING');
      expect(responseData.data.id).toBeDefined();
    });

    it('should return 404 if product not found', async () => {
      // Setup mocks
      mockDataService.getProductById.mockResolvedValue(null);

      // Create a mock request
      const requestBody = {
        customer_id: 'cust_001',
        rating: 5,
        content: 'This product is great!'
      };

      const request = new NextRequest('http://localhost:3000/api/products/invalid_id/reviews', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await POST(request, { params: { productId: 'invalid_id' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getProductById).toHaveBeenCalledWith('invalid_id');
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('NOT_FOUND');
    });

    it('should validate required fields', async () => {
      // Mock product
      const mockProduct = { id: 'prod_001', name: 'Test Product' };

      // Setup mocks
      mockDataService.getProductById.mockResolvedValue(mockProduct);

      // Create a mock request with missing fields
      const requestBody = {
        title: 'Great product'
      };

      const request = new NextRequest('http://localhost:3000/api/products/prod_001/reviews', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await POST(request, mockParams);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('VALIDATION_ERROR');
      expect(responseData.error.details.required_fields).toContain('customer_id');
      expect(responseData.error.details.required_fields).toContain('rating');
      expect(responseData.error.details.required_fields).toContain('content');
    });

    it('should validate rating range', async () => {
      // Mock product
      const mockProduct = { id: 'prod_001', name: 'Test Product' };

      // Setup mocks
      mockDataService.getProductById.mockResolvedValue(mockProduct);

      // Create a mock request with invalid rating
      const requestBody = {
        customer_id: 'cust_001',
        rating: 6, // Rating should be 1-5
        content: 'This product is great!'
      };

      const request = new NextRequest('http://localhost:3000/api/products/prod_001/reviews', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await POST(request, mockParams);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('VALIDATION_ERROR');
      expect(responseData.error.details.field).toBe('rating');
      expect(responseData.error.details.allowed_range).toBe('1-5');
    });
  });
}); 