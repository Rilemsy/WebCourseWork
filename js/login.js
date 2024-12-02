document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('login-form');
  const passwordField = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');
  const errorMessage = document.getElementById('error-message');

  function togglePasswordVisibility(inputField, toggleButton) {
    const isPasswordVisible = inputField.type === 'text';
    inputField.type = isPasswordVisible ? 'password' : 'text';
    toggleButton.textContent = isPasswordVisible ? 'Show' : 'Hide';
  }

  togglePassword.addEventListener('click', () => {
    togglePasswordVisibility(passwordField, togglePassword);
  });

  registerForm.addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = passwordField.value.trim();

    fetch('php/auth/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Registration successful!');
          window.location.href = 'chat.html';
        } else {
          errorMessage.textContent = data.message || 'Login failed.';
        }
      })
      .catch(err => {
        errorMessage.textContent =
          err.message || 'An error occurred. Please try again.';
      });
  });
});
