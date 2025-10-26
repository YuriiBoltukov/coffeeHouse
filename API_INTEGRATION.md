# Backend API Integration Guide

This document describes the TypeScript backend integration for the Coffee Shop application.

## Overview

The application now includes a fully typed API client to connect with the backend at:
**https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api**

## What Was Added

### 1. API Types (`src/types.ts`)

Added comprehensive TypeScript interfaces for API communication:

- **`ApiProduct`** - Product structure with id, name, description, price, category, and image
- **`ApiResponse<T>`** - Generic response wrapper with data, status, and optional message
- **`ApiError`** - Error response structure
- **`ApiConfig`** - Configuration for the API client
- **`FetchOptions`** - Extended Fetch API options

### 2. API Client (`src/api/client.ts`)

Created a reusable API client with:

- Generic `get()` and `post()` methods
- Automatic timeout handling
- Proper error handling with typed errors
- Abort controller for request cancellation

Key features:
- ✅ Generic type safety (`ApiClient<T>`)
- ✅ Timeout support (default: 10 seconds)
- ✅ Automatic error parsing and handling
- ✅ Full TypeScript typing

### 3. Products Service (`src/api/products.ts`)

Service layer for product-related API calls:

- `getFavoriteProducts()` - Fetch favorite products
- `getProductsByCategory(category)` - Get products by category
- `getAllProducts()` - Fetch all products
- `getProductById(id)` - Get single product

### 4. API Menu Service (`src/modules/api-menu.ts`)

Complete integration module for dynamic product rendering:

- Automatically renders products from the API
- Handles loading states
- Integrates with existing tab system
- Creates product cards dynamically
- Supports category filtering

### 5. Configuration (`src/api/config.ts`)

Centralized configuration for API integration:

```typescript
export const appConfig: AppConfig = {
  apiEnabled: true,
  useStaticData: false,
  apiBaseUrl: 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api'
};
```

## Usage Examples

### Basic API Usage

```typescript
import { productsService, Category } from './api';

// Get products
const products = await productsService.getAllProducts();

// Get by category
const coffee = await productsService.getProductsByCategory(Category.COFFEE);

// Get favorites
const favorites = await productsService.getFavoriteProducts();
```

### Dynamic Menu Integration

```typescript
import { apiMenuService } from './modules/api-menu';

// Initialize API-driven menu
await apiMenuService.init();

// Load specific category
await apiMenuService.loadProducts(Category.TEA);

// Load all products
await apiMenuService.loadAllProducts();
```

### Using the API Client Directly

```typescript
import { apiClient } from './api/client';

// GET request
const data = await apiClient.get<User>('/users/1');

// POST request
const newUser = await apiClient.post<User>('/users', { name: 'John' });
```

## Type Safety Features

All API interactions are fully typed:

1. **Generic Types** - `ApiResponse<T>` provides type-safe responses
2. **Enums** - Using `Category` enum for type-safe categories
3. **Interfaces** - All API structures have proper TypeScript interfaces
4. **Return Types** - All functions have explicit return types
5. **Error Handling** - Typed error responses (`ApiError`)

## Integration with Existing Code

The API integration works seamlessly with existing modules:

- **menu-tabs.ts** - Tab functionality now triggers API calls via `menuTabsService`
- **modal.ts** - Uses typed product data
- **types.ts** - Extended with API-specific types

## File Structure

```
src/
├── api/
│   ├── client.ts       # Core API client
│   ├── products.ts     # Products service
│   ├── config.ts       # Configuration
│   ├── index.ts        # Exports
│   └── README.md       # API documentation
├── modules/
│   ├── api-menu.ts     # API menu integration
│   └── menu-tabs.ts    # Updated with API support
└── types.ts            # Extended with API types
```

## Configuration

To enable/disable API or change settings, edit `src/api/config.ts`:

```typescript
export const appConfig: AppConfig = {
  apiEnabled: true,        // Enable/disable API calls
  useStaticData: false,    // Use static HTML instead
  apiBaseUrl: 'your-url'   // Change API endpoint
};
```

## Testing

The build process verifies:
- ✅ TypeScript compilation
- ✅ ESLint validation
- ✅ No unused imports
- ✅ All types are properly defined

Run:
```bash
npm run lint   # Check for linting errors
npm run build  # Build the project
```

## Next Steps

To use the API in your application:

1. Enable API in `src/api/config.ts`
2. Import and initialize the API menu service in `src/index.ts`
3. Products will be fetched automatically from the backend

Example in `src/index.ts`:

```typescript
import { appConfig } from './api';
import { apiMenuService } from './modules';

if (appConfig.apiEnabled) {
  await apiMenuService.init();
}
```

## API Endpoints

The client is configured for these endpoints:

- `GET /products` - Get all products
- `GET /products/favorites` - Get favorite products  
- `GET /products/category/:category` - Get products by category
- `GET /products/:id` - Get single product

## Error Handling

All API errors are caught and typed:

```typescript
try {
  const products = await productsService.getAllProducts();
} catch (error) {
  if (error.status === 0) {
    // Network error
  } else if (error.status === 404) {
    // Not found
  } else {
    // Other error
  }
}
```

