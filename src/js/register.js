import API from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const passwordField = document.getElementById('password');
  const confirmPasswordField = document.getElementById('confirm-password');
  const togglePassword = document.getElementById('toggle-password');
  const toggleConfirmPassword = document.getElementById(
    'toggle-confirm-password',
  );
  const errorMessage = document.getElementById('error-message');

  function togglePasswordVisibility(inputField, toggleButton) {
    const isPasswordVisible = inputField.type === 'text';
    inputField.type = isPasswordVisible ? 'password' : 'text';
    toggleButton.textContent = isPasswordVisible ? 'Показать' : 'Скрыть';
  }

  togglePassword.addEventListener('click', () => {
    togglePasswordVisibility(passwordField, togglePassword);
  });

  toggleConfirmPassword.addEventListener('click', () => {
    togglePasswordVisibility(confirmPasswordField, toggleConfirmPassword);
  });

  registerForm.addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();

    if (password !== confirmPassword) {
      errorMessage.textContent = 'Пароли не совпадают.';
      return;
    }

    API.register(username, password).then(data => {
      if (data.success) {
        window.location.href = 'chat.html';
      } else {
        errorMessage.textContent = 'Не удалось выполнить регистрацию.';
      }
    });
  });
});
