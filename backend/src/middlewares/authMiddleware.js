const { auth, db } = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;

    // Fetch user role from Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(403).json({ error: "User not found in system" });
    }

    req.user.role = userDoc.data().role; // attach role to request

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
