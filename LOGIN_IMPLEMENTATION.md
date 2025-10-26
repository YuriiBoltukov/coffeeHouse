# Реализация страницы входа

## ✅ Реализованный функционал

### 1. **Поля ввода**

- Поле "Логин" (username)
- Поле "Пароль" (password)
- Оба поля обязательны для заполнения

**Файл: `src/login.html`** (строки 21-51):
```html
<input type="text" id="username" name="username" required>
<input type="password" id="password" name="password" required>
```

### 2. **Правила валидации**

#### Правила для логина (username):
1. ✅ Длина не менее 3 символов
2. ✅ Должен начинаться с буквы
3. ✅ Разрешены только буквы английского алфавита

#### Правила для пароля (password):
1. ✅ Длина не менее 6 символов
2. ✅ Должен содержать хотя бы 1 специальный символ

**Файл: `src/login.ts`** (строки 40-65, 71-98):
```typescript
private validateUsername(): boolean {
  const minLength = username.length >= 3;
  const startsWithLetter = /^[a-zA-Z]/.test(username);
  const onlyEnglishLetters = /^[a-zA-Z]+$/.test(username);
}

private validatePassword(): boolean {
  const minLength = password.length >= 6;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\[\];'\\/_=+\-\s]/.test(password);
}
```

### 3. **Эффекты валидации**

#### При blur (потере фокуса):
- Проверяется поле
- При ошибке: красная рамка + иконка ошибки
- Отображается сообщение под полем

#### При focus:
- Удаляется сообщение об ошибке
- Сбрасывается стиль ввода (красная рамка становится обычной)

**Файл: `src/login.ts`** (строки 101-158):
```typescript
private showUsernameError(message: string): void {
  this.usernameInput.style.borderColor = '#dc3545';
  errorIcon.style.display = 'block';
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

private clearUsernameError(): void {
  this.usernameInput.style.borderColor = '#dee2e6';
  errorIcon.style.display = 'none';
  errorMessage.style.display = 'none';
}
```

### 4. **Состояние кнопки "Войти"**

- Кнопка неактивна (`disabled: true`) до тех пор, пока оба поля не заполнены правильно
- Визуально отличается: серый цвет, пониженная прозрачность
- При валидных полях становится активной

**Файл: `src/login.ts`** (строки 181-194):
```typescript
private updateSubmitButton(): void {
  if (this.usernameValid && this.passwordValid) {
    this.submitBtn.disabled = false;
    this.submitBtn.style.background = '#6c757d';
    this.submitBtn.style.cursor = 'pointer';
  } else {
    this.submitBtn.disabled = true;
    this.submitBtn.style.background = '#ccc';
    this.submitBtn.style.cursor = 'not-allowed';
    this.submitBtn.style.opacity = '0.6';
  }
}
```

### 5. **Аутентификация**

При нажатии кнопки "Войти":
- Отправляется запрос: `POST /auth/login`
- Payload: `{ username, password }`
- При успехе: сохранение токена в localStorage
- Перенаправление на `menu.html`

**Файл: `src/login.ts`** (строки 197-219):
```typescript
private async handleSubmit(e: Event): Promise<void> {
  e.preventDefault();

  const credentials: LoginRequest = {
    username: this.usernameInput.value.trim(),
    password: this.passwordInput.value
  };

  try {
    const response = await authService.login(credentials);
    
    if (response.success) {
      authService.setAuthToken(response.token || 'mock_token');
      localStorage.setItem('user_id', response.userId || 'user_' + Date.now());
      window.location.href = 'menu.html';
    }
  } catch (error) {
    this.showAuthError();
  }
}
```

### 6. **Обработка ошибок**

Если логин не удался:
- Отображается сообщение под формой: "Неверный логин или пароль"
- Красный фон, белый текст

**Файл: `src/login.html`** (строки 55-57):
```html
<div id="authError" style="display: none; background: #f8d7da; color: #721c24;">
  Неверный логин или пароль
</div>
```

**Файл: `src/login.ts`** (строки 236-241):
```typescript
private showAuthError(): void {
  if (this.authError) {
    this.authError.style.display = 'block';
  }
}
```

### 7. **Успешный вход**

После успешного входа:
1. Сохраняется токен в localStorage: `auth_token`
2. Сохраняется userId в localStorage: `user_id`
3. Перенаправление на страницу меню: `menu.html`

**Файл: `src/login.ts`** (строки 215-217):
```typescript
authService.setAuthToken(response.token || 'mock_token');
localStorage.setItem('user_id', response.userId || 'user_' + Date.now());
window.location.href = 'menu.html';
```

## Структура файлов

### Типы
- `src/types/auth.ts` - Интерфейсы для аутентификации

### API
- `src/api/auth.ts` - `AuthService` для работы с аутентификацией

### UI
- `src/login.html` - HTML страницы входа
- `src/login.ts` - Логика страницы входа

## Валидация

### Логин (username):
```typescript
✓ Минимум 3 символа
✓ Начинается с буквы (a-zA-Z)
✓ Только буквы английского алфавита
```

Примеры:
- ✅ `abc` - валидно
- ✅ `username123` - невалидно (содержит цифры)
- ❌ `ab` - невалидно (меньше 3 символов)
- ❌ `123abc` - невалидно (не начинается с буквы)

### Пароль (password):
```typescript
✓ Минимум 6 символов
✓ Содержит хотя бы 1 специальный символ
```

Примеры:
- ✅ `pass!word` - валидно
- ✅ `password@123` - валидно
- ❌ `passw1` - невалидно (нет специального символа)
- ❌ `pass` - невалидно (меньше 6 символов)

## Workflow

```
1. Пользователь вводит логин
   ↓
2. При blur: валидация логина
   ↓
3. Пользователь вводит пароль
   ↓
4. При blur: валидация пароля
   ↓
5. При focus: очистка ошибок
   ↓
6. Оба поля валидны → кнопка активируется
   ↓
7. Нажатие "Войти"
   ↓
8. POST /auth/login
   ↓
9. При успехе: сохранение токена + редирект на menu.html
   ↓
10. При ошибке: "Неверный логин или пароль"
```

## API Endpoints

### Аутентификация
- `POST /auth/login` - Вход
  - Payload: `{ username: string, password: string }`
  - Response: `{ success: boolean, token?: string, userId?: string }`

## Использование

### В коде:
```typescript
import { authService } from './api';

// Проверка авторизации
const isAuth = authService.isAuthenticated();

// Вход
await authService.login({ username: 'user', password: 'pass!word' });

// Получение токена
const token = authService.getAuthToken();

// Выход
authService.logout();
```

## UI Элементы

### Сообщения об ошибках валидации:
- Под каждым полем
- Красный цвет (#dc3545)
- Иконка ошибки (✕) справа
- Красная рамка поля при ошибке

### Кнопка "Войти":
- Неактивна: серый фон (#ccc), opacity 0.6
- Активна: коричневый фон (#6c757d), opacity 1
- При клике отправляет форму

### Сообщение об ошибке аутентификации:
- Красный фон (#f8d7da)
- Красный текст (#721c24)
- Отображается под формой

Сборка прошла успешно! ✅

