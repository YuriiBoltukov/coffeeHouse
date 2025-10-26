import { SizeData, AdditiveData, Category } from '../types';

export function initModal(): void {
  const modal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage') as HTMLImageElement | null;
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const closeModalBtn = document.querySelector('.modal__close-btn');
  const backdrop = document.querySelector('.modal__backdrop');
  const sizeOptions = document.querySelector('.modal__size-options');
  const additiveOptions = document.querySelector('.modal__additives-options');

  if (!modal || !modalImage || !modalTitle || !modalDescription || !modalPrice) return;

  let basePrice = 0;
  let currentCategory: Category = 'coffee';

  function updateSizeOptions(category: Category): void {
    const sizes: Record<Category, SizeData[]> = {
      coffee: [
        { size: 'S', volume: '200ml', text: 'S 200ml' },
        { size: 'M', volume: '300ml', text: 'M 300ml' },
        { size: 'L', volume: '400ml', text: 'L 400ml' }
      ],
      tea: [
        { size: 'S', volume: '200ml', text: 'S 200ml' },
        { size: 'M', volume: '300ml', text: 'M 300ml' },
        { size: 'L', volume: '400ml', text: 'L 400ml' }
      ],
      dessert: [
        { size: 'S', volume: '50g', text: 'S 50g' },
        { size: 'M', volume: '100g', text: 'M 100g' },
        { size: 'L', volume: '200g', text: 'L 200g' }
      ]
    };

    if (!sizeOptions) return;

    sizeOptions.innerHTML = '';
    sizes[category].forEach((sizeData, index) => {
      const button = document.createElement('button');
      button.className = `modal__size-btn ${index === 0 ? 'is-active' : ''}`;
      button.setAttribute('data-size', sizeData.size);
      button.setAttribute('data-volume', sizeData.volume);
      
      const icon = document.createElement('span');
      icon.className = 'modal__size-icon';
      icon.textContent = sizeData.size;
      
      const label = document.createElement('span');
      label.textContent = sizeData.volume;
      
      button.appendChild(icon);
      button.appendChild(label);
      sizeOptions.appendChild(button);
    });
  }

  function updateAdditiveOptions(category: Category): void {
    const additives: Record<Category, AdditiveData[]> = {
      coffee: [
        { additive: '1', name: 'sugar', text: '1', label: 'Sugar' },
        { additive: '2', name: 'cinnamon', text: '2', label: 'Cinnamon' },
        { additive: '3', name: 'syrup', text: '3', label: 'Syrup' }
      ],
      tea: [
        { additive: '1', name: 'sugar', text: '1', label: 'Sugar' },
        { additive: '2', name: 'lemon', text: '2', label: 'Lemon' },
        { additive: '3', name: 'syrup', text: '3', label: 'Syrup' }
      ],
      dessert: [
        { additive: '1', name: 'berries', text: '1', label: 'Berries' },
        { additive: '2', name: 'nuts', text: '2', label: 'Nuts' },
        { additive: '3', name: 'jam', text: '3', label: 'Jam' }
      ]
    };

    if (!additiveOptions) return;

    additiveOptions.innerHTML = '';
    additives[category].forEach((additiveData) => {
      const button = document.createElement('button');
      button.className = 'modal__additive-btn';
      button.setAttribute('data-additive', additiveData.additive);
      button.setAttribute('data-name', additiveData.name);
      
      const icon = document.createElement('span');
      icon.className = 'modal__additive-icon';
      icon.textContent = additiveData.text;
      
      const label = document.createElement('span');
      label.textContent = additiveData.label;
      
      button.appendChild(icon);
      button.appendChild(label);
      additiveOptions.appendChild(button);
    });
  }

  function openModal(card: Element): void {
    const image = card.querySelector('.menu__card-image') as HTMLImageElement;
    const title = card.querySelector('.menu__card-title');
    const description = card.querySelector('.menu__card-description');
    const price = card.querySelector('.menu__card-price');

    if (!image || !title || !description || !price) return;
    if (!modalImage || !modalTitle || !modalDescription || !modalPrice || !modal) return;

    const category = card.getAttribute('data-category') as Category;
    if (category && (category === 'coffee' || category === 'tea' || category === 'dessert')) {
      currentCategory = category;
    }

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = title.textContent || '';
    modalDescription.textContent = description.textContent || '';
    modalPrice.textContent = price.textContent || '$0.00';
    
    const priceText = price.textContent || '0';
    basePrice = parseFloat(priceText.replace('$', ''));
    
    updateSizeOptions(currentCategory);
    updateAdditiveOptions(currentCategory);
    
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(): void {
    if (!modal || !modalPrice) return;

    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    
    if (sizeOptions) {
      const sizeButtons = sizeOptions.querySelectorAll('.modal__size-btn');
      const additiveButtons = additiveOptions?.querySelectorAll('.modal__additive-btn');
      
      sizeButtons.forEach(btn => btn.classList.remove('is-active'));
      if (sizeButtons[0]) sizeButtons[0].classList.add('is-active');
      
      additiveButtons?.forEach(btn => btn.classList.remove('is-active'));
    }
    
    modalPrice.textContent = `$${basePrice.toFixed(2)}`;
  }

  function updatePrice(): void {
    if (!modalPrice) return;

    let totalPrice = basePrice;
    
    if (sizeOptions) {
      const activeSize = sizeOptions.querySelector('.modal__size-btn.is-active') as HTMLElement | null;
      if (activeSize) {
        const size = activeSize.getAttribute('data-size');
        if (size === 'M') totalPrice += 0.5;
        if (size === 'L') totalPrice += 1;
      }
    }
    
    if (additiveOptions) {
      const activeAdditives = additiveOptions.querySelectorAll('.modal__additive-btn.is-active');
      totalPrice += activeAdditives.length * 0.5;
    }
    
    modalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  }

  document.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.menu__card');
    if (card) {
      openModal(card);
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  if (sizeOptions) {
    sizeOptions.addEventListener('click', (e) => {
      const button = (e.target as HTMLElement).closest('.modal__size-btn') as HTMLElement | null;
      if (button) {
        const buttons = sizeOptions.querySelectorAll('.modal__size-btn');
        buttons.forEach(b => b.classList.remove('is-active'));
        button.classList.add('is-active');
        updatePrice();
      }
    });
  }

  if (additiveOptions) {
    additiveOptions.addEventListener('click', (e) => {
      const button = (e.target as HTMLElement).closest('.modal__additive-btn') as HTMLElement | null;
      if (button) {
        button.classList.toggle('is-active');
        updatePrice();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

