const { supabase } = require("../config/supabase");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    // Verify Supabase JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user role from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return res.status(403).json({ error: "User not found in system" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: userData.role
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Role-based access control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
