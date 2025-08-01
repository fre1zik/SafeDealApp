# SafeDeal Mobile App

Мобильное приложение для SafeDeal Bot - системы безопасных сделок.

## Особенности

- ✅ Создание и управление сделками
- 💰 Пополнение баланса
- ⭐ Система рейтингов
- 👥 Реферальная программа
- 🔐 Безопасные транзакции

## Установка и запуск

### Требования

- Node.js 18+
- React Native CLI
- Android Studio (для Android)
- Xcode (для iOS, только на macOS)

### Установка зависимостей

```bash
npm install
```

### Запуск на Android

```bash
npx react-native run-android
```

### Запуск на iOS (только на macOS)

```bash
npx react-native run-ios
```

## Структура проекта

```
src/
├── components/     # Переиспользуемые компоненты
├── screens/        # Экраны приложения
├── services/       # API сервисы
├── types/          # TypeScript типы
└── utils/          # Утилиты
```

## API интеграция

Приложение подключается к веб-API бота через `src/services/api.ts`.

Для работы с реальным API измените `API_BASE_URL` в файле `api.ts`.

## Сборка для продакшена

### Android

```bash
cd android
./gradlew assembleRelease
```

### iOS

```bash
cd ios
xcodebuild -workspace SafeDealApp.xcworkspace -scheme SafeDealApp -configuration Release
```

## Разработка

### Добавление новых экранов

1. Создайте файл в `src/screens/`
2. Добавьте экран в навигацию в `App.tsx`
3. Обновите типы в `src/types/`

### API методы

Все API методы находятся в `src/services/api.ts`. Добавляйте новые методы по необходимости.

## Лицензия

MIT License
