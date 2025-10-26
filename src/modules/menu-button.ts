export function initMenuButton(): void {
  const menuButton = document.querySelector('.menu-button');
  if (!menuButton) return;

  menuButton.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });
}

