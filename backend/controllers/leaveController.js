// controllers/leaveController.js
import { db } from '../db/db.js';
import { getPublicHolidays } from '../services/holidayService.js';

/**
 * Calculates the number of business days between two dates, excluding weekends and public holidays.
 */
const calculateLeaveDays = (startDateStr, endDateStr) => {
  const holidays = getPublicHolidays(new Date(startDateStr).getFullYear());
  let count = 0;
  const curDate = new Date(startDateStr);
  const lastDate = new Date(endDateStr);

  while (curDate <= lastDate) {
    const dayOfWeek = curDate.getDay();
    const dateString = curDate.toISOString().split('T')[0];
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.has(dateString)) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

// --- Controller Functions ---

// @desc    Apply for a new leave request
// @route   POST /api/leaves/apply
// @access  Private (Employee)
export const applyForLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  const { employeeId } = req.user; // Get employeeId from the JWT payload

  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await db.read();
    const employee = db.data.employees.find(e => e.id === employeeId);

    // --- Edge Case Validations ---
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before the start date.' });
    }
    if (new Date(startDate) < new Date(employee.joiningDate)) {
      return res.status(400).json({ message: 'Cannot apply for leave before the joining date.' });
    }

    const leaveDays = calculateLeaveDays(startDate, endDate);
    if (leaveDays <= 0) {
      return res.status(400).json({ message: 'Leave duration must be at least one business day.' });
    }
    if (leaveDays > employee.leaveBalances[leaveType]) {
      return res.status(400).json({ message: `Insufficient ${leaveType} leave balance.` });
    }

    const newLeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'PENDING',
      leaveDays,
      createdAt: new Date().toISOString(),
    };

    db.data.leaveRequests.push(newLeaveRequest);
    await db.write();

    res.status(201).json({ message: 'Leave request submitted successfully.', request: newLeaveRequest });

  } catch (error) {
    console.error('Apply for leave error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all pending leave requests
// @route   GET /api/leaves/pending
// @access  Private (HR)
export const getPendingRequests = async (req, res) => {
  try {
    await db.read();
    const pending = db.data.leaveRequests.filter(r => r.status === 'PENDING');
    res.json(pending);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const handleLeaveAction = async (req, res) => {
  const { id } = req.params; // Get leave ID from the URL
  const { status, rejectionReason } = req.body; // 'APPROVED' or 'REJECTED'

  if (!status || (status !== 'APPROVED' && status !== 'REJECTED')) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  if (status === 'REJECTED' && !rejectionReason) {
    return res.status(400).json({ message: "Rejection reason is required." });
  }

  try {
    await db.read();
    const leaveRequest = db.data.leaveRequests.find(r => r.id === id);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found." });
    }
    if (leaveRequest.status !== 'PENDING') {
      return res.status(400).json({ message: "This request has already been processed." });
    }

    // --- Perform the action ---
    leaveRequest.status = status;
    if (status === 'REJECTED') {
      leaveRequest.rejectionReason = rejectionReason;
    }

    // If approved, deduct the leave balance
    if (status === 'APPROVED') {
      const employee = db.data.employees.find(e => e.id === leaveRequest.employeeId);
      if (employee) {
        employee.leaveBalances[leaveRequest.leaveType] -= leaveRequest.leaveDays;
      }
    }

    await db.write(); // Save all changes to the database file

    res.json({ message: `Leave request has been ${status.toLowerCase()}.`, request: leaveRequest });

  } catch (error) {
    console.error('Handle leave action error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getMyLeaveHistory = async (req, res) => {
  const { employeeId } = req.user;

  try {
    await db.read();
    const myRequests = db.data.leaveRequests.filter(r => r.employeeId === employeeId);
    res.json(myRequests);
  } catch (error) {
    console.error('Get my leave history error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};