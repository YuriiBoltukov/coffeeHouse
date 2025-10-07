(() => {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = Array.from(slider.querySelectorAll('.slider__slide'));
  const prev = slider.querySelector('.slider__arrow--prev');
  const next = slider.querySelector('.slider__arrow--next');
  const dots = Array.from(slider.querySelectorAll('.slider__dot'));

  let index = 0;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  update();
})();

// Menu button functionality
(() => {
  const menuButton = document.querySelector('.menu-button');
  if (!menuButton) return;

  menuButton.addEventListener('click', () => {
    // You can change this URL to the page you want to navigate to
    window.location.href = 'menu.html';
  });
})();

// Menu tabs functionality
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
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('is-active'));
      
      // Add active class to clicked tab
      tab.classList.add('is-active');
      
      // Get the category from data attribute
      const category = tab.getAttribute('data-category');
      
      // Filter menu items based on category
      filterMenuItems(category);
    });
  });

  // Show coffee items by default
  filterMenuItems('coffee');
})();

// Modal functionality
(() => {
  const modal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const closeBtn = document.querySelector('.modal__close');
  const closeModalBtn = document.querySelector('.modal__close-btn');
  const backdrop = document.querySelector('.modal__backdrop');
  const sizeButtons = document.querySelectorAll('.modal__size-btn');
  const additiveButtons = document.querySelectorAll('.modal__additive-btn');

  let basePrice = 0;

  function openModal(card) {
    const image = card.querySelector('.menu__card-image');
    const title = card.querySelector('.menu__card-title');
    const description = card.querySelector('.menu__card-description');
    const price = card.querySelector('.menu__card-price');

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = title.textContent;
    modalDescription.textContent = description.textContent;
    modalPrice.textContent = price.textContent;
    
    // Extract base price (remove $ and convert to number)
    basePrice = parseFloat(price.textContent.replace('$', ''));
    
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    
    // Reset size and additives
    sizeButtons.forEach(btn => btn.classList.remove('is-active'));
    sizeButtons[0].classList.add('is-active'); // Default to S
    
    additiveButtons.forEach(btn => btn.classList.remove('is-active'));
    
    // Reset price
    modalPrice.textContent = `$${basePrice.toFixed(2)}`;
  }

  function updatePrice() {
    let totalPrice = basePrice;
    
    // Add size price (S=0, M=+0.5, L=+1)
    const activeSize = document.querySelector('.modal__size-btn.is-active');
    if (activeSize) {
      const size = activeSize.getAttribute('data-size');
      if (size === 'M') totalPrice += 0.5;
      if (size === 'L') totalPrice += 1;
    }
    
    // Add additive price (+0.5 each)
    const activeAdditives = document.querySelectorAll('.modal__additive-btn.is-active');
    totalPrice += activeAdditives.length * 0.5;
    
    modalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  }

  // Add click listeners to menu cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.menu__card');
    if (card) {
      openModal(card);
    }
  });

  // Close modal listeners
  closeBtn.addEventListener('click', closeModal);
  closeModalBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Size button listeners
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      updatePrice();
    });
  });

  // Additive button listeners
  additiveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-active');
      updatePrice();
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();


