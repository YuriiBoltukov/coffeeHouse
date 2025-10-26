import { Category, Size } from '../types';

export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  category: Category;
  price: number;
  discountPrice?: number;
  size: Size;
  volume: string;
  additives: string[];
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  userId?: string;
}

export interface Order {
  userId: string;
  items: CartItem[];
  totalPrice: number;
  discountPrice?: number;
  deliveryAddress: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

