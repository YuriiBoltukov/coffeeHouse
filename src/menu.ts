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
  apiMenuService,
  apiModalService,
  initCartIcon,
  authButton
} from './modules';

import { appConfig } from './api';

async function initMenu(): Promise<void> {
  // Initialize UI components
  initMenuButton();
  initBurgerMenu();
  initCartIcon();
  authButton.refresh();

  // Initialize menu tabs
  initMenuTabs();

  // Initialize modal based on configuration
  if (appConfig.apiEnabled) {
    apiModalService.init();
  } else {
    initModal();
  }

  // Load products from API if enabled
  if (appConfig.apiEnabled) {
    await apiMenuService.init();
  }
}

initMenu();

