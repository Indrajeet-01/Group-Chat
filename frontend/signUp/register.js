document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registration-form");
    const message = document.getElementById("message");

    registrationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const phonenumber = document.getElementById("phonenumber").value;

        try {
            const response = await axios.post("http://localhost:8000/user/register", {
                name,
                email,
                phonenumber,
                password,
            });

            if (response.status === 200) {
                message.textContent = "User registered successfully";
                setTimeout(() => {
                    window.location.href = "../logIn/login.html";
                }, 1000);
            } else {
                message.textContent = "Registration failed";
            }
        } catch (error) {
            message.textContent = "Internal server error";
            console.error(error);
        }
    });
});
