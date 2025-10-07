const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role = 'student' } = req.body;

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Save user details in Supabase users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role
      })
      .select()
      .single();

    if (userError) {
      // If user creation in our table fails, clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: userError.message });
    }

    res.status(201).json({ 
      message: "User registered successfully", 
      user: userData 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint using Supabase Auth
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: authError.message });
    }

    // Get user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json({
      user: userData,
      session: authData.session,
      message: "Login successful"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user profile by ID
router.get("/profile/:uid", async (req, res) => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.uid)
      .single();

    if (error || !userData) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
