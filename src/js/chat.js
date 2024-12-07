import API from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const timeUpdate = 5 * 1000;

  // Функция для обновления списка сообщений
  function fetchMessages() {
    API.getMessages().then(data => {
      const messageList = document.getElementById('message-list');
      messageList.innerHTML = '';

      data.data.forEach(msg => {
        const clone = document
          .getElementById('message-template')
          .content.cloneNode(true);
        clone.querySelector('.message-card').dataset.id = msg.id;
        clone.querySelector('.message-card').dataset.userId = msg.user_id;
        clone.querySelector('.message-card').dataset.userRole = msg.role;
        clone.querySelector('.message-date').textContent = msg.created_at;
        clone.querySelector('.message-username').textContent =
          msg.username + ':';
        clone.querySelector('.message-role').textContent = msg.role;
        clone.querySelector('.message-text').textContent = msg.content;
        if (msg.is_edited == 1) {
          clone.querySelector('.message-date').textContent += ' (исправлено)';
        }
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
        clone.querySelector('.user-card').dataset.id = user.id;
        clone.querySelector('.user-card').dataset.role = user.role;
        if (user.is_blocked == 1) {
          clone.querySelector('.user-card').classList.add('block');
        }
        clone.querySelector('.user-name').textContent = user.username;
        clone.querySelector('.user-role').textContent = user.role;
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
        errorMessage.textContent = data.message || 'Error sending the message.';
      }
    });
  });

  // ПКМ на сообщении
  document.addEventListener('contextmenu', e => {
    const messageCard = e.target.closest('.message-card');
    const userCard = e.target.closest('.user-card');
    const userInfo = document.getElementById('user-name-role');

    if (!messageCard && !userCard) return;

    e.preventDefault();

    const currentUserRole = userInfo.dataset.role;
    const userId = userInfo.dataset.id;

    if (messageCard) {
      const messageId = messageCard.dataset.id;
      const messageUserId = messageCard.dataset.userId;
      const messageUserRole = messageCard.dataset.userRole;

      showActionModal(
        'message',
        { messageId, messageUserId, messageUserRole },
        currentUserRole,
        userId,
      );
    }

    if (userCard) {
      const targetUserId = userCard.dataset.id;
      const targetUserRole = userCard.dataset.role;

      showActionModal(
        'user',
        { targetUserId, targetUserRole },
        currentUserRole,
        userId,
      );
    }
  });

  function showActionModal(type, data, currentUserRole, currentUserId) {
    const modal = document.getElementById('action-modal');
    const buttonsContainer = document.getElementById('action-buttons');
    buttonsContainer.innerHTML = ''; // Очистить старые кнопки

    if (type === 'message') {
      const { messageId, messageUserId, messageUserRole } = data;

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
        addActionButton('Заблокировать/Разблокировать пользователя', () => {
          blockOrUnblockUser(messageUserId);
        });
      }

      // Изменить роль (администратор, если не администратор)
      if (currentUserRole === 'admin' && messageUserRole !== 'admin') {
        addActionButton('Изменить роль', () => {
          showChangeRoleModal(messageUserId);
        });
      }
    }

    if (type === 'user') {
      const { targetUserId, targetUserRole } = data;

      // Изменить роль (администратор, если не администратор)
      if (currentUserRole === 'admin' && targetUserRole !== 'admin') {
        addActionButton('Изменить роль', () => {
          showChangeRoleModal(targetUserId);
        });
      }

      // Заблокировать пользователя (модератор, администратор, если ниже рангом)
      if (
        ((currentUserRole === 'moderator' && targetUserRole === 'user') ||
          (currentUserRole === 'admin' && targetUserRole !== 'admin')) &&
        targetUserId !== currentUserId
      ) {
        addActionButton('Заблокировать пользователя', () => {
          blockOrUnblockUser(targetUserId);
        });
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

  function showEditMessageModal(messageId, messageCard) {
    const modal = document.getElementById('edit-message-modal');
    const textarea = document.getElementById('edit-message-text');
    textarea.value = messageCard.querySelector('.message-content').textContent;

    modal.classList.remove('hidden');

    document.getElementById('save-message').onclick = () => {
      // Реализация сохранения изменений сообщения
      const newContent = textarea.value;
      saveMessageChanges(messageId, newContent);
      modal.classList.add('hidden');
    };

    document.getElementById('cancel-edit').onclick = () => {
      modal.classList.add('hidden');
    };
  }

  function showEditMessageModal(messageId) {
    const modal = document.getElementById('edit-message-modal');
    const textarea = document.getElementById('edit-message-text');
    const saveButton = document.getElementById('save-message');

    // Подгрузить текст сообщения
    API.getMessage(messageId).then(data => {
      if (data.success) {
        textarea.value = data.message.content;
        modal.classList.remove('hidden');
      }
    });

    saveButton.onclick = () => {
      API.editMessage(messageId, textarea.value).then(data => {
        if (data.success) {
          alert('The message has been edited.');
          modal.classList.add('hidden');
        }
      });
    };
  }

  function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    API.deleteMessage(messageId).then(data => {
      if (data.success) {
        alert('The message has been deleted.');
      }
    });
  }

  function blockOrUnblockUser(userId) {
    API.toggleBlockUser(userId).then(data => {
      if (data.success) {
        alert(
          data.isBlocked
            ? 'Error deleting the message.'
            : 'The user is unblocked.',
        );
      }
    });
  }

  function showChangeRoleModal(userId) {
    const modal = document.getElementById('change-role-modal');
    const select = document.getElementById('new-role');
    const saveButton = document.getElementById('save-role');

    modal.classList.remove('hidden');

    changeUserRole.onclick = () => {
      API.toggleBlockUser(userId, select.value).then(data => {
        if (data.success) {
          modal.classList.add('hidden');
        }
      });
    };
  }

  // Проверка авторизации пользователя
  function fetchUserInfo() {
    API.getUserInfo().then(data => {
      const userInfo = document.getElementById('user-name-role');
      const authButton = document.getElementById('auth-button');
      const messageForm = document.getElementById('message-form');
      const messageTextarea = messageForm.querySelector('textarea');
      const messageSubmitButton = messageForm.querySelector(
        'button[type="submit"]',
      );

      if (data.success) {
        const user = data.data;
        userInfo.textContent = `${user.username} (${user.role})`;
        userInfo.dataset.id = user.id;
        userInfo.dataset.role = user.role;
        userInfo.dataset.is_blocked = user.is_blocked == 1;
        userInfo.classList.remove('hidden');
        authButton.classList.add('hidden');

        // Enable message form
        messageTextarea.disabled = false;
        messageSubmitButton.disabled = false;
      } else {
        userInfo.textContent = '';
        userInfo.classList.add('hidden');
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
