document.addEventListener("DOMContentLoaded", async () => {
    const groupId = localStorage.getItem('groupId')
    const adminId = localStorage.getItem('adminId')
    const memberList = document.getElementById("memberList");
    const userToRemoveSelect = document.getElementById("userToRemoveSelect");
    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    // Function to make an Axios GET request
    async function axiosGet(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            errorMessage.textContent = "Error fetching data.";
            return null;
        }
    }

    // Fetch and display group members
    async function fetchGroupMembers() {
        const url = `http://localhost:8000/group/${groupId}/members`;
        const data = await axiosGet(url);

        if (data) {
            memberList.innerHTML = data.members.map(member => `<li>${member.name}</li>`).join("");
        }
    }

   // Fetch and display users available for removal
const fetchUsersForRemoval = async () => {
    try {
      const url = `http://localhost:8000/group/${groupId}/members`;
      const response = await axios.get(url);
  
      if (response.status === 200) {
        const data = response.data;
  
        if (Array.isArray(data.members)) {
          data.members.forEach(user => {
            const userCheckbox = document.createElement('input');
            userCheckbox.type = 'checkbox';
            userCheckbox.value = user.id;
            userToRemoveSelect.appendChild(userCheckbox);
  
            const userNameLabel = document.createElement('label');
            userNameLabel.textContent = user.name;
            userToRemoveSelect.appendChild(userNameLabel);
  
            const br = document.createElement('br');
            userToRemoveSelect.appendChild(br);
          });
        } else {
          errorMessage.textContent = "Data format error: 'members' is not an array.";
        }
      } else {
        console.error('Failed to fetch users for removal.');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

    // Handle form submission to remove users
    document.getElementById("removeUsersForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const userIdsToRemove = Array.from(userToRemoveSelect.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);


        console.log(userIdsToRemove)

        try {
            const url = `http://localhost:8000/group/removeMembers/${groupId}/${adminId}`;
            const response = await axios.delete(url, { data: { usersToRemove: userIdsToRemove } });
            const data = response.data;

            if (response.status === 200) {
                successMessage.textContent = data.message;
                errorMessage.textContent = "";
                fetchGroupMembers(); // Refresh the group members list
            } else {
                errorMessage.textContent = data.message;
                successMessage.textContent = "";
            } 
        } catch (error) {
            console.error(error);
            errorMessage.textContent = "Error removing user from the group.";
        }
    });

    // Initial data fetch
    fetchGroupMembers();
    fetchUsersForRemoval();
});
