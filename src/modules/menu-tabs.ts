import { Category } from '../types';

type DisplayStyle = 'block' | 'none';

export const menuTabsService: { onCategoryChange: (category: Category) => void } = {
  onCategoryChange: (_category: Category): void => {
    // This will be set by API service if it's initialized
  }
};

export function initMenuTabs(): void {
  const tabs: NodeListOf<HTMLElement> = document.querySelectorAll('.menu__tab');
  const cards: NodeListOf<HTMLElement> = document.querySelectorAll('.menu__card');
  if (!tabs.length) return;

  function filterMenuItems(category: Category): void {
    if (cards.length > 0) {
      cards.forEach((card: HTMLElement): void => {
        const cardCategory: Category | null = card.getAttribute('data-category') as Category | null;
        if (cardCategory === category) {
          card.style.display = 'block' as DisplayStyle;
        } else {
          card.style.display = 'none' as DisplayStyle;
        }
      });
    }
  }

  function handleTabClick(clickedTab: HTMLElement): void {
    tabs.forEach((tab: HTMLElement): void => {
      tab.classList.remove('is-active');
    });
    
    clickedTab.classList.add('is-active');
    
    const category: Category | null = clickedTab.getAttribute('data-category') as Category | null;
    if (category) {
      if (menuTabsService.onCategoryChange) {
        menuTabsService.onCategoryChange(category);
      }
      filterMenuItems(category);
    }
  }

  tabs.forEach((tab: HTMLElement): void => {
    tab.addEventListener('click', (): void => {
      handleTabClick(tab);
    });
  });

  filterMenuItems(Category.COFFEE);
}

