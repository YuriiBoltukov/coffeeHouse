// Import CSS files
import './styles/normalize.css';
import './styles/variables.css';
import './styles/base.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/slider.css';
import './styles/about.css';
import './styles/download.css';
import './styles/footer.css';
import './styles/menu.css';
import './styles/modal.css';
import './styles/burger.css';
import './styles/responsive.css';

import {
  initSlider,
  initMenuButton,
  initMenuTabs,
  initModal,
  initBurgerMenu
} from './modules';

initSlider();
initMenuButton();
initMenuTabs();
initModal();
initBurgerMenu();
