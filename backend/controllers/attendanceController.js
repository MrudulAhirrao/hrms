// controllers/attendanceController.js
import { db } from '../db/db.js';

// Helper to get the current date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// @desc    Clock in for the current day
// @route   POST /api/attendance/clock-in
// @access  Private (Employee)
export const clockIn = async (req, res) => {
  const { employeeId } = req.user;
  const today = getTodayDateString();

  try {
    await db.read();
    const todaysRecord = db.data.attendance.find(
      (a) => a.employeeId === employeeId && a.date === today
    );

    if (todaysRecord) {
      return res.status(409).json({ message: 'You have already clocked in today.' });
    }

    const newRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      date: today,
      clockIn: new Date().toISOString(),
      clockOut: null,
    };

    db.data.attendance.push(newRecord);
    await db.write();

    res.status(201).json({ message: 'Clocked in successfully.', record: newRecord });

  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Clock out for the current day
// @route   POST /api/attendance/clock-out
// @access  Private (Employee)
export const clockOut = async (req, res) => {
  const { employeeId } = req.user;
  const today = getTodayDateString();

  try {
    await db.read();
    const todaysRecord = db.data.attendance.find(
      (a) => a.employeeId === employeeId && a.date === today
    );

    if (!todaysRecord) {
      return res.status(404).json({ message: "You haven't clocked in today." });
    }
    if (todaysRecord.clockOut) {
      return res.status(409).json({ message: 'You have already clocked out today.' });
    }

    todaysRecord.clockOut = new Date().toISOString();
    await db.write();

    res.json({ message: 'Clocked out successfully.', record: todaysRecord });

  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get the logged-in user's attendance history
// @route   GET /api/attendance/my-log
// @access  Private (Employee)
export const getMyAttendance = async (req, res) => {
  const { employeeId } = req.user;
  try {
    await db.read();
    const myLog = db.data.attendance.filter(a => a.employeeId === employeeId);
    res.json(myLog);
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all attendance logs for all employees
// @route   GET /api/attendance/all-logs
// @access  Private (HR)
export const getAllAttendance = async (req, res) => {
  try {
    await db.read();
    res.json(db.data.attendance);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};