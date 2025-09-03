const express = require("express");
const { db, auth } = require("../config/firebase");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Save extra details in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully", user: userRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login is handled on frontend with Firebase Auth SDK
// You can create protected routes using ID tokens
router.get("/profile/:uid", async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.params.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
