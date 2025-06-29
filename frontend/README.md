# The Last of Guss - Frontend

Этот проект содержит фронтенд-часть для браузерной игры "The Last of Guss". Он создан с использованием React, Vite, TypeScript, Material-UI и Zustand.

## Основные технологии

- **React 18+**
- **Vite** в качестве сборщика
- **TypeScript** со строгими правилами (`strict mode`)
- **Material-UI (MUI)** для компонентов интерфейса
- **Zustand** для управления состоянием
- **React Hook Form** и **Zod** для управления формами и валидации
- **React Router** для навигации
- **Axios** для выполнения HTTP-запросов

## Архитектура и принятые решения

- **Структура Presentational/Container:** Логика и отображение компонентов разделены для лучшей переиспользуемости и тестируемости.
- **Path Aliases:** Настроен алиас `@/` для чистого импорта компонентов и сервисов (`@/components`, `@/services`).
- **"Умный" логин:** Единый эндпоинт на сервере (`/auth/login`) обрабатывает как вход существующего пользователя, так и регистрацию нового.
- **Matrix-style Theming:** Создана кастомная тема для Material-UI, имитирующая ретро-стиль терминала. Используется пиксельный шрифт "Press Start 2P".
- **Адаптивная верстка:** Все основные компоненты (`PageLayout`) спроектированы так, чтобы корректно отображаться на разных экранах.
- **Оптимизация запросов:** Используются `AbortController` для предотвращения двойных запросов в `Strict Mode` и "умные" лоадеры для улучшения UX.

## Запуск проекта

1.  **Установите зависимости:**
    ```bash
    npm install
    ```

2.  **Настройка окружения:**
    *   Убедитесь, что бэкенд-сервер запущен.
    *   Создайте файл `.env` в корневой папке фронтенда (`frontend/.env`).
    *   Добавьте в него URL вашего бэкенд-сервера:
        ```
        VITE_API_BASE_URL=http://localhost:3001
        ```
    *   Если вы используете прокси через `vite.config.ts`, этот шаг можно пропустить, так как Vite будет перенаправлять запросы с `/api` на `http://localhost:3001`.

3.  **Запустите dev-сервер:**
    ```bash
    npm run dev
    ```
    Приложение будет доступно по адресу `http://localhost:5173` (или другому порту, если 5173 занят).

## Доступные скрипты

- `npm run dev`: запуск сервера для разработки.
- `npm run build`: сборка проекта для продакшена.
- `npm run lint`: проверка кода с помощью ESLint.
- `npm run preview`: запуск локального сервера для просмотра продакшн-сборки. 