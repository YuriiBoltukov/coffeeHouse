import { productsService, ApiProduct, Category, Size, CoffeeAdditive, TeaAdditive, DessertAdditive, cartService, CartItem } from '../api';

interface SizeData {
  size: Size;
  volume: string;
  text: string;
}

interface AdditiveData {
  additive: string;
  name: string;
  text: string;
  label: string;
}

interface ModalState {
  basePrice: number;
  currentCategory: Category;
  currentProduct: ApiProduct | null;
}

interface SizePrice {
  [Size.SMALL]: number;
  [Size.MEDIUM]: number;
  [Size.LARGE]: number;
}

const sizePrices: SizePrice = {
  [Size.SMALL]: 0,
  [Size.MEDIUM]: 0.5,
  [Size.LARGE]: 1.0
};

const additivePrice: number = 0.5;

export class ApiModalService {
  private modal: HTMLElement | null;
  private modalImage: HTMLImageElement | null;
  private modalTitle: HTMLElement | null;
  private modalDescription: HTMLElement | null;
  private modalPrice: HTMLElement | null;
  private closeModalBtn: HTMLElement | null;
  private backdrop: HTMLElement | null;
  private sizeOptions: HTMLElement | null;
  private additiveOptions: HTMLElement | null;
  private modalOverlay: HTMLElement | null;
  private notification: HTMLElement | null = null;
  
  private state: ModalState;

  constructor() {
    this.modal = document.getElementById('productModal');
    this.modalImage = document.getElementById('modalImage') as HTMLImageElement | null;
    this.modalTitle = document.getElementById('modalTitle');
    this.modalDescription = document.getElementById('modalDescription');
    this.modalPrice = document.getElementById('modalPrice');
    this.closeModalBtn = document.querySelector('.modal__close-btn');
    this.backdrop = document.querySelector('.modal__backdrop');
    this.sizeOptions = document.querySelector('.modal__size-options');
    this.additiveOptions = document.querySelector('.modal__additives-options');
    this.modalOverlay = document.querySelector('.modal__overlay');
    
    this.state = {
      basePrice: 0,
      currentCategory: Category.COFFEE,
      currentProduct: null
    };

    this.createNotificationElement();
    this.initEventListeners();
  }

  private createNotificationElement(): void {
    this.notification = document.createElement('div');
    this.notification.className = 'notification';
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
    this.notification.textContent = 'Something went wrong. Please try again';
    document.body.appendChild(this.notification);
  }

  private showNotification(): void {
    if (this.notification) {
      this.notification.style.display = 'block';
      setTimeout(() => {
        if (this.notification) {
          this.notification.style.display = 'none';
        }
      }, 3000);
    }
  }

  private showLoading(): void {
    if (this.modalOverlay) {
      this.modalOverlay.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px;">
          <div class="spinner" style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #6c757d; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 20px; color: #6c757d; font-size: 16px;">Загрузка продукта...</p>
        </div>
      `;
      this.modalOverlay.style.display = 'flex';
    }
  }

  private hideLoading(): void {
    if (this.modalOverlay) {
      this.modalOverlay.style.display = 'none';
    }
  }

  private formatPrice(price: string | number): string {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    return `$${priceNum.toFixed(2)}`;
  }

  private getDisplayPrice(product: ApiProduct): { original: string; discounted?: string } {
    if (product.discountPrice) {
      return {
        original: this.formatPrice(product.price),
        discounted: this.formatPrice(product.discountPrice)
      };
    }
    return { original: this.formatPrice(product.price) };
  }

  private updateSizeOptions(category: Category): void {
    const sizes: Record<Category, SizeData[]> = {
      [Category.COFFEE]: [
        { size: Size.SMALL, volume: '200ml', text: 'S 200ml' },
        { size: Size.MEDIUM, volume: '300ml', text: 'M 300ml' },
        { size: Size.LARGE, volume: '400ml', text: 'L 400ml' }
      ],
      [Category.TEA]: [
        { size: Size.SMALL, volume: '200ml', text: 'S 200ml' },
        { size: Size.MEDIUM, volume: '300ml', text: 'M 300ml' },
        { size: Size.LARGE, volume: '400ml', text: 'L 400ml' }
      ],
      [Category.DESSERT]: [
        { size: Size.SMALL, volume: '50g', text: 'S 50g' },
        { size: Size.MEDIUM, volume: '100g', text: 'M 100g' },
        { size: Size.LARGE, volume: '200g', text: 'L 200g' }
      ]
    };

    if (!this.sizeOptions) return;

    this.sizeOptions.innerHTML = '';
    
    sizes[category].forEach((sizeData: SizeData, index: number): void => {
      const button: HTMLButtonElement = document.createElement('button');
      button.className = `modal__size-btn ${index === 0 ? 'is-active' : ''}`;
      button.setAttribute('data-size', sizeData.size);
      button.setAttribute('data-volume', sizeData.volume);
      
      const tooltip = `+${this.formatPrice(sizePrices[sizeData.size])}`;
      button.title = tooltip;
      
      const icon: HTMLSpanElement = document.createElement('span');
      icon.className = 'modal__size-icon';
      icon.textContent = sizeData.size;
      
      const label: HTMLSpanElement = document.createElement('span');
      label.textContent = sizeData.volume;
      
      button.appendChild(icon);
      button.appendChild(label);
      this.sizeOptions?.appendChild(button);
    });
  }

  private updateAdditiveOptions(category: Category): void {
    const additives: Record<Category, AdditiveData[]> = {
      [Category.COFFEE]: [
        { additive: '1', name: CoffeeAdditive.SUGAR, text: '1', label: 'Sugar' },
        { additive: '2', name: CoffeeAdditive.CINNAMON, text: '2', label: 'Cinnamon' },
        { additive: '3', name: CoffeeAdditive.SYRUP, text: '3', label: 'Syrup' }
      ],
      [Category.TEA]: [
        { additive: '1', name: TeaAdditive.SUGAR, text: '1', label: 'Sugar' },
        { additive: '2', name: TeaAdditive.LEMON, text: '2', label: 'Lemon' },
        { additive: '3', name: TeaAdditive.SYRUP, text: '3', label: 'Syrup' }
      ],
      [Category.DESSERT]: [
        { additive: '1', name: DessertAdditive.BERRIES, text: '1', label: 'Berries' },
        { additive: '2', name: DessertAdditive.NUTS, text: '2', label: 'Nuts' },
        { additive: '3', name: DessertAdditive.JAM, text: '3', label: 'Jam' }
      ]
    };

    if (!this.additiveOptions) return;

    this.additiveOptions.innerHTML = '';
    
    additives[category].forEach((additiveData: AdditiveData): void => {
      const button: HTMLButtonElement = document.createElement('button');
      button.className = 'modal__additive-btn';
      button.setAttribute('data-additive', additiveData.additive);
      button.setAttribute('data-name', additiveData.name);
      
      const tooltip = `+${this.formatPrice(additivePrice)}`;
      button.title = tooltip;
      
      const icon: HTMLSpanElement = document.createElement('span');
      icon.className = 'modal__additive-icon';
      icon.textContent = additiveData.text;
      
      const label: HTMLSpanElement = document.createElement('span');
      label.textContent = additiveData.label;
      
      button.appendChild(icon);
      button.appendChild(label);
      this.additiveOptions?.appendChild(button);
    });
  }

  private async openModal(productId: number): Promise<void> {
    if (!this.modal || !this.modalImage || !this.modalTitle || !this.modalDescription || !this.modalPrice) return;

    try {
      this.showLoading();
      
      const product: ApiProduct = await productsService.getProductById(productId);
      
      const category: Category = product.category as Category;
      const prices = this.getDisplayPrice(product);
      
      this.state.currentProduct = product;
      this.state.currentCategory = category;
      this.state.basePrice = parseFloat(typeof product.price === 'string' ? product.price : product.price.toString());
      
      this.modalImage.src = this.getImageUrl(product);
      this.modalImage.alt = product.name;
      this.modalTitle.textContent = product.name;
      this.modalDescription.textContent = product.description;
      
      if (prices.discounted) {
        this.modalPrice.innerHTML = `
          <span style="text-decoration: line-through; color: #999; font-size: 14px;">${prices.original}</span>
          <span style="color: #dc3545; font-weight: bold;">${prices.discounted}</span>
        `;
      } else {
        this.modalPrice.textContent = prices.original;
      }
      
      this.updateSizeOptions(category);
      this.updateAdditiveOptions(category);
      
      this.modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      
      this.hideLoading();
    } catch (error) {
      console.error('Error loading product:', error);
      this.hideLoading();
      this.showNotification();
    }
  }

  private getImageUrl(product: ApiProduct): string {
    if (product.image) {
      return product.image;
    }
    
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

  private closeModal(): void {
    if (!this.modal || !this.modalPrice) return;

    this.modal.classList.remove('is-open');
    document.body.style.overflow = '';
    
    if (this.sizeOptions) {
      const sizeButtons = this.sizeOptions.querySelectorAll('.modal__size-btn');
      const additiveButtons = this.additiveOptions?.querySelectorAll('.modal__additive-btn');
      
      sizeButtons.forEach(btn => btn.classList.remove('is-active'));
      if (sizeButtons[0]) sizeButtons[0].classList.add('is-active');
      
      additiveButtons?.forEach(btn => btn.classList.remove('is-active'));
    }
    
    if (this.modalPrice) {
      const prices = this.getDisplayPrice(this.state.currentProduct!);
      if (prices.discounted) {
        this.modalPrice.innerHTML = `<span style="text-decoration: line-through; color: #999;">${prices.original}</span> <span style="color: #dc3545;">${prices.discounted}</span>`;
      } else {
        this.modalPrice.textContent = prices.original;
      }
    }
  }

  private updatePrice(): void {
    if (!this.modalPrice || !this.state.currentProduct) return;

    let totalPrice: number = this.state.basePrice;
    
    if (this.sizeOptions) {
      const activeSize = this.sizeOptions.querySelector('.modal__size-btn.is-active') as HTMLElement | null;
      if (activeSize) {
        const size = activeSize.getAttribute('data-size') as Size | null;
        if (size && sizePrices[size]) {
          totalPrice += sizePrices[size];
        }
      }
    }
    
    if (this.additiveOptions) {
      const activeAdditives = this.additiveOptions.querySelectorAll('.modal__additive-btn.is-active');
      totalPrice += activeAdditives.length * additivePrice;
    }
    
    const displayedPrices = this.getDisplayPrice(this.state.currentProduct);
    
    if (displayedPrices.discounted) {
      const discountedTotal = this.state.basePrice > 0 ? (this.state.basePrice - parseFloat(displayedPrices.original.replace('$', '')) + parseFloat(displayedPrices.discounted!.replace('$', ''))) : this.state.basePrice;
      this.modalPrice.innerHTML = `
        <span style="text-decoration: line-through; color: #999; font-size: 14px;">${this.formatPrice(totalPrice)}</span>
        <span style="color: #dc3545; font-weight: bold;">${this.formatPrice(totalPrice - this.state.basePrice + discountedTotal)}</span>
      `;
    } else {
      this.modalPrice.textContent = this.formatPrice(totalPrice);
    }
  }

  private handleAddToCart(): void {
    if (!this.state.currentProduct) return;

    const activeSizeElement = this.sizeOptions?.querySelector('.modal__size-btn.is-active') as HTMLElement | null;
    const selectedAdditives: HTMLElement[] = Array.from(
      this.additiveOptions?.querySelectorAll('.modal__additive-btn.is-active') || []
    );

    const size: Size = (activeSizeElement?.getAttribute('data-size') as Size) || Size.SMALL;
    const volume: string = activeSizeElement?.getAttribute('data-volume') || '';
    const additives: string[] = selectedAdditives.map(btn => btn.getAttribute('data-name') || '').filter(Boolean);

    const cartItem: CartItem = {
      productId: this.state.currentProduct.id,
      productName: this.state.currentProduct.name,
      productImage: this.getImageUrl(this.state.currentProduct),
      category: this.state.currentCategory,
      price: this.state.basePrice,
      discountPrice: this.state.currentProduct.discountPrice 
        ? parseFloat(typeof this.state.currentProduct.discountPrice === 'string' 
          ? this.state.currentProduct.discountPrice 
          : this.state.currentProduct.discountPrice.toString())
        : undefined,
      size,
      volume,
      additives,
      quantity: 1
    };

    cartService.addItem(cartItem);
    this.closeModal();
  }

  private initEventListeners(): void {
    document.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.menu__card');
      if (card) {
        const cardImage = card.querySelector('.menu__card-image') as HTMLElement;
        if (cardImage) {
          const cardId = card.getAttribute('data-product-id');
          if (cardId) {
            this.openModal(parseInt(cardId));
          }
        }
      }
    });

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.closeModal());
    }

    if (this.sizeOptions) {
      this.sizeOptions.addEventListener('click', (e) => {
        const button = (e.target as HTMLElement).closest('.modal__size-btn') as HTMLElement | null;
        if (button && this.sizeOptions) {
          const buttons = this.sizeOptions.querySelectorAll('.modal__size-btn');
          buttons.forEach(b => b.classList.remove('is-active'));
          button.classList.add('is-active');
          this.updatePrice();
        }
      });
    }

    if (this.additiveOptions) {
      this.additiveOptions.addEventListener('click', (e) => {
        const button = (e.target as HTMLElement).closest('.modal__additive-btn') as HTMLElement | null;
        if (button) {
          button.classList.toggle('is-active');
          this.updatePrice();
        }
      });
    }

    const addToCartBtn = document.querySelector('.modal__add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.handleAddToCart());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('is-open')) {
        this.closeModal();
      }
    });
  }

  public init(): void {
    // Modal initialized in constructor
  }
}

export const apiModalService = new ApiModalService();

