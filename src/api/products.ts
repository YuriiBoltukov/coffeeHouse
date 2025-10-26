import { apiClient } from './client';
import { ApiProduct, Category } from '../types';

export class ProductsService {
  async getFavoriteProducts(): Promise<ApiProduct[]> {
    const response: ApiProduct[] = await apiClient.get<ApiProduct[]>('/products/favorites');
    return response;
  }

  async getProductsByCategory(category: Category): Promise<ApiProduct[]> {
    const response: ApiProduct[] = await apiClient.get<ApiProduct[]>(
      `/products/category/${category}`
    );
    return response;
  }

  async getAllProducts(): Promise<ApiProduct[]> {
    const response: ApiProduct[] = await apiClient.get<ApiProduct[]>('/products');
    return response;
  }

  async getProductById(id: number): Promise<ApiProduct> {
    const response: ApiProduct = await apiClient.get<ApiProduct>(`/products/${id}`);
    return response;
  }
}

export const productsService = new ProductsService();

