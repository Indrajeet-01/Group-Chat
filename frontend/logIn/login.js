document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("message");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const userData = {
            name: formData.get("name"),
            password: formData.get("password"),
        };

        try {
            const response = await axios.post("http://localhost:8000/user/login", userData);

            localStorage.setItem("access_token",response.data.access_token)
            localStorage.setItem("id",response.data.id)


            if (response.status === 200) {
                console.log(response.data)
                localStorage.setItem("access_token",response.data.access_token)
                message.textContent = "Login successful!";
                message.className = "success";
                setTimeout(() => {
                    window.location.href = "../home/home.html";
                }, 1000);
                // Redirect to a different page or perform further actions here
            } else {
                message.textContent = response.data || "Login failed.";
                message.className = "error";
            }
        } catch (error) {
            message.textContent = "An error occurred.";
            message.className = "error";
        }

        message.classList.remove("hidden");
    });
});