import API from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const passwordField = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');
  const errorMessage = document.getElementById('error-message');

  function togglePasswordVisibility(inputField, toggleButton) {
    const isPasswordVisible = inputField.type === 'text';
    inputField.type = isPasswordVisible ? 'password' : 'text';
    toggleButton.textContent = isPasswordVisible ? 'Показать' : 'Скрыть';
  }

  togglePassword.addEventListener('click', () => {
    togglePasswordVisibility(passwordField, togglePassword);
  });

  loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = passwordField.value.trim();

    API.login(username, password).then(data => {
      if (data.success) {
        window.location.href = 'chat.html';
      } else {
        errorMessage.textContent = 'Ошибка входа.';
      }
    });
  });
});
