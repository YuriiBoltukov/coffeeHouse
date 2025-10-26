import { SizeData, AdditiveData, Category, Size, CoffeeAdditive, TeaAdditive, DessertAdditive } from '../types';

interface ModalState {
  basePrice: number;
  currentCategory: Category;
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

export function initModal(): void {
  const modal: HTMLElement | null = document.getElementById('productModal');
  const modalImage: HTMLImageElement | null = document.getElementById('modalImage') as HTMLImageElement | null;
  const modalTitle: HTMLElement | null = document.getElementById('modalTitle');
  const modalDescription: HTMLElement | null = document.getElementById('modalDescription');
  const modalPrice: HTMLElement | null = document.getElementById('modalPrice');
  const closeModalBtn: HTMLElement | null = document.querySelector('.modal__close-btn');
  const backdrop: HTMLElement | null = document.querySelector('.modal__backdrop');
  const sizeOptions: HTMLElement | null = document.querySelector('.modal__size-options');
  const additiveOptions: HTMLElement | null = document.querySelector('.modal__additives-options');

  if (!modal || !modalImage || !modalTitle || !modalDescription || !modalPrice) return;

  const state: ModalState = {
    basePrice: 0,
    currentCategory: Category.COFFEE
  };

  function updateSizeOptions(category: Category): void {
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

    if (!sizeOptions) return;

    sizeOptions.innerHTML = '';
    sizes[category].forEach((sizeData: SizeData, index: number): void => {
      const button: HTMLButtonElement = document.createElement('button');
      button.className = `modal__size-btn ${index === 0 ? 'is-active' : ''}`;
      button.setAttribute('data-size', sizeData.size);
      button.setAttribute('data-volume', sizeData.volume);
      
      const icon: HTMLSpanElement = document.createElement('span');
      icon.className = 'modal__size-icon';
      icon.textContent = sizeData.size;
      
      const label: HTMLSpanElement = document.createElement('span');
      label.textContent = sizeData.volume;
      
      button.appendChild(icon);
      button.appendChild(label);
      sizeOptions.appendChild(button);
    });
  }

  function updateAdditiveOptions(category: Category): void {
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

    if (!additiveOptions) return;

    additiveOptions.innerHTML = '';
    additives[category].forEach((additiveData: AdditiveData): void => {
      const button: HTMLButtonElement = document.createElement('button');
      button.className = 'modal__additive-btn';
      button.setAttribute('data-additive', additiveData.additive);
      button.setAttribute('data-name', additiveData.name);
      
      const icon: HTMLSpanElement = document.createElement('span');
      icon.className = 'modal__additive-icon';
      icon.textContent = additiveData.text;
      
      const label: HTMLSpanElement = document.createElement('span');
      label.textContent = additiveData.label;
      
      button.appendChild(icon);
      button.appendChild(label);
      additiveOptions.appendChild(button);
    });
  }

  function openModal(card: Element): void {
    const image: HTMLImageElement | null = card.querySelector('.menu__card-image');
    const title: Element | null = card.querySelector('.menu__card-title');
    const description: Element | null = card.querySelector('.menu__card-description');
    const price: Element | null = card.querySelector('.menu__card-price');

    if (!image || !title || !description || !price) return;
    if (!modalImage || !modalTitle || !modalDescription || !modalPrice || !modal) return;

    const category: Category | null = card.getAttribute('data-category') as Category | null;
    if (category && (category === Category.COFFEE || category === Category.TEA || category === Category.DESSERT)) {
      state.currentCategory = category;
    }

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = title.textContent || '';
    modalDescription.textContent = description.textContent || '';
    modalPrice.textContent = price.textContent || '$0.00';
    
    const priceText: string = price.textContent || '0';
    state.basePrice = parseFloat(priceText.replace('$', ''));
    
    updateSizeOptions(state.currentCategory);
    updateAdditiveOptions(state.currentCategory);
    
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(): void {
    if (!modal || !modalPrice) return;

    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    
    if (sizeOptions) {
      const sizeButtons: NodeListOf<HTMLElement> = sizeOptions.querySelectorAll('.modal__size-btn');
      const additiveButtons: NodeListOf<HTMLElement> | undefined = additiveOptions?.querySelectorAll('.modal__additive-btn');
      
      sizeButtons.forEach((btn: HTMLElement): void => btn.classList.remove('is-active'));
      if (sizeButtons[0]) sizeButtons[0].classList.add('is-active');
      
      additiveButtons?.forEach((btn: HTMLElement): void => btn.classList.remove('is-active'));
    }
    
    modalPrice.textContent = `$${state.basePrice.toFixed(2)}`;
  }

  function updatePrice(): void {
    if (!modalPrice) return;

    let totalPrice: number = state.basePrice;
    
    if (sizeOptions) {
      const activeSize: HTMLElement | null = sizeOptions.querySelector('.modal__size-btn.is-active') as HTMLElement | null;
      if (activeSize) {
        const size: Size | null = activeSize.getAttribute('data-size') as Size | null;
        if (size && sizePrices[size]) {
          totalPrice += sizePrices[size];
        }
      }
    }
    
    if (additiveOptions) {
      const activeAdditives: NodeListOf<HTMLElement> = additiveOptions.querySelectorAll('.modal__additive-btn.is-active');
      totalPrice += activeAdditives.length * additivePrice;
    }
    
    modalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  }

  function handleCardClick(e: MouseEvent): void {
    const card: Element | null = (e.target as HTMLElement).closest('.menu__card');
    if (card) {
      openModal(card);
    }
  }

  document.addEventListener('click', handleCardClick);

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  if (sizeOptions) {
    function handleSizeClick(e: MouseEvent): void {
      const button: HTMLElement | null = (e.target as HTMLElement).closest('.modal__size-btn') as HTMLElement | null;
      if (button && sizeOptions) {
        const buttons: NodeListOf<HTMLElement> = sizeOptions.querySelectorAll('.modal__size-btn');
        buttons.forEach((b: HTMLElement): void => b.classList.remove('is-active'));
        button.classList.add('is-active');
        updatePrice();
      }
    }
    sizeOptions.addEventListener('click', handleSizeClick);
  }

  if (additiveOptions) {
    function handleAdditiveClick(e: MouseEvent): void {
      const button: HTMLElement | null = (e.target as HTMLElement).closest('.modal__additive-btn') as HTMLElement | null;
      if (button) {
        button.classList.toggle('is-active');
        updatePrice();
      }
    }
    additiveOptions.addEventListener('click', handleAdditiveClick);
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  }

  document.addEventListener('keydown', handleKeydown);
}

