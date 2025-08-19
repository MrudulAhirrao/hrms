// routes/attendanceRoutes.js
import express from 'express';
import {
  clockIn,
  clockOut,
  getMyAttendance,
  getAllAttendance,
} from '../controllers/attendanceController.js';
import { protect, isHR } from '../middleware/authMiddleware.js';

const router = express.Router();

// Employee routes
router.post('/clock-in', protect, clockIn);
router.post('/clock-out', protect, clockOut);
router.get('/my-log', protect, getMyAttendance);

// HR route
router.get('/all-logs', protect, isHR, getAllAttendance);

export default router;