document.addEventListener('DOMContentLoaded', () => {
    const createGroupButton = document.getElementById('createGroupButton');
    const userListElement = document.getElementById('userList');
    const userSelectionElement = document.getElementById('userSelection');
    const messageElement = document.getElementById('message');

    // Function to fetch and display the list of users
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/group/users');
            if (response.status === 200) {
                const users = response.data;
                users.forEach(user => {
                    const userCheckbox = document.createElement('input');
                    userCheckbox.type = 'checkbox';
                    userCheckbox.value = user.id;
                    userSelectionElement.appendChild(userCheckbox);

                    const userNameLabel = document.createElement('label');
                    userNameLabel.textContent = user.name;
                    userSelectionElement.appendChild(userNameLabel);

                    const br = document.createElement('br');
                    userSelectionElement.appendChild(br);
                });
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Call the fetchUsers function to load the list of users
    fetchUsers();

    // Event listener for creating a group
    createGroupButton.addEventListener('click', async () => {
        const adminId = localStorage.getItem('id')
        const groupName = document.getElementById('groupName').value;
        const selectedUsers = Array.from(userSelectionElement.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

        try {
            const response = await axios.post('http://localhost:8000/group', {
                adminId,
                groupName,
                usersToAdd: selectedUsers,
            });

            if (response.status === 200) {
                const data = response.data;
                messageElement.textContent = 'Group created successfully: ' + data.message;

                // Clear the form fields
                adminIdInput.value = ''; 
                groupNameInput.value = '';
                userSelectionElement.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            } else {
                const errorData = response.data;
                messageElement.textContent = `Error: ${errorData.message}`;
            }
        } catch (error) {
            console.error(error);
            messageElement.textContent = 'An error occurred.';
        }
    });
});
