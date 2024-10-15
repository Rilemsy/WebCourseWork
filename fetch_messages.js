document.addEventListener("DOMContentLoaded", () => {
    const messageContainer = document.getElementById("message-container");

	const createMessageElement = (message) => `
    <div class="message">
      ${message.timestamp} ${message.username}: ${message.message}
    </div>
    `
    // Fetch messages from server
    fetch("fetch_messages.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(message => {
                messageContainer.innerHTML += createMessageElement(message)
            });
            messageContainer.scrollTo(0, messageContainer.scrollHeight)
        });
});
