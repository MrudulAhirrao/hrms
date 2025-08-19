// routes/leaveRoutes.js
import express from 'express';
import { applyForLeave, getPendingRequests, handleLeaveAction, getMyLeaveHistory } from '../controllers/leaveController.js';
import { protect, isHR } from '../middleware/authMiddleware.js';

const router = express.Router();

// Employee route to apply for leave
router.post('/apply', protect, applyForLeave);
router.get('/my-history', protect, getMyLeaveHistory);

// HR route to get all pending requests
router.get('/pending', protect, isHR, getPendingRequests);

router.patch('/:id/action', protect, isHR, handleLeaveAction);

export default router;