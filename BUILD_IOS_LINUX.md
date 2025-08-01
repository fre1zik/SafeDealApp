# Сборка iOS приложения на Linux

К сожалению, для сборки iOS приложений требуется macOS с Xcode. Однако есть несколько способов обойти это ограничение:

## Вариант 1: Использование облачных сервисов

### Expo EAS Build
```bash
# Установка Expo CLI
npm install -g @expo/cli

# Инициализация Expo проекта
npx create-expo-app SafeDealExpo --template blank-typescript

# Настройка EAS
npx eas build:configure

# Сборка для iOS
npx eas build --platform ios
```

### Codemagic
1. Подключите репозиторий к Codemagic
2. Настройте CI/CD для автоматической сборки
3. Получите готовый .ipa файл

### GitHub Actions
Создайте файл `.github/workflows/ios-build.yml`:
```yaml
name: iOS Build
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build iOS
      run: |
        cd ios
        pod install
        xcodebuild -workspace SafeDealApp.xcworkspace -scheme SafeDealApp -configuration Release archive -archivePath SafeDealApp.xcarchive
```

## Вариант 2: Использование React Native Web

Создайте веб-версию приложения:

```bash
npm install react-native-web react-dom
```

Обновите `App.tsx`:
```tsx
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Веб-специфичный код
}
```

## Вариант 3: Использование Flutter

Flutter позволяет создавать iOS приложения на Linux:

```bash
# Установка Flutter
git clone https://github.com/flutter/flutter.git
export PATH="$PATH:`pwd`/flutter/bin"

# Создание проекта
flutter create safe_deal_app
cd safe_deal_app

# Сборка для iOS (требует macOS)
flutter build ios
```

## Вариант 4: Использование виртуальной машины

1. Установите VirtualBox или VMware
2. Скачайте macOS образ
3. Установите Xcode в виртуальной машине
4. Соберите приложение в VM

## Рекомендуемое решение

Для вашего проекта рекомендую:

1. **Используйте Expo EAS Build** - самый простой способ
2. **Создайте веб-версию** для тестирования на Linux
3. **Используйте GitHub Actions** для автоматической сборки

### Настройка Expo для SafeDeal

```bash
# В папке SafeDealApp
npm install expo

# Создайте app.json
{
  "expo": {
    "name": "SafeDeal",
    "slug": "safe-deal-app",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.safedeal.app"
    }
  }
}

# Сборка
npx eas build --platform ios
```

Это позволит вам создавать iOS приложения без macOS! 