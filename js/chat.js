document.addEventListener('DOMContentLoaded', () => {
  const timeUpdate = 5 * 1000;

  // Функция для обновления списка сообщений
  function fetchMessages() {
    fetch('php/chat/getMessages.php')
      .then(response => response.json())
      .then(data => {
        const messageList = document.getElementById('message-list');
        messageList.innerHTML = ''; // Очищаем старые сообщения

        data.messages.forEach(msg => {
          const clone = document
            .getElementById('message-template')
            .content.cloneNode(true);
          clone.querySelector('.message-card').dataset.id = msg.id;
          clone.querySelector('.message-card').dataset.isAuthor = msg.isAuthor;
          clone.querySelector('.message-card').dataset.userId = msg.userId;
          clone.querySelector('.message-date').textContent = msg.date;
          clone.querySelector('.message-username').textContent =
            msg.username + ':';
          clone.querySelector('.message-role').textContent = msg.role;
          clone.querySelector('.message-text').textContent = msg.text;
          if (msg.isEdited) {
            clone.querySelector('.message-text').classList.add('edited');
          }
          messageList.appendChild(clone);
        });
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

  // Функция для обновления списка пользователей
  function fetchUsers() {
    fetch('php/chat/getUsers.php')
      .then(response => response.json())
      .then(data => {
        const userList = document.getElementById('user-list');
        userList.innerHTML = ''; // Очищаем старый список

        data.users.forEach(user => {
          const clone = document
            .getElementById('user-template')
            .content.cloneNode(true);
          clone.querySelector('.user-card').dataset.id = user.id;
          clone.querySelector('.user-name').textContent = user.name;
          clone.querySelector('.user-role').textContent = user.role;
          userList.appendChild(clone);
        });
      })
      .catch(err => console.error('Error:', err));
  }

  // Отправка сообщения
  document.getElementById('message-form').addEventListener('submit', e => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();
    const errorMessage = document.getElementById('error-message');
    if (!messageText) return;

    fetch('php/chat/sendMessage.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ message: messageText }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchMessages();
          e.target.reset();
        } else {
          alert(data.message || 'Error sending the message.');
          errorMessage.textContent =
            data.message || 'Error sending the message.';
        }
      })
      .catch(err => {
        console.error('Error:', err);
        errorMessage.textContent = err.message || 'Error sending the message.';
      });
  });

  // ПКМ на сообщении
  document.addEventListener('contextmenu', e => {
    const messageCard = e.target.closest('.message-card');
    if (!messageCard) return;

    e.preventDefault();
    const messageId = messageCard.dataset.id;

    if (messageCard.dataset.isAuthor === 'true') {
      // Редактирование сообщения
      showEditMessageModal(messageId, messageCard);
    }

    if (currentUserRole === 'moderator' || currentUserRole === 'admin') {
      const userId = messageCard.dataset.userId;
      showUserOptions(userId);
    }
  });

  // Редактирование сообщения
  function showEditMessageModal(messageId, messageCard) {
    const modal = document.getElementById('edit-message-modal');
    const textarea = modal.querySelector('#edit-message-text');
    textarea.value = messageCard.querySelector('.message-text').textContent;
    modal.classList.remove('hidden');

    document.getElementById('save-message').onclick = () => {
      const newText = textarea.value.trim();
      if (!newText) return;

      fetch('php/chat/editMessage.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ id: messageId, content: newText }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            fetchMessages();
            modal.classList.add('hidden');
          } else {
            alert(data.message || 'Editing error.');
          }
        })
        .catch(err => console.error('Error:', err));
    };

    document.getElementById('cancel-edit').onclick = () => {
      modal.classList.add('hidden');
    };
  }

  // Удаление сообщения
  function deleteMessage(messageId) {
    fetch('php/chat/deleteMessage.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ id: messageId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) fetchMessages();
        else alert(data.message || 'Deletion error.');
      })
      .catch(err => console.error('Error:', err));
  }

  // Блокировка пользователя
  function blockUser(userId) {
    fetch('php/chat/blockUser.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ id: userId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) fetchUsers();
        else alert(data.message || 'Blocking error.');
      })
      .catch(err => console.error('Error:', err));
  }

  // Изменение роли пользователя
  function showRoleModal(userId) {
    const modal = document.getElementById('change-role-modal');
    modal.classList.remove('hidden');

    document.getElementById('save-role').onclick = () => {
      const newRole = document.getElementById('new-role').value;

      fetch('php/chat/changeRole.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ id: userId, role: newRole }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            fetchUsers();
            modal.classList.add('hidden');
          } else {
            alert(data.message || 'Error changing the role.');
          }
        })
        .catch(err => console.error('Error:', err));
    };

    document.getElementById('cancel-role').onclick = () => {
      modal.classList.add('hidden');
    };
  }

  // Проверка авторизации пользователя
  function fetchUserInfo() {
    fetch('php/auth/getUserInfo.php')
      .then(response => response.json())
      .then(data => {
        const userInfo = document.getElementById('user-name-role');
        const authButton = document.getElementById('auth-button');

        if (data.isLoggedIn) {
          userInfo.textContent = `${data.username} (${data.role})`;
          userInfo.classList.remove('hidden');
          authButton.classList.add('hidden');
          currentUserRole = data.role; // Сохраняем роль пользователя для использования
        } else {
          userInfo.textContent = '';
          userInfo.classList.add('hidden');
          authButton.classList.remove('hidden');
          authButton.textContent = 'Войти';
          authButton.onclick = () => {
            window.location.href = 'index.html';
          };
        }
      })
      .catch(err => console.error('Error:', err));
  }

  // Автоматическое обновление сообщений
  setInterval(fetchMessages, timeUpdate);

  // Начальная загрузка данных
  fetchUserInfo();
  fetchMessages();
  fetchUsers();
});
