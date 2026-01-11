# Настройка Codemagic для iOS публикации

Этот документ описывает процесс настройки Codemagic для автоматической сборки и публикации iOS приложения в App Store.

## 📋 Предварительные требования

1. **Apple Developer Account** ($99/год)
   - Зарегистрируйтесь на [developer.apple.com](https://developer.apple.com)
   - Создайте App ID и Bundle ID

2. **Codemagic Account**
   - Зарегистрируйтесь на [codemagic.io](https://codemagic.io)
   - Подключите ваш GitHub/GitLab/Bitbucket репозиторий

3. **App Store Connect**
   - Создайте приложение в [App Store Connect](https://appstoreconnect.apple.com)
   - Заполните метаданные приложения

## 🔧 Настройка проекта

### 1. Установите Capacitor (если еще не установлен)

```bash
pnpm add -D @capacitor/cli @capacitor/core @capacitor/ios
```

### 2. Инициализируйте Capacitor

```bash
pnpm cap:init
# Или вручную:
# npx cap init "Composio Chat" "com.yourcompany.composio-chat"
```

### 3. Добавьте iOS платформу

```bash
pnpm cap:add:ios
```

### 4. Настройте Bundle ID

Откройте `ios/App/App.xcodeproj` в Xcode и настройте:
- Bundle Identifier: `com.yourcompany.composio-chat`
- Display Name: `Composio Chat`
- Version: `1.0.0`

## 🔐 Настройка Codemagic

### 1. Добавьте App Store Credentials

1. В Codemagic перейдите в **Settings** → **App Store Connect**
2. Нажмите **Add credentials**
3. Выберите один из вариантов:
   - **App Store Connect API key** (рекомендуется)
   - **App Store Connect username and password**

### 2. Создайте App Store Connect API Key

1. Перейдите в [App Store Connect](https://appstoreconnect.apple.com)
2. **Users and Access** → **Keys** → **App Store Connect API**
3. Создайте новый ключ с ролью **App Manager** или **Admin**
4. Скачайте `.p8` файл (он доступен только один раз!)
5. Загрузите ключ в Codemagic

### 3. Настройте переменные окружения

В Codemagic перейдите в **Settings** → **Environment variables** и добавьте:

```
APP_ID=com.yourcompany.composio-chat
XCODE_WORKSPACE=ios/App/App.xcworkspace
XCODE_SCHEME=App
```

### 4. Настройте группы переменных

Создайте группу `app_store_credentials` и добавьте:
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_IDENTIFIER`
- `APP_STORE_CONNECT_PRIVATE_KEY` (содержимое .p8 файла)

### 5. Обновите codemagic.yaml

Откройте `codemagic.yaml` и обновите:

```yaml
vars:
  APP_ID: "com.yourcompany.composio-chat"  # ← Ваш Bundle ID
  XCODE_WORKSPACE: "ios/App/App.xcworkspace"
  XCODE_SCHEME: "App"
```

### 6. Обновите export_options.plist

Откройте `export_options.plist` и замените:
- `YOUR_TEAM_ID` на ваш Team ID из Apple Developer

## 🚀 Первый запуск

### 1. Запустите сборку в Codemagic

1. Перейдите в ваш проект в Codemagic
2. Нажмите **Start new build**
3. Выберите ветку (обычно `main` или `master`)
4. Выберите workflow `ios-workflow`
5. Нажмите **Start build**

### 2. Проверьте логи

Следите за логами сборки. Если возникнут ошибки:
- Проверьте правильность Bundle ID
- Убедитесь, что все credentials настроены
- Проверьте, что Capacitor инициализирован

## 📱 Публикация в App Store

### Автоматическая публикация (TestFlight)

В `codemagic.yaml` раскомментируйте:

```yaml
publishing:
  app_store_connect:
    submit_to_testflight: true
    beta_groups:
      - "Internal Testing"  # Название группы в TestFlight
```

### Ручная публикация

1. После успешной сборки скачайте `.ipa` файл
2. Используйте **Transporter** или **Xcode** для загрузки в App Store Connect
3. В App Store Connect перейдите в **TestFlight** или **App Store**
4. Заполните метаданные и отправьте на ревью

## 🔄 Обновление приложения

Для обновления версии:

1. Обновите версию в `package.json`
2. Обновите версию в Xcode (`ios/App/App.xcodeproj`)
3. Запустите сборку в Codemagic
4. Приложение автоматически обновится в App Store Connect

## ⚙️ Дополнительные настройки

### Изменение конфигурации сборки

Отредактируйте `codemagic.yaml`:
- `max_build_duration` - максимальное время сборки
- `instance_type` - тип инстанса (mac_mini_m1, mac_pro, mac_mini_m1_12)
- `node` - версия Node.js
- `xcode` - версия Xcode

### Настройка уведомлений

В `codemagic.yaml` обновите email:

```yaml
publishing:
  email:
    recipients:
      - your-email@example.com
    notify:
      success: true
      failure: true
```

## 🐛 Решение проблем

### Ошибка: "No such file or directory: ios/App/App.xcworkspace"

**Решение:** Убедитесь, что Capacitor инициализирован и iOS платформа добавлена:
```bash
pnpm cap:add:ios
pnpm cap:sync
```

### Ошибка: "Code signing error"

**Решение:** 
1. Проверьте настройки подписи в Codemagic
2. Убедитесь, что App Store Connect API key настроен правильно
3. Проверьте Team ID в `export_options.plist`

### Ошибка: "Build failed: Database migration"

**Решение:** В `codemagic.yaml` скрипт миграций пропускается. Если нужны миграции:
1. Добавьте переменные окружения для БД в Codemagic
2. Раскомментируйте шаг миграций

### Ошибка: "Next.js build failed"

**Решение:**
1. Проверьте, что все зависимости установлены
2. Убедитесь, что переменные окружения настроены
3. Проверьте логи сборки для деталей

## 📚 Полезные ссылки

- [Codemagic Documentation](https://docs.codemagic.io/)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## ✅ Чеклист перед первой публикацией

- [ ] Apple Developer Account создан
- [ ] App ID и Bundle ID созданы
- [ ] App Store Connect API ключ создан и загружен в Codemagic
- [ ] Capacitor инициализирован
- [ ] iOS платформа добавлена
- [ ] Bundle ID настроен в Xcode
- [ ] Иконки приложения добавлены (1024x1024 для App Store)
- [ ] `codemagic.yaml` настроен
- [ ] `export_options.plist` обновлен с Team ID
- [ ] Первая сборка успешна
- [ ] Приложение загружено в App Store Connect
- [ ] Метаданные заполнены
- [ ] Приложение отправлено на ревью
