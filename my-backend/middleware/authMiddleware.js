const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided!" });
    }
    
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === "Bearer") {
      const token = parts[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = { userId: decodedToken.userId };
      next();
    } else {
      return res.status(401).json({ message: "Token format is incorrect" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "You are not authenticated!", error: error.message });
  }
};
// Could not get middleware functionality working properly, would be in phase 2
module.exports = authMiddleware;