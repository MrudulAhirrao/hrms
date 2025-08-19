// db/db.js
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs'; // Import the File System module

// DB file path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');

// --- Synchronous Initialization ---
// This part runs ONLY ONCE when the app starts.
if (!fs.existsSync(file)) {
  console.log('Database file not found. Creating a new one...');
  // Create the file with default data if it doesn't exist
  const defaultData = {
    users: [
      { id: "user-hr-001", email: "hr@example.com", password: "password123", role: "HR", employeeId: "emp-001" },
      { id: "user-emp-002", email: "employee@example.com", password: "password123", role: "Employee", employeeId: "emp-002" }
    ],
    employees: [
      { id: "emp-001", name: "Admin User", department: "HR", joiningDate: "2023-01-01", leaveBalances: { "casual": 12, "sick": 5 } },
      { id: "emp-002", name: "Regular Employee", department: "Engineering", joiningDate: "2023-05-15", leaveBalances: { "casual": 10, "sick": 5 } }
    ],
    leaveRequests: [],
    attendance: [],
    announcements: []
  };
  // Write the file synchronously to ensure it's there before the server starts
  fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
  console.log('Database initialized with default data.');
}

// --- Database Instance ---
// Now we can safely initialize lowdb because we know the file exists.
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

// Export the database instance
export { db };