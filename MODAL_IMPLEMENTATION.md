# Реализация модального окна с API

## ✅ Реализованный функционал

### 1. **Извлечение данных по ID**

При клике на карточку продукта:
- Извлекается `data-product-id` из карточки
- Выполняется запрос `GET /products/{id}` к API
- Получаются полные данные о продукте

**Файл: `src/modules/api-modal.ts`** (строки 229-259):
```typescript
async openModal(productId: number): Promise<void> {
  const product = await productsService.getProductById(productId);
  // Использует данные для заполнения модального окна
}
```

### 2. **Loader во время загрузки**

При запросе продукта:
- Показывается overlay с анимированным spinner
- Модальное окно не открывается до получения данных
- Overlay автоматически скрывается после загрузки

**Файл: `src/modules/api-modal.ts`** (строки 105-125):
```typescript
showLoading() // Показывает overlay с spinner
hideLoading() // Скрывает overlay
```

**Файл: `src/styles/modal.css`** (строки 290-306):
```css
.modal__overlay {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1001;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 3. **Обработка ошибок**

При ошибке загрузки:
- Показывается уведомление вверху страницы
- Текст: "Что-то пошло не так. Попробуйте ещё раз"
- Overlay и loader исчезают
- Уведомление исчезает через 3 секунды

**Файл: `src/modules/api-modal.ts`** (строки 73-100, 298-305):
```typescript
showNotification() // Показывает красное уведомление
// Скрывается автоматически через 3 секунды
```

**Файл: `src/styles/modal.css`** (строки 308-332):
```css
.notification {
  background: #dc3545;
  color: white;
  animation: slideDown 0.3s ease;
}
```

### 4. **Кнопка "Добавить в корзину"**

**Файл: `src/menu.html`** (строки 134-136):
```html
<button class="modal__add-to-cart">
  Добавить в корзину
</button>
```

**Функции:**
- Выбор размера (один вариант)
- Выбор добавок (множественный)
- Закрытие модального окна после добавления

### 5. **Tooltips с ценами**

При наведении на размер/добавку:
- Размер: `+$0.50` для M, `+$1.00` для L
- Добавки: `+$0.50` за каждую

**Файл: `src/modules/api-modal.ts`** (строки 170-171, 209-210):
```typescript
const tooltip = `+${this.formatPrice(sizePrices[size])}`;
button.title = tooltip;
```

### 6. **Цены со скидкой**

Для зарегистрированных пользователей:
- Перечеркнутая оригинальная цена
- Цена со скидкой красным цветом

**Файл: `src/modules/api-modal.ts`** (строки 60-75, 249-255):
```typescript
if (prices.discounted) {
  modalPrice.innerHTML = `
    <span style="text-decoration: line-through;">${prices.original}</span>
    <span style="color: #dc3545;">${prices.discounted}</span>
  `;
}
```

### 7. **Динамическое обновление цены**

Общая цена пересчитывается при:
- Выборе размера
- Добавлении/удалении добавок

**Файл: `src/modules/api-modal.ts`** (строки 287-327):
```typescript
updatePrice() {
  totalPrice = basePrice + sizePrice + additivesPrice * count;
  // Обновляет отображение цены
}
```

### 8. **Закрытие модального окна**

Модальное окно закрывается:
- ✅ Нажатие "Добавить в корзину"
- ✅ Нажатие "Закрыть"
- ✅ Клик на backdrop
- ✅ Клавиша `Esc`

**Файл: `src/modules/api-modal.ts`** (строки 272-284, 386-390):
```typescript
closeModal() {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

## Структура модального окна

```
Модальное окно
├── Overlay (loader)
│   └── Spinner + "Загрузка продукта..."
├── Backdrop (закрытие по клику)
└── Content
    ├── Изображение продукта
    ├── Название
    ├── Описание
    ├── Размеры (с tooltips)
    ├── Добавки (с tooltips)
    ├── Общая цена
    ├── Предупреждение
    └── Кнопки
        ├── Добавить в корзину
        └── Закрыть
```

## Workflow

```
1. Клик на карточку → Открытие модального окна
2. Показать loader
3. Запрос: GET /products/{id}
4. При успехе:
   - Заполнить данные
   - Скрыть loader
   - Открыть модальное окно
5. При ошибке:
   - Показать уведомление
   - Скрыть loader
   - Закрыть модальное окно
```

## Использование

**В коде (`src/menu.ts`):**
```typescript
import { apiModalService } from './modules';

// Инициализация
apiModalService.init();

// Программное открытие (не требуется, автописка по клику)
await apiModalService.openModal(productId);
```

## API endpoints

- `GET /products/{id}` - Получить продукт по ID
- Возвращает: `{ id, name, description, price, discountPrice, category, image }`

Сборка прошла успешно. ✅

