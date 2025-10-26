import { CartItem, Cart } from '../types/cart';
import { Size } from '../types';

const CART_STORAGE_KEY = 'coffeeshop_cart';

export class CartService {
  private cart: Cart;

  constructor() {
    this.cart = this.loadCart();
  }

  private loadCart(): Cart {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { items: [] };
    } catch {
      return { items: [] };
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      this.updateCartBadge();
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }

  private updateCartBadge(): void {
    const badge: HTMLElement | null = document.querySelector('.cart-badge');
    const totalItems: number = this.getTotalItems();
    
    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems.toString();
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  addItem(item: CartItem): void {
    const existingItemIndex: number = this.cart.items.findIndex(
      (cartItem: CartItem) =>
        cartItem.productId === item.productId &&
        cartItem.size === item.size &&
        this.arraysEqual(cartItem.additives, item.additives)
    );

    if (existingItemIndex >= 0) {
      this.cart.items[existingItemIndex].quantity += 1;
    } else {
      this.cart.items.push(item);
    }

    this.saveCart();
  }

  removeItem(productId: number, size: Size, additives: string[]): void {
    this.cart.items = this.cart.items.filter(
      (item: CartItem) =>
        !(item.productId === productId &&
          item.size === size &&
          this.arraysEqual(item.additives, additives))
    );
    this.saveCart();
  }

  updateQuantity(productId: number, size: Size, additives: string[], quantity: number): void {
    const item = this.cart.items.find(
      (cartItem: CartItem) =>
        cartItem.productId === productId &&
        cartItem.size === size &&
        this.arraysEqual(cartItem.additives, additives)
    );

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId, size, additives);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  clearCart(): void {
    this.cart.items = [];
    this.saveCart();
  }

  getCart(): Cart {
    return { ...this.cart };
  }

  getTotalItems(): number {
    return this.cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cart.items.reduce((sum: number, item: CartItem) => {
      const itemPrice = item.discountPrice || item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  }

  isAuthenticated(): boolean {
    // Simulated authentication check
    return localStorage.getItem('user_id') !== null;
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  setUserId(userId: string): void {
    localStorage.setItem('user_id', userId);
    this.cart.userId = userId;
    this.saveCart();
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  }
}

export const cartService = new CartService();

