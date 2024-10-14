document.addEventListener("DOMContentLoaded", () => {
    const messageContainer = document.getElementById("message-container");

    match = document.cookie.match(new RegExp('(?<=role\=)([a-zA-Z]+)'));
    role = null
    if (match)
    {
        role = decodeURIComponent(match[1]);
        console.log(role);
    }

    if ( role && role == 'user')
    {
        //userControls = document.getElementById("user-controls");
        messageContainer.insertAdjacentHTML('afterend',
		`
		<div id=\"user-controls\"\> 
			<input type=\"text\" id=\"message-input\" placeholder=\"Type your message...\"\> 
			<button id=\"send-button\">Send</button\>
		</div>
		`)
		//userControls.outerHTML = "<div id=\"user-controls\"\> <input type=\"text\" id=\"message-input\" placeholder=\"Type your message...\"\> <button id=\"send-button\">Send</button\></div>"
        //<button id=\"send-button\" disabled>Send</button>
    }

	const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

	const chatContainer = document.getElementById("chat-container");
    if (role && role == 'moderator')
    {
        chatContainer.insertAdjacentElement('afterend',
        `
        <div id="moderator-controls">
            <h4>Moderator Controls</h4>
            <input type="text" id="user-name" placeholder="Enter username">
            <br></br>
            <button id="block-button">Block</button>
        </div>
        `
        )
    }

    const blockButton = (role && role == 'moderator') ? document.getElementById("block-button") : null;

    if (role && role == 'admin')
    {
        console.log("check admin controls")
        //document.getElementById("admin-controls").style.display = "block";
        //adminControls.style.display = "block"
		chatContainer.insertAdjacentHTML('afterend',
			`
			<div id="admin-controls">
				<h4>Admin Controls</h4>
				<input type="text" id="moderator-username" placeholder="Enter username">
				<br></br>
				<button id="assign-button">Assign Moderator</button>
			</div>
			`
		)
    }

    console.log("Next")
    const assignButton = ( role && role == 'admin') ? document.getElementById("assign-button") : null;
    const moderatorUsernameInput = (role &&role == 'admin') ? document.getElementById("moderator-username") : null;

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
                
                // const msgDiv = document.createElement("div");
                // msgDiv.textContent = message.username + ": " + message.message;
                // //messageContainer. appendChild(msgDiv);
                // messageContainer.prepend(msgDiv);
            });
            messageContainer.scrollTo(0, messageContainer.scrollHeight)
            //console.log("scroll")
        });

    // Send message to server
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


	if (assignButton)
	{
		assignButton.addEventListener("click", () => {
			const username = moderatorUsernameInput.value;
			if (username.trim() !== "") {
					fetch("assign_moderator.php", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ username }),
					}).then(response => response.text()).then(data => {
					// Refresh messages
					//location.reload();
					//console.log(response)
					console.log(data)
					moderatorUsernameInput.value = ''
					});
			}
		});
	}

	if (blockButton)
	{
		blockButton.addEventListener("click", () => {
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
});
