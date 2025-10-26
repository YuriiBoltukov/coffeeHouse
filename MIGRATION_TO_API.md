# Миграция на API: Удаление моковых данных

Проект был успешно обновлен для работы с бэкенд API вместо статических данных.

## Что было изменено

### 1. HTML файлы

#### `src/menu.html`
- ✅ Удалены все статические карточки продуктов (24 карточки)
- ✅ Добавлен элемент для loading состояния
- ✅ Оставлен пустой контейнер `.menu__grid` для динамической загрузки продуктов

**До:**
```html
<div class="menu__grid">
  <div class="menu__card" data-category="coffee">...</div>
  <div class="menu__card" data-category="coffee">...</div>
  <!-- ... 24 карточки ... -->
</div>
```

**После:**
```html
<div class="menu__loading" style="display: none;">Loading products...</div>
<div class="menu__grid">
  <!-- Products will be loaded dynamically from API -->
</div>
```

### 2. TypeScript Entry Points

#### `src/index.ts`
- Главная страница (главная + модули)
- Инициализирует slider, menu button, menu tabs, modal, burger menu

#### `src/menu.ts` (НОВЫЙ)
- Отдельная точка входа для страницы меню
- Инициализирует API menu service для загрузки продуктов с бэкенда
- Загружает продукты через `apiMenuService.init()`

### 3. Webpack Configuration

Обновлен `webpack.config.js` для поддержки нескольких entry points:

```javascript
entry: {
  main: './src/index.ts',
  menu: './src/menu.ts'
}

// ...

new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  chunks: ['main']
}),
new HtmlWebpackPlugin({
  template: './src/menu.html',
  filename: 'menu.html',
  chunks: ['menu']
}),
```

### 4. API Integration

Меню теперь загружается из API:
- `GET /products/category/:category` - продукты по категории
- `GET /products` - все продукты
- `GET /products/favorites` - избранные продукты

## Как это работает

### При загрузке страницы меню (`menu.html`)

1. **Инициализация компонентов:**
   ```typescript
   initMenuButton();   // Кнопка меню
   initModal();         // Модальные окна
   initBurgerMenu();    // Бургер меню
   initMenuTabs();      // Вкладки категорий
   ```

2. **Загрузка продуктов из API:**
   ```typescript
   await apiMenuService.init();
   ```

3. **Динамическое создание карточек:**
   - API Menu Service создает карточки программно
   - Каждая карточка получает данные с бэкенда
   - Поддерживается фильтрация по категориям

### Переключение категорий

При клике на вкладку категории:
```typescript
menuTabsService.onCategoryChange(category);
↓
apiMenuService.loadProducts(category);
↓
fetchProducts(category);
↓
renderProducts(products);
```

## Структура данных из API

```typescript
interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;  // 'coffee' | 'tea' | 'dessert'
  image: string;
  popular?: boolean;
}
```

## Конфигурация

API конфигурация в `src/api/config.ts`:

```typescript
export const appConfig: AppConfig = {
  apiEnabled: true,        // ✅ API включен
  useStaticData: false,    // ✅ Статические данные выключены
  apiBaseUrl: 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api'
};
```

## Отключение API (fallback)

Если нужно временно отключить API и использовать статику:

1. Изменить `src/api/config.ts`:
```typescript
export const appConfig: AppConfig = {
  apiEnabled: false,
  useStaticData: true,
  apiBaseUrl: '...'
};
```

2. Добавить статические карточки обратно в `menu.html`

## Преимущества

✅ Нет дублирования данных  
✅ Актуальная информация с бэкенда  
✅ Динамическое обновление без перезагрузки  
✅ Единый источник данных  
✅ Легкое управление через административную панель бэкенда  
✅ TypeScript типизация всех запросов  

## Следующие шаги

- [ ] Настроить CORS на бэкенде
- [ ] Добавить обработку ошибок загрузки
- [ ] Реализовать пагинацию для больших списков
- [ ] Добавить кэширование продуктов
- [ ] Реализовать поиск и сортировку

## Полезные команды

```bash
# Запуск в dev режиме
npm run dev

# Сборка для production
npm run build

# Проверка кода
npm run lint

# Очистка dist
npm run clean
```

