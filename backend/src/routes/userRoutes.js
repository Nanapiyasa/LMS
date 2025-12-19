const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers } = require("../controllers/usercontroller");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Get user profile by ID
router.get("/profile/:uid", verifyToken, getUserProfile);

// Update user profile (authenticated users only)
router.put("/profile", verifyToken, updateUserProfile);

// Get all users (admin only)
router.get("/", verifyToken, authorizeRoles('admin'), getAllUsers);

module.exports = router;
