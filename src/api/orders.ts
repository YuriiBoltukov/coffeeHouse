import { apiClient } from './client';
import { Order, OrderResponse } from '../types/cart';

export class OrdersService {
  async createOrder(order: Order): Promise<OrderResponse> {
    try {
      const response: OrderResponse = await apiClient.post<OrderResponse>('/orders', order);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}

export const ordersService = new OrdersService();

