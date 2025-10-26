export function initMenuButton(): void {
  const menuButton: HTMLElement | null = document.querySelector('.menu-button');
  if (!menuButton) return;

  const menuUrl: string = 'menu.html';

  function navigateToMenu(): void {
    window.location.href = menuUrl;
  }

  menuButton.addEventListener('click', navigateToMenu);
}

