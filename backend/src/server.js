const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env vars
dotenv.config();

// Initialize Firebase (instead of MongoDB)
const db = require("./config/firebase"); // this will now be Firebase Firestore

const app = express();

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the LMS Backend API" });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
