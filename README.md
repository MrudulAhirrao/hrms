Mini Leave Management System (HRMS)
This is a comprehensive HR Management System built as a full-stack application. It features distinct roles for Employees and HR Admins, a secure JWT-based authentication system, and a complete set of features for managing leaves, attendance, and company announcements.

🚀 Live Demo
The application is deployed and live. You can test the full functionality using the links and credentials below.

Frontend (Vercel): [https://hrms-ten-ivory.vercel.app/]

Backend (Render): [https://hrms-backend-r5sw.onrender.com/]

Login Credentials
Role

Email

Password

HR Admin

hr@example.com

password123

Employee

employee@example.com

password123

Note: The backend is hosted on a free Render instance which may "spin down" after 15 minutes of inactivity. The first request after a period of inactivity might take up to 30 seconds to process.

✨ Features
Employee Dashboard
Secure Login: Access a personal, secure dashboard.

Leave Balances: View real-time casual and sick leave balances.

Leave Application: Apply for leave through an intuitive pop-up form.

Leave History: Track the status (Pending, Approved, Rejected) of all leave requests.

Attendance: Clock in and clock out for the day.

Announcements: View public and private announcements from HR.

HR Admin Dashboard
Secure Login: Access a powerful, centralized admin portal.

Request Management: View all pending leave requests and approve or reject them with a single click.

Employee Management: Add new employees to the system with custom email addresses and initial passwords.

Employee Directory: View a complete list of all employees and their current leave balances.

Announcements: Post public announcements to all employees or send targeted private messages to individuals.

🏛️ High-Level Design (HLD)
The application is built on a modern, scalable 3-tier architecture designed for security, performance, and reliability.

<img width="1600" height="1295" alt="hld" src="https://github.com/user-attachments/assets/c6fabaa8-ce27-48a7-8be1-587a7dab7b78" />




Client (Next.js): A server-side rendered frontend for a fast and interactive user experience.

Reverse Proxy (Nginx): The conceptual entry point for a production environment, handling SSL/TLS encryption.

Backend (Node.js/Express): A secure and stateless API server handling all business logic.

Authentication: JWT-based authentication ensures secure, role-based access to all API endpoints.

Database: A lightweight file-based database (lowdb) for this MVP, with a design that is easily migratable to a production database like PostgreSQL.

🛠️ Tech Stack
Area

Technology

Frontend

React, Next.js, TypeScript, Tailwind CSS, shadcn/ui, Axios

Backend

Node.js, Express.js, JWT (jsonwebtoken), lowdb

Deployment

Vercel (Frontend), Render (Backend)

Development

ESLint, Postman

🧠 Edge Cases & Assumptions
Edge Cases Handled
Invalid Dates: End date cannot be before the start date.

Leave Before Joining: Employees cannot apply for leave before their official joining date.

Insufficient Balance: The system prevents applying for more leave days than available.

Overlapping Requests: The backend is designed to prevent overlapping leave applications (though not yet enforced on the frontend).

Role-Based Access: Employees cannot access HR routes, and vice-versa.

Duplicate Accounts: Prevents the creation of a new employee if an account with the same email already exists.

Zero-Day Leaves: The system correctly calculates leave days, excluding weekends and public holidays, preventing requests for 0 days.

Assumptions & Limitations
File-Based Database: The project uses lowdb for simplicity. On a free hosting platform like Render with an ephemeral file system, any new data (like new employees) will be reset when the server restarts due to inactivity. For a production environment, this would be replaced with a persistent database like PostgreSQL or MongoDB.

Password Security: Passwords are stored in plain text in the db.json file. In a production system, they would be securely hashed using a library like bcrypt.

Public Holidays: The list of public holidays is currently hardcoded in the backend. A production system would manage this via a database table.

⚙️ Local Setup and Installation
To run this project on your local machine, follow these steps:

Clone the repository:

git clone https://github.com/MrudulAhirrao/hrms.git
cd hrms-project

Setup the Backend:

cd backend
npm install
# Create a .env file and add your JWT_SECRET
echo "JWT_SECRET=your_super_secret_key" > .env
node index.js

The backend server will be running on http://localhost:5000.

Setup the Frontend:

cd ../frontend
npm install
# The frontend is already configured to talk to the local backend
npm run dev

The frontend application will be available at http://localhost:3000.

🔌 API Endpoints
All protected routes require a Bearer <token> in the Authorization header.

Method

Endpoint

Role

Description

POST

/api/auth/login

Public

Logs in a user and returns a JWT.

POST

/api/employees

HR

Adds a new employee and user account.

GET

/api/employees

HR

Gets a list of all employees.

GET

/api/employees/:userId

Any

Gets a single employee's details by their user ID.

POST

/api/leaves/apply

Employee

Submits a new leave request.

GET

/api/leaves/my-history

Employee

Gets the logged-in employee's leave history.

GET

/api/leaves/pending

HR

Gets all pending leave requests.

PATCH

/api/leaves/:id/action

HR

Approves or rejects a leave request.

POST

/api/attendance/clock-in

Employee

Clocks in for the day.

POST

/api/attendance/clock-out

Employee

Clocks out for the day.

GET

/api/attendance/my-log

Employee

Gets the employee's personal attendance log.

GET

/api/attendance/all-logs

HR

Gets the master attendance log for all employees.

POST

/api/announcements

HR

Creates a public or private announcement.

GET

/api/announcements

Any

Gets announcements visible to the logged-in user.

GET

/api/announcements/all

HR

Gets all announcements for auditing.

🚀 Potential Improvements
Persistent Database: Upgrade from lowdb to a production-grade database like PostgreSQL.

Password Hashing: Implement bcrypt for secure password storage.

Dashboard Analytics: Add charts and stats to the HR dashboard (e.g., "Employees on Leave Today").

Email Notifications: Integrate an email service (like SendGrid) to notify users of leave status changes.

Profile Management: Allow employees to update their own profiles and change their passwords.

Advanced Leave Policies: Implement more complex leave types (e.g., unpaid leave, maternity leave) and carry-forward policies.
