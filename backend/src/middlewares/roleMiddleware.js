// usage: permit("admin"), permit("teacher","admin")
const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden for role: " + req.user.role });
  }
  next();
};

module.exports = { permit };
