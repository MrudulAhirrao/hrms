// controllers/authController.js
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // **CRITICAL FIX:** Always read from the file before querying
    await db.read();

    // Now, db.data is guaranteed to be populated with the file's content
    const user = db.data.users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      userId: user.id,
      role: user.role,
      employeeId: user.employeeId
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};