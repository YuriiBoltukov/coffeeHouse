// Import CSS files
import './styles/normalize.css';
import './styles/variables.css';
import './styles/base.css';
import './styles/header.css';
import './styles/burger.css';
import './styles/footer.css';
import './styles/responsive.css';

import { authService, LoginRequest } from './api';

class LoginPage {
  private form: HTMLFormElement | null;
  private usernameInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private submitBtn: HTMLButtonElement | null;
  private authError: HTMLElement | null;

  private usernameValid: boolean = false;
  private passwordValid: boolean = false;

  constructor() {
    this.form = document.getElementById('loginForm') as HTMLFormElement | null;
    this.usernameInput = document.getElementById('username') as HTMLInputElement | null;
    this.passwordInput = document.getElementById('password') as HTMLInputElement | null;
    this.submitBtn = document.getElementById('submitBtn') as HTMLButtonElement | null;
    this.authError = document.getElementById('authError');

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (this.usernameInput) {
      this.usernameInput.addEventListener('blur', () => this.validateUsername());
      this.usernameInput.addEventListener('input', () => this.onUsernameInput());
      this.usernameInput.addEventListener('focus', () => this.clearUsernameError());
    }

    if (this.passwordInput) {
      this.passwordInput.addEventListener('blur', () => this.validatePassword());
      this.passwordInput.addEventListener('input', () => this.onPasswordInput());
      this.passwordInput.addEventListener('focus', () => this.clearPasswordError());
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  private validateUsername(): boolean {
    if (!this.usernameInput) return false;

    const username: string = this.usernameInput.value.trim();
    
    const minLength = username.length >= 3;
    const startsWithLetter = /^[a-zA-Z]/.test(username);
    const onlyEnglishLetters = /^[a-zA-Z]+$/.test(username);

    if (!minLength) {
      this.showUsernameError('Username must be at least 3 characters long');
      this.usernameValid = false;
      return false;
    }

    if (!startsWithLetter) {
      this.showUsernameError('Username must start with a letter');
      this.usernameValid = false;
      return false;
    }

    if (!onlyEnglishLetters) {
      this.showUsernameError('Username must contain only English letters');
      this.usernameValid = false;
      return false;
    }

    this.clearUsernameError();
    this.usernameValid = true;
    this.updateSubmitButton();
    return true;
  }

  private validatePassword(): boolean {
    if (!this.passwordInput) return false;

    const password: string = this.passwordInput.value;
    
    const minLength = password.length >= 6;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>[\]';\\/_=+-\s]/.test(password);

    if (!minLength) {
      this.showPasswordError('Password must be at least 6 characters long');
      this.passwordValid = false;
      return false;
    }

    if (!hasSpecialChar) {
      this.showPasswordError('Password must contain at least 1 special character');
      this.passwordValid = false;
      return false;
    }

    this.clearPasswordError();
    this.passwordValid = true;
    this.updateSubmitButton();
    return true;
  }

  private showUsernameError(message: string): void {
    if (!this.usernameInput) return;

    this.usernameInput.style.borderColor = '#dc3545';
    const errorIcon = this.usernameInput.parentElement?.querySelector('.error-icon') as HTMLElement;
    const errorMessage = this.usernameInput.parentElement?.parentElement?.querySelector('.error-message') as HTMLElement;
    
    if (errorIcon) errorIcon.style.display = 'block';
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }
  }

  private showPasswordError(message: string): void {
    if (!this.passwordInput) return;

    this.passwordInput.style.borderColor = '#dc3545';
    const errorIcon = this.passwordInput.parentElement?.querySelector('.error-icon') as HTMLElement;
    const errorMessage = this.passwordInput.parentElement?.parentElement?.querySelector('.error-message') as HTMLElement;
    
    if (errorIcon) errorIcon.style.display = 'block';
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }
  }

  private clearUsernameError(): void {
    if (!this.usernameInput) return;

    this.usernameInput.style.borderColor = '#dee2e6';
    const errorIcon = this.usernameInput.parentElement?.querySelector('.error-icon') as HTMLElement;
    const errorMessage = this.usernameInput.parentElement?.parentElement?.querySelector('.error-message') as HTMLElement;
    
    if (errorIcon) errorIcon.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
  }

  private clearPasswordError(): void {
    if (!this.passwordInput) return;

    this.passwordInput.style.borderColor = '#dee2e6';
    const errorIcon = this.passwordInput.parentElement?.querySelector('.error-icon') as HTMLElement;
    const errorMessage = this.passwordInput.parentElement?.parentElement?.querySelector('.error-message') as HTMLElement;
    
    if (errorIcon) errorIcon.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
  }

  private onUsernameInput(): void {
    if (this.usernameInput && this.usernameInput.value.trim()) {
      this.validateUsername();
    } else {
      this.usernameValid = false;
      this.updateSubmitButton();
    }
  }

  private onPasswordInput(): void {
    if (this.passwordInput && this.passwordInput.value) {
      this.validatePassword();
    } else {
      this.passwordValid = false;
      this.updateSubmitButton();
    }
  }

  private updateSubmitButton(): void {
    if (!this.submitBtn) return;

    if (this.usernameValid && this.passwordValid) {
      this.submitBtn.disabled = false;
      this.submitBtn.style.background = '#6c757d';
      this.submitBtn.style.cursor = 'pointer';
      this.submitBtn.style.opacity = '1';
    } else {
      this.submitBtn.disabled = true;
      this.submitBtn.style.background = '#ccc';
      this.submitBtn.style.cursor = 'not-allowed';
      this.submitBtn.style.opacity = '0.6';
    }
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (!this.usernameInput || !this.passwordInput) return;

    const credentials: LoginRequest = {
      login: this.usernameInput.value.trim(),
      password: this.passwordInput.value
    };

    try {
      const response = await authService.login(credentials);
      
      if (response.data && response.data.access_token) {
        authService.setAuthToken(response.data.access_token);
        localStorage.setItem('user_id', response.data.user.id.toString());
        
        window.dispatchEvent(new Event('authStateChanged'));
        
        window.location.href = 'menu.html';
      } else {
        console.error('Login failed:', response);
        this.showAuthError();
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showAuthError();
    }
  }

  private showAuthError(): void {
    if (this.authError) {
      this.authError.style.display = 'block';
    }
  }
}

new LoginPage();

