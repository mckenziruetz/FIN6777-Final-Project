const User = require('../models/User'); 

const checkRoleMiddleware = (roles) => async (req, res, next) => {
  try {
    // Make sure req.userData is populated by previous auth middleware
    const user = await User.findById(req.userData.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    if (roles.includes(user.role)) {
      next(); // User has the role, proceed to the next middleware
    } else {
      // Log the unauthorized attempt here if needed
      res.status(403).json({ message: "You do not have permission to perform this action!" });
    }
  } catch (error) {
    // Log the error here if needed
    res.status(401).json({ message: "You are not authenticated!" });
  }
};

module.exports = checkRoleMiddleware;