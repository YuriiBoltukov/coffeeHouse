// Import CSS files
import './styles/normalize.css';
import './styles/variables.css';
import './styles/base.css';
import './styles/header.css';
import './styles/menu.css';
import './styles/modal.css';
import './styles/burger.css';
import './styles/footer.css';
import './styles/responsive.css';

import {
  initMenuButton,
  initMenuTabs,
  initModal,
  initBurgerMenu,
  apiMenuService
} from './modules';

import { appConfig } from './api';

async function initMenu(): Promise<void> {
  // Initialize UI components
  initMenuButton();
  initModal();
  initBurgerMenu();

  // Initialize menu tabs
  initMenuTabs();

  // Load products from API if enabled
  if (appConfig.apiEnabled) {
    await apiMenuService.init();
  }
}

initMenu();

