import { NextRequest } from 'next/server';
import { GET, POST } from '../app/api/products/route';
import DataService from '../lib/data-service';

const mockDataService = DataService as jest.Mocked<typeof DataService>;

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Mock data
      const mockProducts = [
        {
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
        },
        {
          id: 'prod_002',
          name: 'Test Product 2',
          description: 'Test description 2',
          price: { amount: 199.99, currency: 'USD' },
          in_stock: true,
          stock_quantity: 5,
          images: [],
          attributes: {},
          category: 'Test Category',
          brand: 'Test Brand',
          rating: 4.0,
          review_count: 5,
          tags: [],
          specifications: {},
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        }
      ];

      // Setup mocks
      mockDataService.getProducts.mockResolvedValue(mockProducts);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/products');

      // Call the handler
      const response = await GET(request);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getProducts).toHaveBeenCalled();
      expect(responseData.data).toEqual(mockProducts);
      expect(responseData.meta.total).toBe(2);
      expect(responseData.meta.page).toBe(1);
      expect(responseData.meta.limit).toBe(20);
    });

    it('should filter products by category', async () => {
      // Mock data
      const mockProducts = [
        {
          id: 'prod_001',
          name: 'Test Product 1',
          description: 'Test description 1',
          price: { amount: 99.99, currency: 'USD' },
          in_stock: true,
          stock_quantity: 10,
          images: [],
          attributes: {},
          category: 'Electronics',
          brand: 'Test Brand',
          rating: 4.5,
          review_count: 10,
          tags: [],
          specifications: {},
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'prod_002',
          name: 'Test Product 2',
          description: 'Test description 2',
          price: { amount: 199.99, currency: 'USD' },
          in_stock: true,
          stock_quantity: 5,
          images: [],
          attributes: {},
          category: 'Clothing',
          brand: 'Test Brand',
          rating: 4.0,
          review_count: 5,
          tags: [],
          specifications: {},
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        }
      ];

      // Setup mocks
      mockDataService.getProducts.mockResolvedValue(mockProducts);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/products?category=Electronics');

      // Call the handler
      const response = await GET(request);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getProducts).toHaveBeenCalled();
      expect(responseData.data.length).toBe(1);
      expect(responseData.data[0].id).toBe('prod_001');
      expect(responseData.meta.total).toBe(1);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      // Mock data
      const mockProducts = [];

      // Setup mocks
      mockDataService.getProducts.mockResolvedValue(mockProducts);
      mockDataService.updateProduct.mockResolvedValue(true);

      // Create a mock request with product data
      const requestBody = {
        name: 'New Product',
        description: 'New product description',
        price: { amount: 149.99, currency: 'USD' },
        category: 'Electronics',
        brand: 'New Brand',
        in_stock: true,
        stock_quantity: 20
      };

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await POST(request);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getProducts).toHaveBeenCalled();
      expect(mockDataService.updateProduct).toHaveBeenCalled();
      expect(responseData.data.name).toBe('New Product');
      expect(responseData.data.price.amount).toBe(149.99);
      expect(responseData.data.id).toBeDefined();
    });

    it('should return validation error when required fields are missing', async () => {
      // Create a mock request with missing required fields
      const requestBody = {
        description: 'New product description',
        brand: 'New Brand'
      };

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await POST(request);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('VALIDATION_ERROR');
      expect(responseData.error.details.required_fields).toContain('name');
      expect(responseData.error.details.required_fields).toContain('price');
      expect(responseData.error.details.required_fields).toContain('category');
    });
  });
}); 