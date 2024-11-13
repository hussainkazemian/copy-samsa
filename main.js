

function filterMenu(category) {
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    // Handle Registration Form Submission
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Prevent default form submission
            
            const full_name = document.getElementById("name").value;
            const date_of_birth = document.getElementById("dob").value;
            const contact_number = document.getElementById("contact").value;
            const address = document.getElementById("address").value;
            const email = document.getElementById("emailRegister").value;
            const password = document.getElementById("passwordRegister").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ full_name, date_of_birth, contact_number, address, email, password }),
                });
                const result = await response.json();
                alert(result.message);

                if (response.ok) {
                    $("#registerModal").modal("hide"); // Close modal on success
                }
            } catch (error) {
                console.error("Error during registration:", error);
                alert("Error during registration. Please try again.");
            }
        });
    }

    // Handle Login Form Submission
    const loginForm = document.querySelector("#loginModal form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Prevent default form submission
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    localStorage.setItem("token", result.token); // Store token
                    $("#loginModal").modal("hide"); // Close modal on success
                } else {
                    alert("Login failed: " + result.message);
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("An error occurred during login. Please try again.");
            }
        });
    }

    // Handle Forgotten Password Form Submission
    const forgotPasswordForm = document.querySelector("#forgotPasswordModal form");
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = document.getElementById("forgotEmail").value;

            try {
                const response = await fetch("http://localhost:5000/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                const result = await response.json();
                alert(result.message);

                $("#forgotPasswordModal").modal("hide"); // Close modal on success
            } catch (error) {
                console.error("Error during password reset:", error);
                alert("An error occurred during password reset. Please try again.");
            }
        });
    }
});
