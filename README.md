# Advanced Payroll Management System

A comprehensive, modern payroll management system built with React, TypeScript, Tailwind CSS, and Supabase.

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
- Real-time data synchronization with Supabase
- Secure Row Level Security (RLS) policies
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

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite

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

- Row Level Security (RLS) enabled on all tables
- Authenticated user policies
- Secure data access patterns
- Foreign key constraints
- Unique constraints on critical fields

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (already configured in `.env`):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

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

## Local MySQL setup (XAMPP)

This project can run without Supabase by connecting to a local MySQL server via a small Node/Express API.

Steps (Windows PowerShell):

1) Ensure MySQL is running in XAMPP and note credentials (default: user `root`, empty password).

2) Create database and tables:

   - Open phpMyAdmin or the MySQL CLI and execute `server/mysql-schema.sql`.

3) Configure API server env:

   - Copy `server/.env.example` to `server/.env` and adjust values (DB_USER, DB_PASSWORD, etc.).

4) Install API deps and start server:

```
cd server
npm install
npm run dev
```

It will serve at http://localhost:5174

5) Start Vite dev server in the root (new terminal):

```
npm instal
npm run dev
```

Vite dev server proxies `/api` to the API server. If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set, the frontend will use the MySQL API automatically.

Optional: To explicitly point to a non-proxied API, set `VITE_API_BASE_URL` in a `.env` file at the project root (e.g., `VITE_API_BASE_URL=http://localhost:5174/api`).
