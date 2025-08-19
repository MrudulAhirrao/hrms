// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user payload to the request object
      req.user = decoded;
      next(); // Proceed to the next middleware/controller

    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

// Middleware to check for a specific role (e.g., HR)
export const isHR = (req, res, next) => {
    if (req.user && req.user.role === 'HR') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. HR role required.' });
    }
};