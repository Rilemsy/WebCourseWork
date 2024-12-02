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
    toggleButton.textContent = isPasswordVisible ? 'Show' : 'Hide';
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
      errorMessage.textContent = 'Passwords do not match.';
      return;
    }

    fetch('php/auth/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    })
      .then(response => response.text()) // Use .text() to see the raw response
      .then(data => {
        console.log('Raw response:', data); // Log the raw response to debug
        return JSON.parse(data); // Manually parse JSON
      })
      .then(parsedData => {
        if (parsedData.success) {
          alert('Registration successful!');
          window.location.href = 'login.html';
        } else {
          errorMessage.textContent = parsedData.message || 'Registration failed.';
        }
      })
      .catch(err => {
        console.error('Error:', err); // Log the error to debug
        errorMessage.textContent =
          err.message || 'An error occurred. Please try again.';
      });
  });
});
