# Advanced Payroll Management System

A comprehensive, modern payroll management system built with React, TypeScript, Tailwind CSS, and a local MySQL database (via a lightweight Node/Express API).

## Features

### Employee Management
- Add, edit, view, and delete employees
- Track personal information, contact details, and employment status
- Department assignments with hierarchical structure
- Tax and National Insurance tracking
- Employment status management (Active, On Leave, Terminated)
- Advanced search and filtering

### Payslip Generation
- Automated payroll calculations
- Real-time calculation preview
- Tax (9%), Pension (5.5%), Student Loan (2.5%), and NI (2.3%) deductions
- Support for:
  - Basic salary
  - Inner city allowance
  - Overtime pay
  - Bonuses
- Payslip status tracking (Draft, Approved, Paid)
- Comprehensive payslip history

### Dashboard & Analytics
- Real-time statistics overview
- Total employees and active employee count
- Total payroll and average salary calculations
- Recent activity tracking
- Quick action buttons for common tasks

### Advanced Features
- Responsive design for mobile and desktop
- Beautiful gradient UI with smooth animations
- Local MySQL-backed API (no external services required)
- Secure schema with foreign keys and constraints
- Custom scrollbar styling
- Loading states and error handling
- Form validation
- Automatic reference number generation

## Database Schema

### Tables

**departments**
- Department management with budgets
- Manager assignments
- Department codes for easy reference

**employees**
- Complete employee profiles
- Tax and NI information
- Department associations
- Employment status tracking
- Hire and termination dates

**payslips**
- Detailed payroll records
- Automated calculations
- Period tracking
- Status workflow
- Notes and documentation

**attendance** (prepared for future use)
- Daily attendance tracking
- Check-in/check-out times
- Overtime tracking
- Leave management

**bonuses & deductions** (prepared for future use)
- Additional compensation tracking
- Deduction management
- Approval workflows

## Technology Stack

- Frontend: React 18 + TypeScript (Vite)
- Styling: Tailwind CSS
- Backend API: Node.js (Express) + mysql2
- Database: MySQL (XAMPP)
- Icons: Lucide React

## Payroll Calculation Formula

```
Gross Pay = Basic Salary + Inner City + Overtime + Bonuses
Tax = Gross Pay × 9%
Pension = Gross Pay × 5.5%
Student Loan = Gross Pay × 2.5%
NI Payment = Gross Pay × 2.3%
Total Deductions = Tax + Pension + Student Loan + NI
Net Pay = Gross Pay - Total Deductions
```

## Security Features

- Foreign key constraints
- Unique constraints on critical fields
- Parameterized queries

## Getting Started (Local MySQL + API)

1) Start MySQL in XAMPP and note credentials (default: user `root`, empty password).

2) Configure the API server environment:
   - Copy `server/.env.example` to `server/.env` and adjust values (DB_USER, DB_PASSWORD, etc.). The default provided matches XAMPP defaults.

3) Create database and tables (one-time):
   - The API will auto-create the `pms_iii` database and core tables on first run if they don't exist. Alternatively, you can import `server/mysql-schema.sql` via phpMyAdmin.

4) Install dependencies and start both servers (in two terminals):
   ```powershell
   # Terminal 1 - API
   cd server
   npm install
   npm run dev
   # API will run at http://localhost:5177

   # Terminal 2 - Frontend
   cd ..
   npm install
   npm run dev
   # Frontend will run at http://localhost:5173 and proxy /api to the API
   ```

5) Open http://localhost:5173 in your browser.

## Sample Data

The system includes 5 sample employees across different departments:
- Engineering
- Human Resources
- Finance
- Marketing
- Sales

## Future Enhancements


## License

Proprietary - Advanced Payroll Management System 2024

## Troubleshooting

- ECONNREFUSED on /api/* in Vite console:
   - Cause: API server not running or listening on a different port.
   - Fix: Start the API (`cd server; npm run dev`) and ensure it prints `PMS III API listening on http://localhost:5177`. Verify http://localhost:5177/api/health returns `{ ok: true, db: true }`.

- 500 errors from API routes:
   - Check the API terminal for stack traces. Ensure `server/.env` DB credentials are correct and MySQL is running. If the user lacks permissions to create DBs, import `server/mysql-schema.sql` manually via phpMyAdmin.

- Want to bypass the Vite proxy:
   - Create a `.env` in project root and set `VITE_API_BASE_URL=http://localhost:5177/api`. Restart `npm run dev` after changes.
