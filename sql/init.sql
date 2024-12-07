-- Таблица ролей
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(15) UNIQUE NOT NULL
);

-- Заполнение ролей
INSERT INTO roles (name) VALUES 
('user'), 
('moderator'), 
('admin');

-- Таблица пользователей для связи с ролями
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT DEFAULT 1,
    is_blocked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Таблица сообщений для добавления временной отметки и роли
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Добавление пользователей
INSERT INTO users (username, password_hash, role_id, is_blocked) VALUES
('user1', '$2y$10$eImiTXuWVxfM37uY4JANjQWv.Pw5J5QuZM7f0/6FGEQRuCwA.KK2.', 1, FALSE), -- Пароль: password1
('mod1', '$2y$10$eImiTXuWVxfM37uY4JANjQWv.Pw5J5QuZM7f0/6FGEQRuCwA.KK2.', 2, FALSE), -- Пароль: password1
('admin1', '$2y$10$eImiTXuWVxfM37uY4JANjQWv.Pw5J5QuZM7f0/6FGEQRuCwA.KK2.', 3, FALSE), -- Пароль: password1
('blocked_user', '$2y$10$eImiTXuWVxfM37uY4JANjQWv.Pw5J5QuZM7f0/6FGEQRuCwA.KK2.', 1, TRUE); -- Заблокированный пользователь

-- Добавление сообщений
INSERT INTO messages (user_id, content, is_edited) VALUES
(1, 'Привет! Это сообщение от пользователя user1.', FALSE),
(2, 'Добро пожаловать в чат. Это сообщение от модератора.', FALSE),
(3, 'Приветствую всех! Это сообщение от администратора.', FALSE),
(1, 'Я только что отредактировал это сообщение.', TRUE);