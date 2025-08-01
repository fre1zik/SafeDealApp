#!/bin/bash

echo "🚀 SafeDeal iOS Build Script"
echo "=============================="

# Проверяем, что мы в правильной папке
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Перейдите в папку SafeDealApp"
    exit 1
fi

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Проверяем наличие необходимых файлов
echo "🔍 Проверяем конфигурацию..."
if [ ! -f "app.json" ]; then
    echo "❌ Ошибка: app.json не найден"
    exit 1
fi

if [ ! -f "eas.json" ]; then
    echo "❌ Ошибка: eas.json не найден"
    exit 1
fi

echo "✅ Конфигурация в порядке"

# Показываем варианты сборки
echo ""
echo "Выберите способ сборки iOS приложения:"
echo "1) GitHub Actions (рекомендуется)"
echo "2) Codemagic"
echo "3) Expo EAS Build"
echo "4) Локальная сборка (требует macOS)"
echo ""

read -p "Введите номер (1-4): " choice

case $choice in
    1)
        echo "📋 GitHub Actions инструкции:"
        echo "1. Создайте репозиторий на GitHub"
        echo "2. Загрузите код:"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        echo "   git remote add origin https://github.com/your-username/SafeDealApp.git"
        echo "   git push -u origin main"
        echo "3. Перейдите в Actions вкладку на GitHub"
        echo "4. Нажмите 'Run workflow'"
        echo "5. Скачайте IPA файл из артефактов"
        ;;
    2)
        echo "📋 Codemagic инструкции:"
        echo "1. Зайдите на codemagic.io"
        echo "2. Подключите ваш GitHub репозиторий"
        echo "3. Настройте переменные окружения"
        echo "4. Запустите iOS workflow"
        echo "5. Скачайте IPA файл"
        ;;
    3)
        echo "📋 Expo EAS Build инструкции:"
        echo "1. Установите Expo CLI: npm install -g @expo/cli"
        echo "2. Войдите в аккаунт: npx expo login"
        echo "3. Настройте EAS: npx eas build:configure"
        echo "4. Соберите: npx eas build --platform ios"
        ;;
    4)
        echo "📋 Локальная сборка (macOS):"
        echo "1. Установите Xcode"
        echo "2. Установите CocoaPods: sudo gem install cocoapods"
        echo "3. Установите зависимости: npm install && cd ios && pod install"
        echo "4. Соберите: npx react-native run-ios --configuration Release"
        echo "5. Создайте IPA: xcodebuild -exportArchive ..."
        ;;
    *)
        echo "❌ Неверный выбор"
        exit 1
        ;;
esac

echo ""
echo "📖 Подробные инструкции в файле BUILD_INSTRUCTIONS.md"
echo "🔧 Конфигурация в файлах:"
echo "   - app.json (Expo конфигурация)"
echo "   - eas.json (EAS Build конфигурация)"
echo "   - .github/workflows/ios-build.yml (GitHub Actions)"
echo "   - codemagic.yml (Codemagic конфигурация)"
echo ""
echo "✅ Готово! Выберите подходящий способ сборки выше." 