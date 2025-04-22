// Base entity types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface Address {
  id: string;
  type: 'SHIPPING' | 'BILLING';
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

// Product related types
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: Money;
  in_stock: boolean;
  stock_quantity: number;
  images: string[];
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    weight?: string;
    [key: string]: string | undefined;
  };
  category: string;
  brand: string;
  rating: number;
  review_count: number;
  tags: string[];
  specifications: Record<string, string>;
}

// Customer related types
export interface Customer extends BaseEntity {
  email: string;
  name: string;
  phone: string;
  addresses: Address[];
  preferences: {
    language: string;
    currency: string;
    marketing_emails: boolean;
  };
  loyalty_points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

// Order related types
export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: Money;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface Order extends BaseEntity {
  customer_id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  total_amount: Money;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  tracking_number?: string;
  estimated_delivery?: string;
}

// Review related types
export interface Review extends BaseEntity {
  product_id: string;
  customer_id: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified_purchase: boolean;
  helpful_votes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Cart related types
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: Money;
}

export interface Cart extends BaseEntity {
  customer_id?: string;
  items: CartItem[];
  total_amount: Money;
  expires_at: string;
}

// Wishlist related types
export interface WishlistItem extends BaseEntity {
  product_id: string;
  added_at: string;
}

export interface Wishlist extends BaseEntity {
  customer_id: string;
  items: WishlistItem[];
}

// Promotion related types
export interface Promotion extends BaseEntity {
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y';
  value: number;
  start_date: string;
  end_date: string;
  applicable_products: string[];
  min_purchase_amount?: Money;
  max_discount_amount?: Money;
}

// Support related types
export interface SupportTicket extends BaseEntity {
  customer_id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  order_id?: string;
}

export interface FAQ extends BaseEntity {
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export interface Return extends BaseEntity {
  order_id: string;
  customer_id: string;
  items: {
    product_id: string;
    quantity: number;
    reason: string;
  }[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  refund_amount?: Money;
}

// Notification related types
export interface Notification extends BaseEntity {
  customer_id: string;
  type: 'ORDER' | 'PROMOTION' | 'SYSTEM' | 'RETURN';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
} 