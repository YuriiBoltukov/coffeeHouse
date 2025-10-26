module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  rules: {
    // Отключаем проверку неиспользуемых переменных для production сборки
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    // Разрешаем использование any (иногда необходимо)
    '@typescript-eslint/no-explicit-any': 'warn',
    // Разрешаем пустые функции
    '@typescript-eslint/no-empty-function': 'warn',
    // Console.log разрешен для отладки
    'no-console': 'off'
  },
  ignorePatterns: ['dist', 'node_modules', '*.js']
};


