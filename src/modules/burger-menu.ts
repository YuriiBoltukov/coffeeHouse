export function initBurgerMenu(): void {
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
  
  if (!burgerMenu || !mobileMenu) {
    return;
  }

  function openMobileMenu(): void {
    if (!burgerMenu || !mobileMenu) return;
    burgerMenu.classList.add('is-active');
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu(): void {
    if (!burgerMenu || !mobileMenu) return;
    burgerMenu.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  burgerMenu.addEventListener('click', () => {
    if (!mobileMenu) return;

    if (mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  function handleResize(): void {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }

  window.addEventListener('resize', handleResize);
}

