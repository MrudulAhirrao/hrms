// routes/employeeRoutes.js
import express from 'express';
import { addEmployee, getAllEmployees, getEmployeeByUserId } from '../controllers/employeeController.js';
import { protect, isHR } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is special, it's for any logged-in user to get their own details
router.get('/:userId', protect, getEmployeeByUserId);

// These routes are for HR only
router.use(protect, isHR);
router.route('/')
  .post(addEmployee)
  .get(getAllEmployees);

export default router;