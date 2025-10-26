import { cartService } from '../api';

export function updateCartIcon(): void {
  const badge: HTMLElement | null = document.querySelector('.cart-badge');
  const totalItems: number = cartService.getTotalItems();
  const isAuthenticated: boolean = cartService.isAuthenticated();
  
  const cartIcon: HTMLElement | null = document.querySelector('.cart-icon');
  
  if (cartIcon) {
    if (isAuthenticated || totalItems > 0) {
      cartIcon.style.display = 'flex';
    } else {
      cartIcon.style.display = 'none';
    }
  }
  
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems.toString();
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

export function initCartIcon(): void {
  updateCartIcon();
  
  // Listen for cart changes
  window.addEventListener('storage', () => {
    updateCartIcon();
  });
}

