# Coffee Shop - TypeScript + Webpack

Веб-сайт кофейни, построенный на TypeScript с использованием Webpack.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск в режиме разработки
```bash
npm run dev
```
Откроется http://localhost:9000 с hot-reload

### 3. Сборка для продакшена
```bash
npm run build
```

## 📁 Структура проекта

```
coffeshop/
├── src/                      # Исходные файлы
│   ├── index.ts             # Главная точка входа
│   ├── types.ts             # TypeScript типы
│   ├── utils.ts             # Type guards
│   ├── modules/             # Модули функциональности
│   │   ├── slider.ts
│   │   ├── menu-button.ts
│   │   ├── menu-tabs.ts
│   │   ├── modal.ts
│   │   └── burger-menu.ts
│   ├── index.html           # Главная страница
│   ├── menu.html            # Страница меню
│   ├── styles/              # CSS файлы
│   └── assets/              # Изображения
├── dist/                    # Собранные файлы
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## 🎯 Основные возможности

- ✅ **TypeScript** - строгая типизация
- ✅ **Модульная архитектура** - разделение по функциональности
- ✅ **Type Guards** - безопасная работа с типами
- ✅ **Hot Module Replacement** - быстрая разработка
- ✅ **Оптимизация** - минификация и сжатие для продакшена
- ✅ **Source Maps** - отладка с исходным кодом

## 🛠 Скрипты

- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка для продакшена
- `npm run clean` - очистка папки dist

## 📝 Технологии

- **TypeScript** - типизированный JavaScript
- **Webpack** - сборщик модулей
- **CSS Loader** - обработка стилей
- **HTML Loader** - обработка HTML
- **Mini CSS Extract** - извлечение CSS

## ⚡ Особенности

### Модульная архитектура
Весь код разделен на независимые модули:
- Слайдер кофе
- Кнопка меню
- Фильтрация категорий
- Модальное окно
- Бургер-меню

### Type Guards
Безопасная работа с типами:
```typescript
if (isHTMLElement(element)) {
  element.classList.add('active');
}
```

### Строгая типизация
Все функции и переменные имеют четкие типы, что предотвращает ошибки в runtime.

## 🔧 Настройка

### TypeScript
Настройки в `tsconfig.json`:
- Strict mode включен
- Target: ES2020
- Source maps включены

### Webpack
Конфигурация в `webpack.config.js`:
- Точка входа: `src/index.ts`
- Output: `dist/`
- Dev server на порту 9000

## 📦 Зависимости

### Production
- Нет (все в devDependencies)

### Development
- typescript
- webpack
- ts-loader
- css-loader
- html-webpack-plugin
- copy-webpack-plugin
- и другие...

## 🎨 Функциональность

1. **Слайдер кофе** - автоматическая прокрутка каждые 5 секунд
2. **Категории меню** - фильтрация по кофе/чай/десерты
3. **Модальное окно** - детальная информация о продукте
4. **Адаптивность** - бургер-меню для мобильных устройств
5. **Добавки и размеры** - динамический расчет цены
