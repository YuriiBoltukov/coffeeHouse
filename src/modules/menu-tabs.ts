export function initMenuTabs(): void {
  const tabs = document.querySelectorAll('.menu__tab');
  const cards = document.querySelectorAll('.menu__card');
  if (!tabs.length || !cards.length) return;

  function filterMenuItems(category: string): void {
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const element = card as HTMLElement;
      if (cardCategory === category) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      
      tab.classList.add('is-active');
      
      const category = tab.getAttribute('data-category');
      if (category) {
        filterMenuItems(category);
      }
    });
  });

  filterMenuItems('coffee');
}

