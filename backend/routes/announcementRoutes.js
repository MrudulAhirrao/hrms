// routes/announcementRoutes.js
import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  getAllAnnouncements,
} from '../controllers/announcementController.js';
import { protect, isHR } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for any logged-in user to see their announcements
router.get('/', protect, getAnnouncements);

// Routes only for HR
router.post('/', protect, isHR, createAnnouncement);
router.get('/all', protect, isHR, getAllAnnouncements);

export default router;