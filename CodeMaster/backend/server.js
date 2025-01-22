require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
	.connect("mongodb://localhost:27017/CodeMaster")
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

// User Model (fsor example, update according to your schema)
const User = mongoose.model(
	"User",
	new mongoose.Schema({
		name: String,
		email: { type: String, unique: true },
		password: String,
	})
);

// Route to serve the main page
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "frontend", "src", "form.html"));
});

// Register Route
app.post("/register", async (req, res) => {
	const { name, email, password } = req.body;

	// Validate input
	if (!name || !email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Save user to database
		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error registering user" });
	}
});

// Login Route
app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	// Validate input
	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// Compare passwords
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// Respond with success (you can also include a JWT or user details)
		res.status(200).json({
			message: "Login successful",
			user: { name: user.name, email: user.email },
		});
	} catch (error) {
		res.status(500).json({ message: "Error logging in user" });
	}
});

app.use(express.static(path.join(__dirname, "..", "frontend", "src")));

// Serve static files froms the 'frontend/public' folder located outside of the backend directory
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

app.get("/api", (req, res) => {
	res.send("DSA Visualizer Backend Running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('Server running on port ${PORT}');
});
