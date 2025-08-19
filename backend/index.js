// index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import employeeRoutes from './routes/employeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import { protect, isHR } from './middleware/authMiddleware.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Apply essential middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes); 
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/announcements', announcementRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the HRMS API!' });
});

// Test routes
app.get('/api/test/protected', protect, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

app.get('/api/test/hr-only', protect, isHR, (req, res) => {
  res.json({ message: 'Welcome, HR Admin!', user: req.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});