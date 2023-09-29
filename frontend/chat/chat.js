document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const chatMessages = document.getElementById("chat-messages");
    const chatHeader = document.getElementById("chat-header");

    // Function to add a new message to the chat
    const addMessageToChat = (messageText, isUser) => {
        const messageDiv = document.createElement("div");
        messageDiv.className = isUser ? "user-message" : "other-message";
        messageDiv.textContent = messageText;
        chatMessages.appendChild(messageDiv);
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Function to update the chat header with the group name
    const updateChatHeader = (groupName) => {
        chatHeader.textContent = groupName;
    };

    // Fetch the group name from the backend using Axios
    axios.get("/api/getGroupName")
        .then((response) => {
            const groupName = response.data.groupName; // Assuming your API response has a groupName field
            updateChatHeader(groupName);
        })
        .catch((error) => {
            console.error("Error fetching group name:", error);
        });

    // Event listener for sending a message
    sendButton.addEventListener("click", () => {
        const messageText = messageInput.value;
        if (messageText.trim() !== "") {
            // Send the message to the backend using Axios
            axios.post("/api/createGroupChatMessage", {
                groupId: 123, // Replace with the actual group ID
                senderId: 456, // Replace with the actual sender ID
                message: messageText,
                filename: "", // Add filename and filepath if needed
                filepath: "",
            })
                .then((response) => {
                    const newMessage = response.data;
                    // After successfully sending the message, add it to the chat
                    addMessageToChat(newMessage.message, true);
                    // Clear the input field
                    messageInput.value = "";
                })
                .catch((error) => {
                    console.error("Error sending message:", error);
                });
        }
    });

    // Function to retrieve and display previous chat messages
    const retrievePreviousMessages = () => {
        // Fetch previous messages from the backend using Axios
        axios.get("/api/retrieveMessages?groupId=123") // Replace with the actual group ID
            .then((response) => {
                const messages = response.data;
                messages.forEach((message) => {
                    // Display each retrieved message in the chat
                    addMessageToChat(message.message, false);
                });
            })
            .catch((error) => {
                console.error("Error retrieving messages:", error);
            });
    };

    // Call the function to retrieve and display previous messages
    retrievePreviousMessages();

    // Simulate receiving a message (you can replace this with actual API calls)
    const simulateIncomingMessage = (messageText) => {
        addMessageToChat(messageText, false);
    };

    // Example: Simulate receiving a message after 2 seconds (replace with your own logic)
    setTimeout(() => {
        simulateIncomingMessage("Hello, how are you?");
    }, 2000);
});
