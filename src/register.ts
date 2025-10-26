// Import CSS files
import './styles/normalize.css';
import './styles/variables.css';
import './styles/base.css';
import './styles/header.css';
import './styles/burger.css';
import './styles/footer.css';
import './styles/responsive.css';

import { authService, RegisterRequest } from './api';

interface CitiesStreets {
  [key: string]: string[];
}

const citiesStreets: CitiesStreets = {
  'new-york': [
    'Broadway', 'Park Avenue', 'Madison Avenue', '5th Avenue', 'Wall Street',
    'Central Park West', 'Lexington Avenue', 'Broadway', 'Columbus Avenue', 'York Avenue'
  ],
  'los-angeles': [
    'Sunset Boulevard', 'Wilshire Boulevard', 'Hollywood Boulevard', 'Santa Monica Boulevard', 'Melrose Avenue',
    'Rodeo Drive', 'Ventura Boulevard', 'Sepulveda Boulevard', 'La Cienega Boulevard', 'Fairfax Avenue'
  ],
  'chicago': [
    'Michigan Avenue', 'State Street', 'Rush Street', 'Division Street', 'North Avenue',
    'Lincoln Avenue', 'Broadway', 'Clark Street', 'Wells Street', 'Halsted Street'
  ]
};

class RegisterPage {
  private form: HTMLFormElement | null;
  private usernameInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private confirmPasswordInput: HTMLInputElement | null;
  private citySelect: HTMLSelectElement | null;
  private streetSelect: HTMLSelectElement | null;
  private houseNumberInput: HTMLInputElement | null;
  private submitBtn: HTMLButtonElement | null;
  private registerError: HTMLElement | null;

  private usernameValid: boolean = false;
  private passwordValid: boolean = false;
  private confirmPasswordValid: boolean = false;
  private cityValid: boolean = false;
  private streetValid: boolean = false;
  private houseNumberValid: boolean = false;
  private paymentMethodValid: boolean = false;

  constructor() {
    this.form = document.getElementById('registerForm') as HTMLFormElement | null;
    this.usernameInput = document.getElementById('username') as HTMLInputElement | null;
    this.passwordInput = document.getElementById('password') as HTMLInputElement | null;
    this.confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement | null;
    this.citySelect = document.getElementById('city') as HTMLSelectElement | null;
    this.streetSelect = document.getElementById('street') as HTMLSelectElement | null;
    this.houseNumberInput = document.getElementById('houseNumber') as HTMLInputElement | null;
    this.submitBtn = document.getElementById('submitBtn') as HTMLButtonElement | null;
    this.registerError = document.getElementById('registerError');

    this.setupEventListeners();
    this.setupCityStreetLogic();
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

    if (this.confirmPasswordInput) {
      this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
      this.confirmPasswordInput.addEventListener('input', () => this.onConfirmPasswordInput());
      this.confirmPasswordInput.addEventListener('focus', () => this.clearConfirmPasswordError());
    }

    if (this.citySelect) {
      this.citySelect.addEventListener('blur', () => this.validateCity());
      this.citySelect.addEventListener('change', () => this.onCityChange());
      this.citySelect.addEventListener('focus', () => this.clearCityError());
    }

    if (this.streetSelect) {
      this.streetSelect.addEventListener('blur', () => this.validateStreet());
      this.streetSelect.addEventListener('change', () => this.onStreetChange());
      this.streetSelect.addEventListener('focus', () => this.clearStreetError());
    }

    if (this.houseNumberInput) {
      this.houseNumberInput.addEventListener('blur', () => this.validateHouseNumber());
      this.houseNumberInput.addEventListener('input', () => this.onHouseNumberInput());
      this.houseNumberInput.addEventListener('focus', () => this.clearHouseNumberError());
    }

    if (this.form) {
      const paymentRadios = this.form.querySelectorAll('input[type="radio"][name="paymentMethod"]');
      paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => this.validatePaymentMethod());
      });

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  private setupCityStreetLogic(): void {
    if (!this.citySelect || !this.streetSelect) return;

    this.citySelect.addEventListener('change', () => {
      this.updateStreets();
      this.validateStreet();
    });
  }

  private updateStreets(): void {
    if (!this.citySelect || !this.streetSelect) return;

    const selectedCity: string = this.citySelect.value;
    this.streetSelect.innerHTML = '<option value="">Select street</option>';

    if (selectedCity && citiesStreets[selectedCity]) {
      const streets: string[] = citiesStreets[selectedCity];
      this.streetSelect.disabled = false;

      streets.forEach((street: string): void => {
        const option = document.createElement('option');
        option.value = street.toLowerCase().replace(/\s+/g, '-');
        option.textContent = street;
        this.streetSelect?.appendChild(option);
      });
    } else {
      this.streetSelect.disabled = true;
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
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\[\];'\\/_=+\-\s]/.test(password);

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
    
    if (this.confirmPasswordInput && this.confirmPasswordInput.value) {
      this.validateConfirmPassword();
    }
    
    this.updateSubmitButton();
    return true;
  }

  private validateConfirmPassword(): boolean {
    if (!this.confirmPasswordInput || !this.passwordInput) return false;

    const confirmPassword: string = this.confirmPasswordInput.value;
    const password: string = this.passwordInput.value;

    if (confirmPassword !== password) {
      this.showConfirmPasswordError('Passwords do not match');
      this.confirmPasswordValid = false;
      return false;
    }

    this.clearConfirmPasswordError();
    this.confirmPasswordValid = true;
    this.updateSubmitButton();
    return true;
  }

  private validateCity(): boolean {
    if (!this.citySelect) return false;

    const city: string = this.citySelect.value;

    if (!city) {
      this.showCityError('Please select a city');
      this.cityValid = false;
      return false;
    }

    this.clearCityError();
    this.cityValid = true;
    this.updateSubmitButton();
    return true;
  }

  private validateStreet(): boolean {
    if (!this.streetSelect) return false;

    const street: string = this.streetSelect.value;

    if (!street) {
      this.showStreetError('Please select a street');
      this.streetValid = false;
      return false;
    }

    this.clearStreetError();
    this.streetValid = true;
    this.updateSubmitButton();
    return true;
  }

  private validateHouseNumber(): boolean {
    if (!this.houseNumberInput) return false;

    const houseNumber: number = parseInt(this.houseNumberInput.value);

    if (!this.houseNumberInput.value || isNaN(houseNumber) || houseNumber <= 1) {
      this.showHouseNumberError('House number must be greater than 1');
      this.houseNumberValid = false;
      return false;
    }

    this.clearHouseNumberError();
    this.houseNumberValid = true;
    this.updateSubmitButton();
    return true;
  }

  private validatePaymentMethod(): boolean {
    if (!this.form) return false;

    const paymentRadios: NodeListOf<HTMLInputElement> = this.form.querySelectorAll('input[type="radio"][name="paymentMethod"]');
    const isChecked: boolean = Array.from(paymentRadios).some(radio => radio.checked);

    this.paymentMethodValid = isChecked;
    this.updateSubmitButton();
    return isChecked;
  }

  private showError(element: HTMLElement, message: string): void {
    element.style.borderColor = '#dc3545';
    const errorIcon = element.parentElement?.querySelector('.error-icon') as HTMLElement;
    const errorMessage = element.parentElement?.parentElement?.querySelector('.error-message') as HTMLElement;
    
    if (errorIcon) errorIcon.style.display = 'block';
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }
  }

  private clearError(element: HTMLElement): void {
    element.style.borderColor = '#dee2e6';
    const errorIcon = element.parentElement?.querySelector('.error-icon') as HTMLElement;
    const errorMessage = element.parentElement?.parentElement?.querySelector('.error-message') as HTMLElement;
    
    if (errorIcon) errorIcon.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
  }

  private showUsernameError = (msg: string): void => { if (this.usernameInput) this.showError(this.usernameInput, msg); };
  private clearUsernameError = (): void => { if (this.usernameInput) this.clearError(this.usernameInput); };
  private showPasswordError = (msg: string): void => { if (this.passwordInput) this.showError(this.passwordInput, msg); };
  private clearPasswordError = (): void => { if (this.passwordInput) this.clearError(this.passwordInput); };
  private showConfirmPasswordError = (msg: string): void => { if (this.confirmPasswordInput) this.showError(this.confirmPasswordInput, msg); };
  private clearConfirmPasswordError = (): void => { if (this.confirmPasswordInput) this.clearError(this.confirmPasswordInput); };
  private showCityError = (msg: string): void => { if (this.citySelect) this.showError(this.citySelect, msg); };
  private clearCityError = (): void => { if (this.citySelect) this.clearError(this.citySelect); };
  private showStreetError = (msg: string): void => { if (this.streetSelect) this.showError(this.streetSelect, msg); };
  private clearStreetError = (): void => { if (this.streetSelect) this.clearError(this.streetSelect); };
  private showHouseNumberError = (msg: string): void => { if (this.houseNumberInput) this.showError(this.houseNumberInput, msg); };
  private clearHouseNumberError = (): void => { if (this.houseNumberInput) this.clearError(this.houseNumberInput); };

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

  private onConfirmPasswordInput(): void {
    if (this.confirmPasswordInput && this.confirmPasswordInput.value) {
      this.validateConfirmPassword();
    } else {
      this.confirmPasswordValid = false;
      this.updateSubmitButton();
    }
  }

  private onCityChange(): void {
    this.updateStreets();
    if (this.citySelect && this.citySelect.value) {
      this.validateCity();
    } else {
      this.cityValid = false;
      this.updateSubmitButton();
    }
  }

  private onStreetChange(): void {
    if (this.streetSelect && this.streetSelect.value) {
      this.validateStreet();
    } else {
      this.streetValid = false;
      this.updateSubmitButton();
    }
  }

  private onHouseNumberInput(): void {
    if (this.houseNumberInput && this.houseNumberInput.value) {
      this.validateHouseNumber();
    } else {
      this.houseNumberValid = false;
      this.updateSubmitButton();
    }
  }

  private updateSubmitButton(): void {
    if (!this.submitBtn) return;

    const allValid: boolean = this.usernameValid && 
                               this.passwordValid && 
                               this.confirmPasswordValid && 
                               this.cityValid && 
                               this.streetValid && 
                               this.houseNumberValid && 
                               this.paymentMethodValid;

    if (allValid) {
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

    if (!this.usernameInput || !this.passwordInput || !this.confirmPasswordInput || !this.citySelect || !this.streetSelect || !this.houseNumberInput) return;

    const paymentRadios: NodeListOf<HTMLInputElement> = this.form?.querySelectorAll('input[type="radio"][name="paymentMethod"]') || document.querySelectorAll('');
    const paymentMethod: 'cash' | 'card' = (Array.from(paymentRadios).find(radio => radio.checked)?.value || 'cash') as 'cash' | 'card';
    
    const registrationData: RegisterRequest = {
      login: this.usernameInput.value.trim(),
      password: this.passwordInput.value,
      confirmPassword: this.confirmPasswordInput.value,
      city: this.citySelect.value,
      street: this.streetSelect.value,
      houseNumber: parseInt(this.houseNumberInput.value),
      paymentMethod
    };
    
    try {
      const response = await authService.register(registrationData);
      
      if (response.data && response.data.access_token) {
        authService.setAuthToken(response.data.access_token);
        localStorage.setItem('user_id', response.data.user.id.toString());
        
        window.dispatchEvent(new Event('authStateChanged'));
        
        window.location.href = 'menu.html';
      } else {
        console.error('Registration failed:', response);
        this.showRegisterError(response.message || 'Registration failed');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      this.showRegisterError(errorMessage);
    }
  }

  private showRegisterError(message: string): void {
    if (this.registerError) {
      this.registerError.textContent = message;
      this.registerError.style.display = 'block';
    }
  }
}

new RegisterPage();

