document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById("message-input");
    const fileInput = document.getElementById("file-input");
    const sendButton = document.getElementById("send-button");
    const chatMessages = document.getElementById("chat-messages");
    const chatHeader = document.getElementById("chat-header");
    const groupId = localStorage.getItem('groupId')
    const groupName = localStorage.getItem('groupName')
    const senderId = localStorage.getItem('id')

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

    

    // Event listener for sending a message
    sendButton.addEventListener("click", async () => {
        const messageText = messageInput.value;
        const file = fileInput.files[0];
        if (messageText.trim() !== "" || file) {
            

            // Send the message to the backend using Axios
            axios.post(`http://localhost:8000/chat/${groupId}/${senderId}`, {
                
                message: messageText,
                filename: "", // Add filename and filepath if needed
                filepath: "",
            })
                .then((response) => {
                    const newMessage = response.data;
                    // After successfully sending the message, add it to the chat
                    addMessageToChat(newMessage.message, true);
                    // Clear the input field
                    
                })
                .catch((error) => {
                    console.error("Error sending message:", error);
                });
        }
        if (file) {
            // Send the file to the mediaChat endpoint
            const formData = new FormData();
            formData.append("file", file);

            const mediaResponse = await axios.post("http://localhost:8000/mediaChat", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Set the content type for file upload
                },
            });

            if (mediaResponse.status === 200) {
                const data = mediaResponse.data;
                console.log("File uploaded successfully. Server response:", data);
            } else {
                console.error("Error uploading file:", mediaResponse.statusText);
            }
        }
        messageInput.value = "";
        fileInput.value = "";
    });

    // Function to retrieve and display previous chat messages
    const retrievePreviousMessages = () => {
        // Fetch previous messages from the backend using Axios
        axios.get(`http://localhost:8000/chat/display?groupId=${groupId}`) // Replace with the actual group ID
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

    updateChatHeader(groupName);

    // Call the function to retrieve and display previous messages
    retrievePreviousMessages();

    
});
