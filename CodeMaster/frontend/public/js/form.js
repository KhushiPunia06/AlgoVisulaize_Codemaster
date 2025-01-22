const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

// Toggle forms
registerBtn.addEventListener("click", () => {
	container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
	container.classList.remove("active");
});

// Register Form Submission
registerForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const name = document.getElementById("reg-name").value;
	const email = document.getElementById("reg-email").value;
	const password = document.getElementById("reg-password").value;

	try {
		const response = await fetch("http://localhost:5000/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});

		const result = await response.json();

		if (response.ok) {
			alert("Account created successfully");
			container.classList.remove("active"); // Switch to login form
		} else {
			alert(result.message || "Failed to register. Please try again.");
		}
	} catch (error) {
		alert("Error connecting to the server. Please try again later.");
	}
});

// Login Form Submission
loginForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;

	try {
		const response = await fetch("http://localhost:5000/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const result = await response.json();

		if (response.ok) {
			alert("Login successful!");
			// Redirect to index.html or the appropriate page
			window.location.href = "index.html";
		} else {
			alert(result.message || "Invalid email or password.");
		}
	} catch (error) {
		alert("Error connecting to the server. Please try again later.");
	}
});
