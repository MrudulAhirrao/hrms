// controllers/employeeController.js
import { db } from '../db/db.js';

// @desc    Add a new employee and a corresponding user account
// @route   POST /api/employees
// @access  Private (HR)
export const addEmployee = async (req, res) => {
  const { name, email, password, department, joiningDate } = req.body;

  if (!name || !email || !password || !department || !joiningDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await db.read();

    // Check if user or employee with that email already exists
    if (db.data.users.some(u => u.email === email)) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // Create new employee record
    const newEmployee = {
      id: `emp-${Date.now()}`,
      name,
      department,
      joiningDate,
      leaveBalances: { "casual": 12, "sick": 5 } // Default balances
    };
    db.data.employees.push(newEmployee);

    // Create corresponding user account for the employee to log in
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // In a real app, hash this password!
      role: 'Employee',
      employeeId: newEmployee.id
    };
    db.data.users.push(newUser);

    await db.write();

    res.status(201).json({ message: 'Employee added successfully.', employee: newEmployee });

  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get a list of all employees
// @route   GET /api/employees
// @access  Private (HR)
export const getAllEmployees = async (req, res) => {
  try {
    await db.read();
    res.json(db.data.employees);
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getEmployeeByUserId = async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.params.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    const employee = db.data.employees.find(e => e.id === user.employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found.' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};