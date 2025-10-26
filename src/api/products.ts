import { apiClient } from './client';
import { ApiProduct, Category } from '../types';

export class ProductsService {
  private productsCache: ApiProduct[] | null = null;

  async getFavoriteProducts(): Promise<ApiProduct[]> {
    const response: ApiProduct[] = await apiClient.get<ApiProduct[]>('/products/favorites');
    return response;
  }

  async getProductsByCategory(category: Category): Promise<ApiProduct[]> {
    const allProducts: ApiProduct[] = await this.getAllProducts();
    return allProducts.filter((product: ApiProduct): boolean => product.category === category);
  }

  async getAllProducts(): Promise<ApiProduct[]> {
    if (this.productsCache) {
      return this.productsCache;
    }
    
    const response: ApiProduct[] = await apiClient.get<ApiProduct[]>('/products');
    this.productsCache = response;
    return response;
  }

  async getProductById(id: number): Promise<ApiProduct> {
    const response: ApiProduct = await apiClient.get<ApiProduct>(`/products/${id}`);
    return response;
  }
}

export const productsService = new ProductsService();

