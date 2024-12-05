document.addEventListener("DOMContentLoaded", () => {
    const messageContainer = document.getElementById("message-container");

	const createMessageElement = (message) => `
    <div class="message">
      ${message.timestamp} ${message.username}: ${message.message}
    </div>
    `
    // Fetch messages from server
    const fetchMessages = () => {
        //console.log("1 fetch")
        fetch("fetch_messages.php")
            .then(response => response.json())
            .then(data => {
                //console.log("2 fetch")
                messageContainer.textContent = ''
                data.forEach(message => {
                    const msgDiv = document.createElement("div");
                    msgDiv.classList.add("message");
                    msgDiv.innerHTML = `
                        <span><strong>${message.username}</strong>: ${message.message}</span>
                    `;
    
                    // If the message belongs to the current user, show edit/delete options
                    //if (message.user_id === loggedInUserId) {
                        const editButton = document.createElement("button");
                        editButton.textContent = "Edit";
                        editButton.onclick = () => editMessage(message.id, message.message);
    
                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "Delete";
                        deleteButton.onclick = () => deleteMessage(message.id);
    
                        msgDiv.appendChild(editButton);
                        msgDiv.appendChild(deleteButton);
                    //}
    
                    messageContainer.appendChild(msgDiv);
                });
    
                //messageContainer.scrollTop = messageContainer.scrollHeight;
            });
    };
    
    fetchMessages()
    setInterval(fetchMessages, 3000);

    const deleteMessage = (messageId) => {
        if (confirm("Are you sure you want to delete this message?")) {
            fetch("delete_message.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `message_id=${messageId}`,
            })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    fetchMessages(); // Refresh messages
                });
        }
    };
    
    
    const editMessage = (messageId, oldMessage) => {
        const newMessage = prompt("Edit your message:", oldMessage);
        if (newMessage !== null && newMessage.trim() !== "") {
            fetch("edit_message.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `message_id=${messageId}&new_message=${encodeURIComponent(newMessage)}`,
            })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    fetchMessages(); // Refresh messages
                });
        }
    };
});


