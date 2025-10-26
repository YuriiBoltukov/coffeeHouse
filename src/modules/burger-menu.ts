export function initBurgerMenu(): void {
  const burgerMenu: HTMLElement | null = document.querySelector('.burger-menu');
  const mobileMenu: HTMLElement | null = document.querySelector('.mobile-menu');
  const mobileMenuLinks: NodeListOf<HTMLElement> = document.querySelectorAll('.mobile-menu__link');
  
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

  function toggleMobileMenu(): void {
    if (!mobileMenu) return;

    if (mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (burgerMenu) {
    burgerMenu.addEventListener('click', toggleMobileMenu);
  }

  mobileMenuLinks.forEach((link: HTMLElement): void => {
    link.addEventListener('click', (): void => {
      closeMobileMenu();
    });
  });

  function handleResize(): void {
    const breakpoint: number = 768;
    if (window.innerWidth > breakpoint) {
      closeMobileMenu();
    }
  }

  window.addEventListener('resize', handleResize);
}

