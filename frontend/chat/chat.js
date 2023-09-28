document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Function to add a message to the chat
    function addMessage(messageText, isMyMessage = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isMyMessage ? 'my-message' : 'other-message');
        messageElement.textContent = messageText;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    // Function to retrieve existing chat messages
    async function retrieveMessages() {
        try {
            const response = await axios.get('/api/group-chat'); // Replace with your API endpoint
            const messages = response.data;

            messages.forEach((message) => {
                addMessage(`${message.sender.username}: ${message.message}`);
            });
        } catch (error) {
            console.error('Error retrieving messages:', error);
        }
    }

    // Function to send a message
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message !== '') {
            addMessage(`You: ${message}`, true);
            messageInput.value = '';

            try {
                const response = await axios.post('/api/group-chat', { message }); // Replace with your API endpoint
                // Handle the response if needed
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }

    // Event listener for send button click
    sendButton.addEventListener('click', sendMessage);

    // Event listener for Enter key in the message input
    messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Load existing messages when the page loads
    retrieveMessages();
});
