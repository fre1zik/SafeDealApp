# GitHub Actions - Руководство по сборке iOS приложения

## 🚀 Быстрый старт

### 1. Создайте репозиторий на GitHub

1. Перейдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Назовите репозиторий `SafeDealApp`
4. Выберите "Public" или "Private"
5. НЕ инициализируйте с README (у нас уже есть код)

### 2. Загрузите код в репозиторий

```bash
# В папке SafeDealApp
git remote add origin https://github.com/YOUR_USERNAME/SafeDealApp.git
git branch -M main
git push -u origin main
```

### 3. Включите GitHub Actions

1. Перейдите в ваш репозиторий на GitHub
2. Нажмите на вкладку "Actions"
3. Нажмите "Enable Actions"
4. Выберите "Configure" для iOS workflow

### 4. Запустите сборку

1. В вкладке "Actions" нажмите "iOS Build"
2. Нажмите "Run workflow"
3. Выберите ветку `main`
4. Нажмите "Run workflow"

## 📱 Что получите

После успешной сборки вы получите:

- **IPA файл** - готовое iOS приложение
- **APK файл** - готовое Android приложение (если запустите Android workflow)
- **Логи сборки** - для отладки проблем

## 🔧 Настройка подписи кода (опционально)

Для публикации в App Store нужно настроить подпись кода:

### 1. Создайте Apple Developer аккаунт
- Зайдите на [developer.apple.com](https://developer.apple.com)
- Создайте аккаунт ($99/год)

### 2. Создайте App ID
1. Перейдите в "Certificates, Identifiers & Profiles"
2. Выберите "Identifiers"
3. Нажмите "+" и выберите "App IDs"
4. Создайте App ID с bundle identifier `com.safedeal.app`

### 3. Создайте сертификаты
1. В том же разделе выберите "Certificates"
2. Создайте "iOS Distribution" сертификат
3. Скачайте и установите сертификат

### 4. Создайте Provisioning Profile
1. Выберите "Profiles"
2. Создайте "App Store" профиль
3. Свяжите с вашим App ID и сертификатом

### 5. Обновите exportOptions.plist

Замените `YOUR_TEAM_ID` на ваш Team ID:

```xml
<key>teamID</key>
<string>YOUR_ACTUAL_TEAM_ID</string>
```

## 🛠️ Устранение проблем

### Ошибка "No provisioning profiles found"
- Убедитесь, что у вас есть Apple Developer аккаунт
- Создайте правильный Provisioning Profile
- Обновите Team ID в exportOptions.plist

### Ошибка "Code signing is required"
- Настройте подпись кода в Apple Developer Console
- Убедитесь, что сертификаты установлены
- Проверьте Provisioning Profile

### Ошибка "Build failed"
- Проверьте логи сборки в Actions
- Убедитесь, что все зависимости установлены
- Проверьте версии Node.js и React Native

### Ошибка "Xcode not found"
- GitHub Actions автоматически устанавливает Xcode
- Убедитесь, что используете `macos-latest`

## 📊 Мониторинг сборок

### Просмотр логов
1. Перейдите в Actions
2. Выберите нужную сборку
3. Нажмите на job (iOS Build)
4. Разверните нужный step

### Скачивание артефактов
1. После завершения сборки
2. Нажмите на "SafeDealApp-iOS"
3. Скачайте IPA файл

### Настройка уведомлений
1. Перейдите в Settings → Notifications
2. Включите уведомления о Actions
3. Настройте email уведомления

## 🔄 Автоматизация

### Автоматическая сборка при push
Workflow уже настроен для автоматического запуска при push в main ветку.

### Автоматическая сборка при PR
Workflow также запускается при создании Pull Request.

### Ручной запуск
Можете запустить сборку вручную:
1. Actions → iOS Build → Run workflow
2. Выберите ветку
3. Нажмите "Run workflow"

## 📈 Статистика

GitHub Actions предоставляет:
- Время сборки
- Статус сборок
- Использование ресурсов
- Логи ошибок

## 🎯 Следующие шаги

1. **Протестируйте сборку** - запустите workflow
2. **Настройте подпись кода** - для App Store
3. **Настройте уведомления** - для отслеживания
4. **Добавьте тесты** - для качества кода
5. **Настройте деплой** - для автоматической публикации

## 📞 Поддержка

При проблемах:
1. Проверьте логи сборки
2. Убедитесь, что все файлы загружены
3. Проверьте настройки в GitHub
4. Обратитесь к документации GitHub Actions 