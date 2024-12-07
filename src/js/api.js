const API = {
  // Получение сообщений
  getMessages() {
    return fetch('php/chat/getMessages.php')
      .then(response => response.json())
      .catch(err => {
        console.error('Error fetching messages:', err);
        throw err;
      });
  },

  // Получение пользователей
  getUsers() {
    return fetch('php/chat/getUsers.php')
      .then(response => response.json())
      .catch(err => {
        console.error('Error fetching users:', err);
        throw err;
      });
  },

  // Отправка сообщения
  sendMessage(messageText) {
    return fetch('php/chat/sendMessage.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ content: messageText }),
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error sending message:', err);
        throw err;
      });
  },

  // Получение одного сообщения
  getMessage(messageId) {
    return fetch(`php/chat/getMessage.php?messageId=${messageId}`)
      .then(response => response.json())
      .catch(err => {
        console.error('Error fetching message:', err);
        throw err;
      });
  },

  // Редактирование сообщения
  editMessage(messageId, content) {
    return fetch('php/chat/editMessage.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, content }),
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error editing message:', err);
        throw err;
      });
  },

  // Удаление сообщения
  deleteMessage(messageId) {
    return fetch('php/chat/deleteMessage.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId }),
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error deleting message:', err);
        throw err;
      });
  },

  // Переключение блокировки пользователя
  toggleBlockUser(userId) {
    return fetch('php/chat/toggleBlockUser.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error toggling user block:', err);
        throw err;
      });
  },

  // Изменение роли пользователя
  changeUserRole(userId, newRole) {
    return fetch('php/chat/changeRole.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newRole }),
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error changing user role:', err);
        throw err;
      });
  },

  // Получение информации о пользователе
  getUserInfo() {
    return fetch('php/chat/getUserInfo.php')
      .then(response => response.json())
      .catch(err => {
        console.error('Error fetching user info:', err);
        throw err;
      });
  },

  // Авторизация
  login(username, password) {
    return fetch('php/auth/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error logging in:', err);
        throw err;
      });
  },

  // Регистрация
  register(username, password) {
    return fetch('php/auth/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error registering user:', err);
        throw err;
      });
  },
};

export default API;
