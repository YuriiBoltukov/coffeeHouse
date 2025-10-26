# API Integration

This directory contains the API client and services for connecting to the backend API.

## Structure

- `client.ts` - Core API client with HTTP methods
- `products.ts` - Products service for fetching product data
- `index.ts` - Exports all API modules

## Usage

### Basic Example

```typescript
import { productsService } from './api';

// Get favorite products
const favorites = await productsService.getFavoriteProducts();

// Get products by category
const coffeeProducts = await productsService.getProductsByCategory(Category.COFFEE);

// Get all products
const allProducts = await productsService.getAllProducts();

// Get product by ID
const product = await productsService.getProductById(1);
```

### Using the API Menu Service

The `ApiMenuService` in `src/modules/api-menu.ts` provides a complete integration for dynamically rendering products from the API.

```typescript
import { apiMenuService } from './modules';

// Initialize and load products
await apiMenuService.init();

// Load products for a specific category
await apiMenuService.loadProducts(Category.COFFEE);

// Load all products
await apiMenuService.loadAllProducts();
```

## API Endpoints

The API client is configured to work with:
- Base URL: `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api`
- Products endpoint: `/products`
- Favorite products: `/products/favorites`
- Products by category: `/products/category/{category}`
- Product by ID: `/products/{id}`

## Configuration

To change the API configuration, modify the `apiClient` instance in `src/api/client.ts`:

```typescript
export const apiClient = new ApiClient({
  baseUrl: 'https://your-api-url.com/api',
  timeout: 10000 // in milliseconds
});
```

## Type Safety

All API responses are fully typed using TypeScript interfaces defined in `src/types.ts`:
- `ApiProduct` - Product data structure
- `ApiResponse<T>` - Generic API response wrapper
- `ApiError` - Error response structure

