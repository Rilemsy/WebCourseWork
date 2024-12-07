# Chat Application – WebCourseWork

Добро пожаловать в **Chat Application**!  
Этот проект представляет собой удобную платформу для общения, созданную с использованием современных технологий и с акцентом на безопасность, масштабируемость и эстетичный интерфейс.

---

## 📌 Основные возможности

🔒 **Система ролей:** Гости, пользователи, модераторы, администраторы — у каждого уровня свои права.

💼 **Чистая архитектура:** Код организован по папкам, что облегчает поддержку и масштабирование.

🔐 **Безопасность:** Все конфиденциальные данные хранятся в `.env` и защищены от утечек.

🎨 **Простая настройка интерфейса:** Фронтенд построен на шаблонах, что упрощает кастомизацию.

---

## 📂 Структура проекта

```plaintext
.
├── assets/      # Статические файлы (иконки, изображения, шрифты)
├── css/         # Стили (основной файл: styles.css)
├── js/          # Логика клиентской стороны (основной файл: main.js)
├── php/         # Серверная логика и обработка запросов
├── .env         # Конфиденциальные данные, недоступные в репозитории
```

---

## 🛠 Используемые технологии

<div align="center">

| Технология                                                                                                        | Назначение                                              |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)                      | Серверная логика и взаимодействие с базой данных        |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) | Хранение и управление данными                           |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)                | Альтернативная база данных                              |
| ![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)                  | Верстка и структура страниц                             |
| ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)                     | Визуальное оформление и адаптивность                    |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | Обработка интерактивных элементов на клиентской стороне |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)             | Контейнеризация и упрощение развертывания               |

</div>

---

## 🔧 Установка и настройка

### 1. Клонирование репозитория

```bash
git clone -b develop https://github.com/Rilemsy/WebCourseWork.git
cd WebCourseWork
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе шаблона `.env.example` и укажите настройки базы данных:

```plaintext
DB_HOST=localhost
DB_NAME=chat_db
DB_USER=your_user
DB_PASS=your_password
```

### 3. Импорт базы данных

Выполните команду для импортирования структуры и данных в базу:

```bash
psql -U your_user -d chat_db -f chat.sql
```

### 4. Настройка веб-сервера

Настройте ваш веб-сервер (например, Apache или Nginx) для запуска приложения. Убедитесь, что указанный в `.env` пользователь базы данных имеет соответствующие права.

---

## 🚀 Как использовать

1. **Запустите приложение** через веб-сервер.
2. **Войдите как гость** или создайте пользователя.
3. **Исследуйте возможности:**
   - Общайтесь в чатах.
   - Управляйте сообщениями.
   - Используйте права модератора или администратора для контроля активности.

---

## 🤝 Участие в разработке

Мы рады любому вашему вкладу!

1. Форкните репозиторий.
2. Создайте ветку для своей фичи:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Отправьте Pull Request и добавьте описание изменений.

---

## ✨ Благодарности

Спасибо, что используете **Chat Application**! Если у вас есть вопросы или предложения, создайте [Issue](https://github.com/Rilemsy/WebCourseWork/issues) или напишите нам напрямую.

**Сделано с ❤️ и вниманием к деталям.**

<div align="center">
💬 Удачного общения!  
</div>