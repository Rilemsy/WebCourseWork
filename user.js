console.log("User")
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
        if (sendButton)
        {
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
        }
