document.addEventListener("DOMContentLoaded", () => {
    const messagesDiv = document.getElementById("messages");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    // Fetch messages from server
    fetch("fetch_messages.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(message => {
                const msgDiv = document.createElement("div");
                msgDiv.textContent = message.username + ": " + message.message;
                messagesDiv.appendChild(msgDiv);
            });
        });

    // Send message to server
    sendButton.addEventListener("click", () => {
        const message = messageInput.value;
        if (message.trim() !== "") {
            fetch("send_message.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            }).then(response => response.text()).then(data => {
                // Refresh messages
                location.reload();
            });
        }
    });
});
