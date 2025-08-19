// routes/authRoutes.js
import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Define the login route
// POST /api/auth/login
router.post('/login', login);

export default router;