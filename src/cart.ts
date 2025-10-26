// Import CSS files
import './styles/normalize.css';
import './styles/variables.css';
import './styles/base.css';
import './styles/header.css';
import './styles/burger.css';
import './styles/footer.css';
import './styles/responsive.css';

import { cartService, CartItem, ordersService } from './api';

class CartPage {
  private cartItemsContainer: HTMLElement | null;
  private cartTotalElement: HTMLElement | null;
  private authSectionElement: HTMLElement | null;
  private notification: HTMLElement | null = null;

  constructor() {
    this.cartItemsContainer = document.getElementById('cartItems');
    this.cartTotalElement = document.getElementById('cartTotal');
    this.authSectionElement = document.getElementById('authSection');
    
    this.createNotification();
    this.updateCartIcon();
    this.render();
  }

  private createNotification(): void {
    this.notification = document.createElement('div');
    this.notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #dc3545;
      color: white;
      padding: 15px 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      display: none;
      font-size: 16px;
      font-weight: 500;
    `;
    document.body.appendChild(this.notification);
  }

  private showNotification(message: string): void {
    if (this.notification) {
      this.notification.textContent = message;
      this.notification.style.display = 'block';
      setTimeout(() => {
        if (this.notification) {
          this.notification.style.display = 'none';
        }
      }, 3000);
    }
  }

  private formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  private formatAdditives(additives: string[]): string {
    return additives.join(', ') || 'None';
  }

  private renderCartItem(item: CartItem): HTMLElement {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.style.cssText = `
      display: flex;
      gap: 20px;
      padding: 20px;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      margin-bottom: 15px;
    `;

    const image = document.createElement('img');
    image.src = item.productImage;
    image.alt = item.productName;
    image.style.cssText = `
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    `;

    const details = document.createElement('div');
    details.style.flex = '1';

    const name = document.createElement('h3');
    name.textContent = item.productName;
    name.style.margin = '0 0 10px 0';

    const size = document.createElement('p');
    size.textContent = `Size: ${item.size} (${item.volume})`;
    size.style.margin = '5px 0';

    const additives = document.createElement('p');
    additives.textContent = `Additives: ${this.formatAdditives(item.additives)}`;
    additives.style.margin = '5px 0';

    const price = document.createElement('p');
    const itemPrice = item.discountPrice || item.price;
    if (item.discountPrice) {
      price.innerHTML = `<span style="text-decoration: line-through; color: #999;">${this.formatPrice(item.price)}</span> <span style="color: #dc3545; font-weight: bold;">${this.formatPrice(item.discountPrice)}</span>`;
    } else {
      price.textContent = this.formatPrice(itemPrice);
    }
    price.style.margin = '5px 0';
    price.style.fontWeight = 'bold';

    const quantity = document.createElement('p');
    quantity.textContent = `Quantity: ${item.quantity}`;
    quantity.style.margin = '5px 0';

    details.appendChild(name);
    details.appendChild(size);
    details.appendChild(additives);
    details.appendChild(price);
    details.appendChild(quantity);

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '🗑️';
    removeBtn.style.cssText = `
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 18px;
    `;
    removeBtn.addEventListener('click', () => this.removeItem(item));

    cartItem.appendChild(image);
    cartItem.appendChild(details);
    cartItem.appendChild(removeBtn);

    return cartItem;
  }

  private removeItem(item: CartItem): void {
    cartService.removeItem(item.productId, item.size, item.additives);
    this.render();
    this.updateCartIcon();
  }

  private renderCartItems(): void {
    if (!this.cartItemsContainer) return;

    const cart = cartService.getCart();
    
    if (cart.items.length === 0) {
      this.cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Cart is empty</p>';
      if (this.cartTotalElement) {
        this.cartTotalElement.textContent = this.formatPrice(0);
      }
      return;
    }

    this.cartItemsContainer.innerHTML = '';
    
    cart.items.forEach((item: CartItem): void => {
      const cartItemElement: HTMLElement = this.renderCartItem(item);
      this.cartItemsContainer?.appendChild(cartItemElement);
    });

    if (this.cartTotalElement) {
      const totalPrice: number = cartService.getTotalPrice();
      this.cartTotalElement.textContent = this.formatPrice(totalPrice);
    }
  }

  private renderAuthSection(): void {
    if (!this.authSectionElement) return;

    const isAuthenticated: boolean = cartService.isAuthenticated();
    const cart = cartService.getCart();

    if (cart.items.length === 0) {
      this.authSectionElement.innerHTML = '';
      return;
    }

    if (!isAuthenticated) {
      this.authSectionElement.innerHTML = `
        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <p style="margin-bottom: 15px;">Please login to complete your order:</p>
          <div style="display: flex; gap: 10px;">
            <button id="loginBtn" style="flex: 1; padding: 15px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">Login</button>
            <button id="registerBtn" style="flex: 1; padding: 15px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">Register</button>
          </div>
        </div>
      `;

      document.getElementById('loginBtn')?.addEventListener('click', () => {
        cartService.setUserId('user_' + Date.now());
        this.render();
        this.updateCartIcon();
      });

      document.getElementById('registerBtn')?.addEventListener('click', () => {
        cartService.setUserId('user_' + Date.now());
        this.render();
        this.updateCartIcon();
      });
    } else {
      this.authSectionElement.innerHTML = `
        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Delivery Address:</label>
            <input type="text" id="deliveryAddress" placeholder="Enter delivery address" style="width: 100%; padding: 10px; border: 1px solid #dee2e6; border-radius: 4px; font-size: 16px;">
          </div>
          <button id="confirmOrderBtn" style="width: 100%; padding: 15px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">Confirm Order</button>
        </div>
      `;

      document.getElementById('confirmOrderBtn')?.addEventListener('click', () => this.confirmOrder());
    }
  }

  private async confirmOrder(): Promise<void> {
    const addressInput = document.getElementById('deliveryAddress') as HTMLInputElement;
    
    if (!addressInput || !addressInput.value.trim()) {
      this.showNotification('Please enter delivery address');
      return;
    }

    try {
      this.showLoading();
      
      const cart = cartService.getCart();
      const userId = cartService.getUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const order = {
        userId,
        items: cart.items,
        totalPrice: cartService.getTotalPrice(),
        discountPrice: cart.items.some(item => item.discountPrice) 
          ? cartService.getTotalPrice() * 0.95 // 5% discount
          : undefined,
        deliveryAddress: addressInput.value
      };

      await ordersService.createOrder(order);
      
      this.hideLoading();
      cartService.clearCart();
      this.updateCartIcon();
      
      this.showSuccessMessage();
    } catch (error) {
      console.error('Error confirming order:', error);
      this.hideLoading();
      this.showNotification('Something went wrong. Please try again');
    }
  }

  private showLoading(): void {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    loadingOverlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 8px; text-align: center;">
        <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #6c757d; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 20px; color: #6c757d; font-size: 16px;">Processing order...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
  }

  private hideLoading(): void {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.remove();
    }
  }

  private showSuccessMessage(): void {
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #28a745;
      color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    `;
    successMessage.innerHTML = `
      <p>Thank you for your order!</p>
      <p style="margin-top: 10px; font-size: 14px; font-weight: normal;">Our manager will contact you shortly</p>
      <button style="margin-top: 20px; padding: 10px 30px; background: white; color: #28a745; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;" onclick="window.location.href='index.html'">Return to Home</button>
    `;
    document.body.appendChild(successMessage);
  }

  private updateCartIcon(): void {
    const badge: HTMLElement | null = document.querySelector('.cart-badge');
    const totalItems: number = cartService.getTotalItems();
    
    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems.toString();
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  private render(): void {
    this.renderCartItems();
    this.renderAuthSection();
  }
}

// Initialize cart page
new CartPage();

