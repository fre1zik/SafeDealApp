#!/bin/bash

echo "🚀 GitHub Actions Setup for SafeDeal iOS App"
echo "=============================================="

# Проверяем, что мы в правильной папке
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Перейдите в папку SafeDealApp"
    exit 1
fi

# Проверяем наличие необходимых файлов
echo "🔍 Проверяем конфигурацию..."
required_files=(
    ".github/workflows/ios-build.yml"
    ".github/workflows/android-build.yml"
    "app.json"
    "eas.json"
    "ios/exportOptions.plist"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Ошибка: $file не найден"
        exit 1
    fi
done

echo "✅ Все необходимые файлы найдены"

# Проверяем Git статус
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Ошибка: Это не Git репозиторий"
    exit 1
fi

echo "📋 Инструкции по настройке GitHub Actions:"
echo ""
echo "1️⃣ Создайте репозиторий на GitHub:"
echo "   - Перейдите на github.com"
echo "   - Нажмите 'New repository'"
echo "   - Назовите репозиторий 'SafeDealApp'"
echo "   - НЕ инициализируйте с README"
echo ""

echo "2️⃣ Загрузите код в репозиторий:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/SafeDealApp.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "3️⃣ Включите GitHub Actions:"
echo "   - Перейдите в ваш репозиторий на GitHub"
echo "   - Нажмите на вкладку 'Actions'"
echo "   - Нажмите 'Enable Actions'"
echo ""

echo "4️⃣ Запустите сборку:"
echo "   - В вкладке 'Actions' нажмите 'iOS Build'"
echo "   - Нажмите 'Run workflow'"
echo "   - Выберите ветку 'main'"
echo "   - Нажмите 'Run workflow'"
echo ""

echo "📱 После успешной сборки вы получите:"
echo "   - IPA файл (iOS приложение)"
echo "   - APK файл (Android приложение)"
echo "   - Логи сборки"
echo ""

echo "📖 Подробные инструкции в файле GITHUB_ACTIONS_GUIDE.md"
echo ""

# Показываем текущий статус Git
echo "📊 Текущий статус Git:"
git status --porcelain

echo ""
echo "🎯 Готово! Следуйте инструкциям выше для настройки GitHub Actions."
echo "💡 Совет: Скопируйте команды выше и выполните их по порядку." 