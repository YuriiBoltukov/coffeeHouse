import { productsService, ApiProduct, Category } from '../api';
import { menuTabsService } from './menu-tabs';

export class ApiMenuService {
  private productsContainer: HTMLElement | null;
  private loading: HTMLElement | null;

  constructor() {
    this.productsContainer = document.querySelector('.menu__grid');
    this.loading = document.querySelector('.menu__loading');
    this.setupCategoryHandler();
  }

  private setupCategoryHandler(): void {
    menuTabsService.onCategoryChange = (category: Category): void => {
      this.loadProducts(category);
    };
  }

  private showLoading(): void {
    if (this.loading) {
      this.loading.style.display = 'block';
    }
    if (this.productsContainer) {
      this.productsContainer.style.opacity = '0.5';
    }
  }

  private hideLoading(): void {
    if (this.loading) {
      this.loading.style.display = 'none';
    }
    if (this.productsContainer) {
      this.productsContainer.style.opacity = '1';
    }
  }

  private convertPrice(price: string | number): number {
    if (typeof price === 'string') {
      return parseFloat(price);
    }
    return price;
  }

  private formatPrice(price: string | number): string {
    const priceNum = this.convertPrice(price);
    return `$${priceNum.toFixed(2)}`;
  }

  private getImageUrl(product: ApiProduct): string {
    // Fallback to local images if API doesn't provide image URL
    if (product.image) {
      return product.image;
    }
    
    // Map product ID to local images based on category
    let imageId: number;
    
    if (product.category === Category.COFFEE) {
      imageId = (product.id % 8) + 1;
      return `assets/images/coffee-${imageId}.jpg`;
    } else if (product.category === Category.TEA) {
      imageId = (product.id % 4) + 1;
      return `assets/images/tea-${imageId}.png`;
    } else {
      imageId = (product.id % 8) + 1;
      return `assets/images/dessert-${imageId}.png`;
    }
  }

  private createProductCard(product: ApiProduct): HTMLElement {
    const card: HTMLElement = document.createElement('div');
    card.className = 'menu__card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-product-id', product.id.toString());

    const image: HTMLImageElement = document.createElement('img');
    image.className = 'menu__card-image';
    image.src = this.getImageUrl(product);
    image.alt = product.name;
    image.loading = 'lazy';

    const content: HTMLElement = document.createElement('div');
    content.className = 'menu__card-content';

    const title: HTMLElement = document.createElement('h3');
    title.className = 'menu__card-title';
    title.textContent = product.name;

    const description: HTMLElement = document.createElement('p');
    description.className = 'menu__card-description';
    description.textContent = product.description;

    const priceContainer: HTMLElement = document.createElement('div');
    priceContainer.style.display = 'flex';
    priceContainer.style.flexDirection = 'column';
    priceContainer.style.gap = '4px';
    
    if (product.discountPrice) {
      const originalPrice: HTMLElement = document.createElement('span');
      originalPrice.className = 'menu__card-price';
      originalPrice.textContent = this.formatPrice(product.price);
      originalPrice.style.textDecoration = 'line-through';
      originalPrice.style.color = '#999';
      originalPrice.style.fontSize = '14px';
      
      const discountPrice: HTMLElement = document.createElement('span');
      discountPrice.className = 'menu__card-price';
      discountPrice.textContent = this.formatPrice(product.discountPrice);
      discountPrice.style.color = '#dc3545';
      discountPrice.style.fontWeight = 'bold';
      
      priceContainer.appendChild(originalPrice);
      priceContainer.appendChild(discountPrice);
    } else {
      const price: HTMLElement = document.createElement('span');
      price.className = 'menu__card-price';
      price.textContent = this.formatPrice(product.price);
      priceContainer.appendChild(price);
    }

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(priceContainer);

    card.appendChild(image);
    card.appendChild(content);

    return card;
  }

  private renderProducts(products: ApiProduct[]): void {
    if (!this.productsContainer) return;

    this.productsContainer.innerHTML = '';
    products.forEach((product: ApiProduct): void => {
      const card: HTMLElement = this.createProductCard(product);
      this.productsContainer?.appendChild(card);
    });
  }

  async loadProducts(category: Category): Promise<void> {
    try {
      this.showLoading();
      const products: ApiProduct[] = await productsService.getProductsByCategory(category);
      this.renderProducts(products);
      this.hideLoading();
    } catch (error) {
      console.error('Error loading products:', error);
      this.showError();
    }
  }

  async loadAllProducts(): Promise<void> {
    try {
      this.showLoading();
      const products: ApiProduct[] = await productsService.getAllProducts();
      this.renderProducts(products);
      this.hideLoading();
    } catch (error) {
      console.error('Error loading products:', error);
      this.showError();
    }
  }

  private showError(): void {
    this.hideLoading();
    
    if (this.loading) {
      this.loading.innerHTML = `
                <div style="color: #dc3545; font-size: 18px; margin-bottom: 10px;">Something went wrong.</div>
                <div style="color: #6c757d; font-size: 14px;">Please refresh the page</div>
      `;
      this.loading.style.display = 'block';
    }
  }

  async init(): Promise<void> {
    await this.loadProducts(Category.COFFEE);
  }
}

export const apiMenuService = new ApiMenuService();

