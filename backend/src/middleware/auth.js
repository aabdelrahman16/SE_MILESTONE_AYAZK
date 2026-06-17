import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "change_this_secret_in_production";

export const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// Restrict a route to specific roles
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden for your role" });
  }
  next();
};

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "7d" });
