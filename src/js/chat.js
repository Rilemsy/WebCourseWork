import API from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const timeUpdate = 5 * 1000;

  function translateRole(role) {
    const roles = {
      user: 'Пользователь',
      moderator: 'Модератор',
      admin: 'Администратор',
    };

    return roles[role] || 'Пользователь';
  }

  function formatDateTime(isoString) {
    const date = new Date(isoString);

    // Временная зона пользователя (в минутах)
    const userTimezoneOffset = date.getTimezoneOffset(); // От UTC в минутах
    const localDate = new Date(date.getTime() - userTimezoneOffset * 60000); // Корректируем время

    // Форматирование: DD.MM.YYYY HH:mm
    const formattedDate = localDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const formattedTime = localDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} ${formattedTime}`;
  }

  // Функция для обновления списка сообщений
  function fetchMessages() {
    API.getMessages().then(data => {
      const messageList = document.getElementById('message-list');
      messageList.innerHTML = '';

      data.data.forEach(msg => {
        const clone = document
          .getElementById('message-template')
          .content.cloneNode(true);

        const messageCard = clone.querySelector('.message-card');
        messageCard.dataset.id = msg.id;
        messageCard.querySelector('.message-date').textContent = formatDateTime(
          msg.created_at,
        );
        messageCard.querySelector('.message-username').textContent =
          msg.username + ':';
        messageCard.querySelector('.message-role').textContent = translateRole(
          msg.role,
        );
        messageCard.querySelector('.message-text').textContent = msg.content;
        if (msg.is_edited == 1) {
          messageCard.querySelector('.message-date').textContent +=
            ' (исправлено)';
        }

        messageCard.dataset.id = msg.id;
        messageCard.dataset.userId = msg.user_id;
        messageCard.dataset.userRole = msg.role;
        messageCard.dataset.is_blocked = msg.is_blocked == 1;

        messageList.appendChild(clone);
      });
    });
  }

  // Функция для обновления списка пользователей
  function fetchUsers() {
    API.getUsers().then(data => {
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';

      data.data.forEach(user => {
        const clone = document
          .getElementById('user-template')
          .content.cloneNode(true);

        const userCard = clone.querySelector('.user-card');
        if (user.is_blocked == 1) {
          userCard.classList.add('block');
        }
        userCard.querySelector('.user-name').textContent = user.username;
        userCard.querySelector('.user-role').textContent = translateRole(
          user.role,
        );

        userCard.dataset.id = user.id;
        userCard.dataset.role = user.role;
        userCard.dataset.is_blocked = user.is_blocked == 1;

        userList.appendChild(clone);
      });
    });
  }

  // Отправка сообщения
  document.getElementById('message-form').addEventListener('submit', e => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();
    const errorMessage = document.getElementById('error-message');
    if (!messageText) return;

    API.sendMessage(messageText).then(data => {
      if (data.success) {
        fetchMessages();
        e.target.reset();
      } else {
        errorMessage.textContent = 'Ошибка при отправке сообщения.';
      }
    });
  });

  // ПКМ на сообщении
  document.addEventListener('contextmenu', e => {
    const messageCard = e.target.closest('.message-card');
    const userCard = e.target.closest('.user-card');
    const userInfo = document.getElementById('user-info');

    if (!messageCard && !userCard) return;

    e.preventDefault();

    const currentUserRole = userInfo.dataset.role;
    const userId = userInfo.dataset.id;

    if (messageCard) {
      const messageId = messageCard.dataset.id;
      const messageUserId = messageCard.dataset.userId;
      const messageUserRole = messageCard.dataset.userRole;
      const messageBlocked = messageCard.dataset.is_blocked;

      showActionModal(
        'message',
        { messageId, messageUserId, messageUserRole, messageBlocked },
        currentUserRole,
        userId,
      );
    }

    if (userCard) {
      const targetUserId = userCard.dataset.id;
      const targetUserRole = userCard.dataset.role;
      const is_blocked = userCard.dataset.is_blocked;

      showActionModal(
        'user',
        { targetUserId, targetUserRole, is_blocked },
        currentUserRole,
        userId,
      );
    }
  });

  function showActionModal(type, data, currentUserRole, currentUserId) {
    const modal = document.getElementById('action-modal');
    const buttonsContainer = document.getElementById('action-buttons');
    buttonsContainer.innerHTML = '';

    if (type === 'message') {
      const { messageId, messageUserId, messageUserRole, messageBlocked } =
        data;

      // Редактировать (только автор)
      if (messageUserId === currentUserId) {
        addActionButton('Редактировать', () => {
          showEditMessageModal(messageId);
        });
      }

      // Удалить (автор, модератор, администратор)
      if (
        messageUserId === currentUserId ||
        (currentUserRole === 'moderator' && messageUserRole === 'user') ||
        (currentUserRole === 'admin' && messageUserRole !== 'admin')
      ) {
        addActionButton('Удалить', () => {
          deleteMessage(messageId);
        });
      }

      // Заблокировать пользователя (модератор, администратор)
      if (
        ((currentUserRole === 'moderator' && messageUserRole === 'user') ||
          (currentUserRole === 'admin' && messageUserRole !== 'admin')) &&
        messageUserId !== currentUserId
      ) {
        addActionButton(
          messageBlocked == 'true' ? 'Разблокировать' : 'Заблокировать',
          () => {
            blockOrUnblockUser(messageUserId);
          },
        );
      }

      // Изменить роль (администратор, если не администратор)
      if (currentUserRole === 'admin' && messageUserRole !== 'admin') {
        addActionButton('Изменить роль', () => {
          showChangeRoleModal(messageUserId, messageUserRole);
        });
      }
    }

    if (type === 'user') {
      const { targetUserId, targetUserRole, is_blocked } = data;

      // Изменить роль (администратор, если не администратор)
      if (currentUserRole === 'admin' && targetUserRole !== 'admin') {
        addActionButton('Изменить роль', () => {
          showChangeRoleModal(targetUserId, targetUserRole);
        });
      }

      // Заблокировать пользователя (модератор, администратор, если ниже рангом)
      if (
        ((currentUserRole === 'moderator' && targetUserRole === 'user') ||
          (currentUserRole === 'admin' && targetUserRole !== 'admin')) &&
        targetUserId !== currentUserId
      ) {
        addActionButton(
          is_blocked == 'true' ? 'Разблокировать' : 'Заблокировать',
          () => {
            blockOrUnblockUser(targetUserId);
          },
        );
      }
    }

    modal.classList.remove('hidden');

    // Закрыть окно
    document.getElementById('cancel-action').onclick = () => {
      modal.classList.add('hidden');
    };
  }

  function addActionButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.className = 'btn-primary';
    button.onclick = () => {
      onClick();
      document.getElementById('action-modal').classList.add('hidden');
    };
    document.getElementById('action-buttons').appendChild(button);
  }

  // Редактирование сообщения
  function showEditMessageModal(messageId) {
    const modal = document.getElementById('edit-message-modal');
    const textarea = document.getElementById('edit-message-text');
    const saveButton = document.getElementById('save-message');
    const cancelButton = document.getElementById('cancel-edit');
    let originalContent = ''; // Для хранения оригинального текста

    // Подгрузить текст сообщения
    API.getMessage(messageId).then(data => {
      if (data.success) {
        originalContent = data.data.content;
        textarea.value = originalContent;
        modal.classList.remove('hidden');
        saveButton.disabled = true; // Изначально кнопка "Сохранить" отключена
      }
    });

    // Включать/отключать кнопку "Сохранить" при изменении текста
    textarea.oninput = () => {
      saveButton.disabled = textarea.value.trim() === originalContent;
    };

    // Сохранить изменения
    saveButton.onclick = () => {
      API.editMessage(messageId, textarea.value).then(data => {
        if (data.success) {
          modal.classList.add('hidden');
          fetchMessages();
        }
      });
    };

    // Закрыть модальное окно без сохранения
    cancelButton.onclick = () => {
      modal.classList.add('hidden');
    };
  }

  // Удаление сообщения
  function deleteMessage(messageId) {
    if (!confirm('Вы уверены, что хотите удалить это сообщение?')) return;

    API.deleteMessage(messageId).then(data => {
      if (data.success) {
        fetchMessages();
      }
    });
  }

  // Блокировка пользователя
  function blockOrUnblockUser(userId) {
    API.toggleBlockUser(userId).then(data => {
      if (data.success) {
        fetchUsers();
        fetchMessages();
      }
    });
  }

  function showChangeRoleModal(userId, currentRole) {
    const modal = document.getElementById('change-role-modal');
    const select = document.getElementById('new-role');
    const saveButton = document.getElementById('save-role');
    const cancelButton = document.getElementById('cancel-role');

    // Устанавливаем текущую роль по умолчанию
    select.value = currentRole;

    // Отключаем кнопку "Сохранить" по умолчанию
    saveButton.disabled = true;

    // Показать модальное окно
    modal.classList.remove('hidden');

    // Включаем кнопку "Сохранить" только при изменении роли
    select.onchange = () => {
      saveButton.disabled = select.value === currentRole;
    };

    // Обработчик для сохранения изменений
    saveButton.onclick = () => {
      const newRole = select.value;
      if (newRole !== currentRole) {
        API.changeUserRole(userId, newRole).then(data => {
          if (data.success) {
            modal.classList.add('hidden');
            fetchMessages();
            fetchUsers();
          }
        });
      }
    };

    // Обработчик для закрытия модального окна без сохранения
    cancelButton.onclick = () => {
      modal.classList.add('hidden');
    };
  }

  // Проверка авторизации пользователя
  function fetchUserInfo() {
    API.getUserInfo().then(data => {
      const userInfo = document.getElementById('user-info');
      const userName = document.getElementById('user-name-role');
      const authButton = document.getElementById('auth-button');
      const messageForm = document.getElementById('message-form');
      const messageTextarea = messageForm.querySelector('textarea');
      const messageSubmitButton = messageForm.querySelector(
        'button[type="submit"]',
      );

      if (data.success) {
        const user = data.data;
        userName.textContent = `${user.username} (${user.role})`;
        userName.classList.remove('hidden');
        authButton.classList.add('hidden');

        userInfo.dataset.id = user.id;
        userInfo.dataset.role = user.role;
        userInfo.dataset.is_blocked = user.is_blocked == 1;

        // Enable message form
        messageTextarea.disabled = false;
        messageSubmitButton.disabled = false;
      } else {
        userName.textContent = '';
        userName.classList.add('hidden');
        authButton.classList.remove('hidden');
        authButton.textContent = 'Войти';
        authButton.onclick = () => {
          window.location.href = 'index.html';
        };

        // Disable message form
        messageTextarea.disabled = true;
        messageSubmitButton.disabled = true;
      }
    });
  }

  // Автоматическое обновление сообщений и шапки
  setInterval(() => {
    fetchUserInfo();
    fetchMessages();
    fetchUsers();
  }, timeUpdate);

  // Начальная загрузка данных
  fetchUserInfo();
  fetchMessages();
  fetchUsers();
});
