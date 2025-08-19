// src/types/index.ts

export interface User {
  id: string;
  email: string;
  role: 'Employee' | 'HR';
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  joiningDate: string;
  leaveBalances: {
    casual: number;
    sick: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'casual' | 'sick';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  leaveDays: number;
  rejectionReason?: string;
  createdAt: string;
}