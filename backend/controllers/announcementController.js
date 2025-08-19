// controllers/announcementController.js
import { db } from '../db/db.js';

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private (HR)
export const createAnnouncement = async (req, res) => {
  const { title, message, employeeId } = req.body; // employeeId is optional

  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required.' });
  }

  try {
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      employeeId: employeeId || null, // Store null if it's a public broadcast
      createdAt: new Date().toISOString(),
    };

    await db.read();
    db.data.announcements.push(newAnnouncement);
    await db.write();

    res.status(201).json({ message: 'Announcement created successfully.', announcement: newAnnouncement });

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get announcements for the logged-in user
// @route   GET /api/announcements
// @access  Private (All Users)
export const getAnnouncements = async (req, res) => {
  const { employeeId } = req.user;

  try {
    await db.read();
    // Users see public announcements (employeeId is null) OR private ones sent to them
    const visibleAnnouncements = db.data.announcements.filter(
      (ann) => ann.employeeId === null || ann.employeeId === employeeId
    );

    res.json(visibleAnnouncements);

  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get ALL announcements (for HR audit)
// @route   GET /api/announcements/all
// @access  Private (HR)
export const getAllAnnouncements = async (req, res) => {
    try {
        await db.read();
        res.json(db.data.announcements);
    } catch (error) {
        console.error('Get all announcements error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};