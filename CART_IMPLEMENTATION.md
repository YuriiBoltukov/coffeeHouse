# Реализация корзины

## ✅ Реализованный функционал

### 1. **Значок и счетчик корзины**

- Значок корзины всегда виден авторизованным пользователям
- Для неавторизованных появляется после добавления первого товара
- Отображает общее количество товаров в бейдже
- При клике перенаправляет на страницу корзины

**Файлы:**
- `src/index.html` (строки 21-31)
- `src/menu.html` (строки 21-31)
- `src/cart.html` (строки 15-25)

### 2. **Хранение в localStorage**

- Содержимое корзины сохраняется в localStorage
- Ключ: `coffeeshop_cart`
- Сохраняется даже после обновления страницы
- Очищается только при ручной очистке или успешном заказе

**Файл: `src/api/cart.ts`** (строки 1-135):
```typescript
export class CartService {
  private CART_STORAGE_KEY = 'coffeeshop_cart';
  
  private saveCart(): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
  }
  
  private loadCart(): Cart {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  }
}
```

### 3. **Детали заказа**

На странице корзины отображается:
- ✅ Название продукта
- ✅ Выбранный размер
- ✅ Добавки
- ✅ Цена (с учетом скидки, если есть)
- ✅ Количество
- ✅ Кнопка удаления

**Файл: `src/cart.ts`** (строки 68-144):
```typescript
private renderCartItem(item: CartItem): HTMLElement {
  // Отображает все детали товара
  // Включает изображение, размер, добавки, цену, количество
  // Кнопка удаления товара
}
```

### 4. **Удаление товаров**

- Кнопка удаления для каждого товара
- Общая сумма обновляется автоматически
- Иконка корзины обновляется

**Файл: `src/cart.ts`** (строки 146-150):
```typescript
private removeItem(item: CartItem): void {
  cartService.removeItem(item.productId, item.size, item.additives);
  this.render();
  this.updateCartIcon();
}
```

### 5. **Аутентификация**

#### Для неавторизованных пользователей:
- Кнопки "Войти" и "Регистрация"
- Моковое перенаправление (создает тестового пользователя)

**Файл: `src/cart.ts`** (строки 177-200):
```typescript
if (!isAuthenticated) {
  // Показать кнопки входа и регистрации
  // При клике создать тестового пользователя
}
```

#### Для авторизованных пользователей:
- Поле "Адрес доставки"
- Кнопка "Подтвердить заказ"

**Файл: `src/cart.ts`** (строки 200-217):
```typescript
if (isAuthenticated) {
  // Показать поле адреса
  // Кнопка "Подтвердить заказ"
}
```

### 6. **Подтверждение заказа**

#### Процесс:
1. Пользователь нажимает "Подтвердить заказ"
2. Отправка заказа в бэкенд: `POST /orders`
3. Показывается loader
4. При успехе: очистка корзины и сообщение с подтверждением
5. При ошибке: уведомление "Что-то пошло не так. Попробуйте ещё раз"

**Файл: `src/cart.ts`** (строки 219-250):
```typescript
private async confirmOrder(): Promise<void> {
  try {
    this.showLoading();
    
    const order = {
      userId,
      items: cart.items,
      totalPrice: cartService.getTotalPrice(),
      deliveryAddress: addressInput.value
    };
    
    await ordersService.createOrder(order);
    
    this.hideLoading();
    cartService.clearCart();
    this.showSuccessMessage();
  } catch (error) {
    this.showNotification('Что-то пошло не так. Попробуйте ещё раз');
  }
}
```

### 7. **Loader при оформлении заказа**

**Файл: `src/cart.ts`** (строки 252-269):
```typescript
private showLoading(): void {
  const loadingOverlay = document.createElement('div');
  loadingOverlay.innerHTML = `
    <div class="spinner">Загрузка...</div>
    <p>Оформление заказа...</p>
  `;
  document.body.appendChild(loadingOverlay);
}
```

### 8. **Сообщение успешного заказа**

После успешного заказа:
- Корзина очищается
- Показывается сообщение: "Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время"
- Кнопка "Вернуться на главную"

**Файл: `src/cart.ts`** (строки 271-294):
```typescript
private showSuccessMessage(): void {
  const message = document.createElement('div');
  message.innerHTML = `
    <p>Спасибо за заказ!</p>
    <p>Наш менеджер свяжется с вами в ближайшее время</p>
    <button onclick="window.location.href='index.html'">Вернуться на главную</button>
  `;
}
```

### 9. **Обработка ошибок**

**Файл: `src/cart.ts`** (строки 26-46):
```typescript
private showNotification(message: string): void {
  this.notification.textContent = message;
  this.notification.style.display = 'block';
  setTimeout(() => {
    this.notification.style.display = 'none';
  }, 3000);
}
```

## Структура файлов

### Типы
- `src/types/cart.ts` - Интерфейсы для корзины и заказов

### API
- `src/api/cart.ts` - `CartService` для работы с корзиной
- `src/api/orders.ts` - `OrdersService` для отправки заказов

### UI
- `src/cart.html` - HTML страницы корзины
- `src/cart.ts` - Логика страницы корзины
- `src/modules/cart-icon.ts` - Обновление иконки корзины

### Интеграция с модальным окном
- `src/modules/api-modal.ts` - Добавление в корзину из модального окна

## Workflow

```
1. Пользователь нажимает на карточку → Открывается модальное окно
2. Выбирает размер и добавки
3. Нажимает "Добавить в корзину"
4. Товар сохраняется в localStorage
5. Обновляется иконка корзины с бейджем
6. Переход на cart.html
7. Просмотр товаров, редактирование, удаление
8. Если неавторизован → кнопки входа/регистрации
9. Если авторизован → поля адреса и "Подтвердить заказ"
10. При клике на "Подтвердить заказ":
    - Показывается loader
    - Отправляется запрос POST /orders
    - При успехе: сообщение + очистка корзины
    - При ошибке: уведомление
```

## API Endpoints

### Получение товаров
- `GET /products` - Все товары
- `GET /products/{id}` - Товар по ID
- `GET /products/favorites` - Избранные товары

### Корзина (localStorage)
- Ключ: `coffeeshop_cart`
- Структура: `{ items: CartItem[], userId?: string }`

### Заказы
- `POST /orders` - Создание заказа
- Payload: `{ userId, items, totalPrice, deliveryAddress }`
- Ответ: `{ success: boolean, message: string, orderId?: string }`

## Использование

### В коде:
```typescript
import { cartService } from './api';

// Добавить товар
cartService.addItem(item);

// Получить корзину
const cart = cartService.getCart();

// Очистить корзину
cartService.clearCart();

// Получить общую цену
const total = cartService.getTotalPrice();
```

Сборка прошла успешно! ✅

