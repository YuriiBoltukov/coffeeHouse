import { authService } from '../api';

export class AuthButton {
  private button: HTMLElement | null = null;

  constructor() {
    this.init();
    this.setupAuthStateListener();
  }

  private init(): void {
    this.button = document.querySelector('.auth-button');
    
    if (this.button) {
      this.updateButton();
      this.setupClickHandler();
    }
  }

  private setupAuthStateListener(): void {
    window.addEventListener('authStateChanged', () => {
      this.updateButton();
    });
  }

  private updateButton(): void {
    if (!this.button) return;

    const isAuthenticated: boolean = authService.isAuthenticated();

    if (isAuthenticated) {
      this.button.textContent = 'Logout';
      this.button.setAttribute('data-action', 'logout');
    } else {
      this.button.textContent = 'Login';
      this.button.setAttribute('data-action', 'login');
    }
  }

  private setupClickHandler(): void {
    if (!this.button) return;

    this.button.addEventListener('click', () => {
      const action: string | null = this.button?.getAttribute('data-action') || null;

      if (action === 'logout') {
        this.handleLogout();
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  private handleLogout(): void {
    authService.logout();
    window.location.href = 'index.html';
  }

  public refresh(): void {
    this.updateButton();
  }
}

export const authButton = new AuthButton();

