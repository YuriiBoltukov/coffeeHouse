(() => {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = Array.from(slider.querySelectorAll('.slider__slide'));
  const prev = slider.querySelector('.slider__arrow--prev');
  const next = slider.querySelector('.slider__arrow--next');
  const dots = Array.from(slider.querySelectorAll('.slider__dot'));

  let index = 0;
  let autoSlideInterval;

  function update() {
    track.style.transform = `translateX(-${index * (100 / slides.length)}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    if (i < 0) {
      index = slides.length - 1;
    } else if (i >= slides.length) {
      index = 0;
    } else {
      index = i;
    }
    update();
  }

  function nextSlide() {
    goTo(index + 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  prev?.addEventListener('click', () => {
    stopAutoSlide();
    goTo(index - 1);
    startAutoSlide();
  });
  
  next?.addEventListener('click', () => {
    stopAutoSlide();
    goTo(index + 1);
    startAutoSlide();
  });
  
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    stopAutoSlide();
    goTo(i);
    startAutoSlide();
  }));

  // Останавливаем автопрокрутку при наведении
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  update();
  startAutoSlide();
})();

(() => {
  const menuButton = document.querySelector('.menu-button');
  if (!menuButton) return;

  menuButton.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });
})();

(() => {
  const tabs = document.querySelectorAll('.menu__tab');
  const cards = document.querySelectorAll('.menu__card');
  if (!tabs.length || !cards.length) return;

  function filterMenuItems(category) {
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (cardCategory === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      
      tab.classList.add('is-active');
      
      const category = tab.getAttribute('data-category');
      
      filterMenuItems(category);
    });
  });

  filterMenuItems('coffee');
})();

(() => {
  const modal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const closeModalBtn = document.querySelector('.modal__close-btn');
  const backdrop = document.querySelector('.modal__backdrop');
  const sizeButtons = document.querySelectorAll('.modal__size-btn');
  const additiveButtons = document.querySelectorAll('.modal__additive-btn');
  const sizeOptions = document.querySelector('.modal__size-options');
  const additiveOptions = document.querySelector('.modal__additives-options');

  let basePrice = 0;
  let currentCategory = 'coffee';

  function updateSizeOptions(category) {
    const sizes = {
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

  function updateAdditiveOptions(category) {
    const additives = {
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

  function openModal(card) {
    const image = card.querySelector('.menu__card-image');
    const title = card.querySelector('.menu__card-title');
    const description = card.querySelector('.menu__card-description');
    const price = card.querySelector('.menu__card-price');

    currentCategory = card.getAttribute('data-category');

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = title.textContent;
    modalDescription.textContent = description.textContent;
    modalPrice.textContent = price.textContent;
    
    basePrice = parseFloat(price.textContent.replace('$', ''));
    
    updateSizeOptions(currentCategory);
    updateAdditiveOptions(currentCategory);
    
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    
    const sizeButtons = sizeOptions.querySelectorAll('.modal__size-btn');
    const additiveButtons = additiveOptions.querySelectorAll('.modal__additive-btn');
    
    sizeButtons.forEach(btn => btn.classList.remove('is-active'));
    if (sizeButtons[0]) sizeButtons[0].classList.add('is-active');
    
    additiveButtons.forEach(btn => btn.classList.remove('is-active'));
    
    modalPrice.textContent = `$${basePrice.toFixed(2)}`;
  }

  function updatePrice() {
    let totalPrice = basePrice;
    
    const activeSize = sizeOptions.querySelector('.modal__size-btn.is-active');
    if (activeSize) {
      const size = activeSize.getAttribute('data-size');
      if (size === 'M') totalPrice += 0.5;
      if (size === 'L') totalPrice += 1;
    }
    
    const activeAdditives = additiveOptions.querySelectorAll('.modal__additive-btn.is-active');
    totalPrice += activeAdditives.length * 0.5;
    
    modalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.menu__card');
    if (card) {
      openModal(card);
    }
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (sizeOptions) {
    sizeOptions.addEventListener('click', (e) => {
      const button = e.target.closest('.modal__size-btn');
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
      const button = e.target.closest('.modal__additive-btn');
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
})();

(() => {
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
  
  console.log('Burger menu element:', burgerMenu);
  console.log('Mobile menu element:', mobileMenu);
  console.log('Mobile menu links:', mobileMenuLinks);
  
  if (!burgerMenu || !mobileMenu) {
    console.log('Burger menu or mobile menu not found!');
    return;
  }

  function openMobileMenu() {
    burgerMenu.classList.add('is-active');
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    burgerMenu.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  burgerMenu.addEventListener('click', () => {
    console.log('Burger menu clicked!');
    if (mobileMenu.classList.contains('is-open')) {
      console.log('Closing mobile menu');
      closeMobileMenu();
    } else {
      console.log('Opening mobile menu');
      openMobileMenu();
    }
  });

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  function handleResize() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }

  window.addEventListener('resize', handleResize);
})();


