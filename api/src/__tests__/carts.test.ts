import { NextRequest } from 'next/server';
import { GET, POST } from '../app/api/carts/route';
import { GET as GET_CART, PUT, DELETE } from '../app/api/carts/[cartId]/route';
import DataService from '../lib/data-service';

const mockDataService = DataService as jest.Mocked<typeof DataService>;

describe('Carts API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/carts', () => {
    it('should return all carts', async () => {
      // Mock data
      const mockCarts = [
        {
          id: 'cart_001',
          customer_id: 'cust_001',
          items: [
            {
              id: 'item_001',
              product_id: 'prod_001',
              quantity: 2,
              price: { amount: 99.99, currency: 'USD' }
            }
          ],
          total_amount: { amount: 199.98, currency: 'USD' },
          expires_at: '2024-04-30T00:00:00Z',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'cart_002',
          customer_id: 'cust_002',
          items: [],
          total_amount: { amount: 0, currency: 'USD' },
          expires_at: '2024-04-30T00:00:00Z',
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        }
      ];

      // Setup mocks
      mockDataService.getCarts.mockResolvedValue(mockCarts);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/carts');

      // Call the handler
      const response = await GET(request);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCarts).toHaveBeenCalled();
      expect(responseData.data).toEqual(mockCarts);
      expect(responseData.meta.total).toBe(2);
    });

    it('should filter carts by customer_id', async () => {
      // Mock data
      const mockCarts = [
        {
          id: 'cart_001',
          customer_id: 'cust_001',
          items: [
            {
              id: 'item_001',
              product_id: 'prod_001',
              quantity: 2,
              price: { amount: 99.99, currency: 'USD' }
            }
          ],
          total_amount: { amount: 199.98, currency: 'USD' },
          expires_at: '2024-04-30T00:00:00Z',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'cart_002',
          customer_id: 'cust_002',
          items: [],
          total_amount: { amount: 0, currency: 'USD' },
          expires_at: '2024-04-30T00:00:00Z',
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        }
      ];

      // Setup mocks
      mockDataService.getCarts.mockResolvedValue(mockCarts);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/carts?customer_id=cust_001');

      // Call the handler
      const response = await GET(request);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCarts).toHaveBeenCalled();
      expect(responseData.data.length).toBe(1);
      expect(responseData.data[0].id).toBe('cart_001');
      expect(responseData.meta.total).toBe(1);
    });
  });

  describe('GET /api/carts/:cartId', () => {
    it('should return a specific cart', async () => {
      // Mock data
      const mockCart = {
        id: 'cart_001',
        customer_id: 'cust_001',
        items: [
          {
            id: 'item_001',
            product_id: 'prod_001',
            quantity: 2,
            price: { amount: 99.99, currency: 'USD' }
          }
        ],
        total_amount: { amount: 199.98, currency: 'USD' },
        expires_at: '2024-04-30T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      // Setup mocks
      mockDataService.getCartById.mockResolvedValue(mockCart);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/carts/cart_001');

      // Call the handler
      const response = await GET_CART(request, { params: { cartId: 'cart_001' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCartById).toHaveBeenCalledWith('cart_001');
      expect(responseData.data).toEqual(mockCart);
    });

    it('should return 404 if cart not found', async () => {
      // Setup mocks
      mockDataService.getCartById.mockResolvedValue(null);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/carts/invalid_id');

      // Call the handler
      const response = await GET_CART(request, { params: { cartId: 'invalid_id' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCartById).toHaveBeenCalledWith('invalid_id');
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/carts', () => {
    it('should create a new cart', async () => {
      // Mock data
      const mockCarts = [];

      // Setup mocks
      mockDataService.getCarts.mockResolvedValue(mockCarts);

      // Create a mock request
      const requestBody = {
        customer_id: 'cust_001'
      };

      const request = new NextRequest('http://localhost:3000/api/carts', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await POST(request);

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCarts).toHaveBeenCalled();
      expect(responseData.data.customer_id).toBe('cust_001');
      expect(responseData.data.items).toEqual([]);
      expect(responseData.data.total_amount).toEqual({ amount: 0, currency: 'USD' });
      expect(responseData.data.id).toBeDefined();
    });
  });

  describe('PUT /api/carts/:cartId', () => {
    it('should update a cart', async () => {
      // Mock data
      const mockCart = {
        id: 'cart_001',
        customer_id: 'cust_001',
        items: [
          {
            id: 'item_001',
            product_id: 'prod_001',
            quantity: 2,
            price: { amount: 99.99, currency: 'USD' }
          }
        ],
        total_amount: { amount: 199.98, currency: 'USD' },
        expires_at: '2024-04-30T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      // Setup mocks
      mockDataService.getCartById.mockResolvedValue(mockCart);

      // Create a mock request
      const requestBody = {
        customer_id: 'cust_001',
        items: [
          {
            id: 'item_001',
            product_id: 'prod_001',
            quantity: 3,
            price: { amount: 99.99, currency: 'USD' }
          }
        ]
      };

      const request = new NextRequest('http://localhost:3000/api/carts/cart_001', {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await PUT(request, { params: { cartId: 'cart_001' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCartById).toHaveBeenCalledWith('cart_001');
      expect(responseData.data.id).toBe('cart_001');
      expect(responseData.data.items[0].quantity).toBe(3);
      expect(responseData.data.total_amount.amount).toBe(299.97);
    });

    it('should return 404 if cart not found for update', async () => {
      // Setup mocks
      mockDataService.getCartById.mockResolvedValue(null);

      // Create a mock request
      const requestBody = {
        items: []
      };

      const request = new NextRequest('http://localhost:3000/api/carts/invalid_id', {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      });

      // Call the handler
      const response = await PUT(request, { params: { cartId: 'invalid_id' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCartById).toHaveBeenCalledWith('invalid_id');
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/carts/:cartId', () => {
    it('should delete a cart', async () => {
      // Mock data
      const mockCart = {
        id: 'cart_001',
        customer_id: 'cust_001',
        items: [],
        total_amount: { amount: 0, currency: 'USD' },
        expires_at: '2024-04-30T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      // Setup mocks
      mockDataService.getCartById.mockResolvedValue(mockCart);
      mockDataService.getCarts.mockResolvedValue([mockCart]);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/carts/cart_001', {
        method: 'DELETE'
      });

      // Call the handler
      const response = await DELETE(request, { params: { cartId: 'cart_001' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCartById).toHaveBeenCalledWith('cart_001');
      expect(responseData.data.id).toBe('cart_001');
      expect(responseData.success).toBe(true);
    });

    it('should return 404 if cart not found for deletion', async () => {
      // Setup mocks
      mockDataService.getCartById.mockResolvedValue(null);

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/carts/invalid_id', {
        method: 'DELETE'
      });

      // Call the handler
      const response = await DELETE(request, { params: { cartId: 'invalid_id' } });

      // Parse the response
      const responseData = await response.json();

      // Assert
      expect(mockDataService.getCartById).toHaveBeenCalledWith('invalid_id');
      expect(responseData.error).toBeDefined();
      expect(responseData.error.code).toBe('NOT_FOUND');
    });
  });
}); 