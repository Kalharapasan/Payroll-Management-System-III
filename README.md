# 💼 Advanced Payroll Management System (PMS III)

A comprehensive, modern payroll management system built with React, TypeScript, Tailwind CSS, and MySQL. This application provides a complete solution for managing employees, generating payslips, and tracking payroll data with an intuitive and responsive user interface.

![License](https://img.shields.io/badge/license-Proprietary-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)

## 📋 Table of Contents

- [Features](#features)
- [Database Schema](#database-schema)
- [Technology Stack](#technology-stack)
- [Payroll Calculations](#payroll-calculation-formula)
- [Getting Started](#getting-started-local-mysql--api)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## ✨ Features

## ✨ Features

### 👥 Employee Management
- ➕ **CRUD Operations**: Add, edit, view, and delete employee records
- 📊 **Comprehensive Profiles**: Track personal information, contact details, and employment status
- 🏢 **Department Management**: Assign employees to departments with hierarchical structure
- 💰 **Tax & NI Tracking**: Manage tax codes and National Insurance numbers
- 📈 **Employment Status**: Monitor employee status (Active, On Leave, Terminated)
- 🔍 **Advanced Search**: Search and filter employees by various criteria
- 📅 **Date Tracking**: Record hire dates and termination dates

### 💳 Payslip Generation
- 🤖 **Automated Calculations**: Real-time payroll computation with preview
- 📉 **Standard Deductions**: 
  - Tax (9%)
  - Pension (5.5%)
  - Student Loan (2.5%)
  - National Insurance (2.3%)
- 💵 **Comprehensive Pay Components**:
  - Basic salary
  - Inner city allowance
  - Overtime pay
  - Bonuses and additional earnings
- 📝 **Status Workflow**: Track payslip status (Draft, Approved, Paid)
- 📜 **Historical Records**: Maintain complete payslip history for auditing
- 🔢 **Auto-Generated References**: Unique payslip reference numbers

### 📊 Dashboard & Analytics
- 📈 **Real-time Statistics**: Overview of key metrics
- 👤 **Employee Metrics**: Total employees and active employee count
- 💷 **Payroll Insights**: Total payroll and average salary calculations
- 🕒 **Activity Tracking**: Monitor recent system activities
- ⚡ **Quick Actions**: Fast access to common tasks
- 🎨 **Visual Analytics**: Charts and graphs for better insights

### 🎯 Advanced Features
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🎨 **Modern UI/UX**: Beautiful gradient design with smooth animations
- 🔒 **Secure Backend**: MySQL database with foreign keys and constraints
- ⚡ **High Performance**: Fast loading with optimized queries
- 🎨 **Custom Styling**: Tailored scrollbars and components
- 🔄 **Loading States**: User-friendly loading indicators
- ❌ **Error Handling**: Comprehensive error management
- ✅ **Form Validation**: Client-side and server-side validation
- 🔐 **Data Integrity**: Referential integrity with foreign key constraints

## 🗄️ Database Schema

The system uses a normalized MySQL database with the following tables:

### 📑 Tables Overview

#### **departments**
```sql
- id (Primary Key)
- name (Department name)
- code (Unique department code)
- budget (Department budget)
- manager_id (Foreign key to employees)
- created_at, updated_at
```
Manages organizational departments with budget tracking and manager assignments.

#### **employees**
```sql
- id (Primary Key)
- first_name, last_name
- email (Unique)
- phone
- date_of_birth
- hire_date
- department_id (Foreign key to departments)
- position
- employment_status (Active/On Leave/Terminated)
- termination_date
- tax_code
- ni_number (Unique)
- created_at, updated_at
```
Complete employee profiles with personal, contact, and employment information.

#### **payslips**
```sql
- id (Primary Key)
- employee_id (Foreign key to employees)
- reference_number (Unique, auto-generated)
- pay_period_start, pay_period_end
- basic_salary
- inner_city_allowance
- overtime_hours, overtime_rate
- bonuses
- gross_pay (Calculated)
- tax, pension, student_loan, ni_payment (Calculated)
- total_deductions (Calculated)
- net_pay (Calculated)
- status (Draft/Approved/Paid)
- notes
- created_at, updated_at
```
Detailed payroll records with automated calculations and status tracking.

#### **attendance** (Prepared for future implementation)
```sql
- id (Primary Key)
- employee_id (Foreign key to employees)
- date
- check_in_time, check_out_time
- hours_worked
- overtime_hours
- leave_type
- status
- created_at, updated_at
```
Daily attendance tracking with overtime and leave management.

#### **bonuses & deductions** (Prepared for future implementation)
Additional compensation and deduction management with approval workflows.

### 🔗 Relationships
- **Departments ← Employees**: One-to-many (A department can have multiple employees)
- **Employees ← Payslips**: One-to-many (An employee can have multiple payslips)
- **Employees ← Attendance**: One-to-many (An employee can have multiple attendance records)
- **Departments ← Managers**: One-to-one (A department has one manager, who is an employee)

## 🛠️ Technology Stack

### Frontend
- **⚛️ React 18.3.1** - Modern UI library with hooks
- **📘 TypeScript 5.5.3** - Type-safe JavaScript
- **⚡ Vite 5.4.2** - Lightning-fast build tool
- **🎨 Tailwind CSS 3.4.1** - Utility-first CSS framework
- **🎯 Lucide React** - Beautiful icon library
- **📦 Custom Hooks** - Reusable logic for data fetching

### Backend
- **🟢 Node.js** - JavaScript runtime
- **🚂 Express 4.19.2** - Web application framework
- **🗄️ MySQL2 3.11.3** - MySQL database driver
- **🔒 CORS** - Cross-Origin Resource Sharing
- **🔐 dotenv** - Environment variable management
- **🆔 UUID 9.0.1** - Unique identifier generation

### Database
- **🐬 MySQL** - Relational database (via XAMPP)
- **🔗 Foreign Keys** - Referential integrity
- **📊 Indexes** - Optimized query performance

### Development Tools
- **📝 ESLint 9.9.1** - Code linting
- **🎨 PostCSS 8.4.35** - CSS processing
- **🔧 TypeScript ESLint** - TypeScript linting
- **🔍 Vite Preview** - Production preview server

### Architecture
- **🏗️ Component-Based**: Modular React components
- **🎣 Custom Hooks**: Encapsulated business logic
- **🔄 REST API**: RESTful backend endpoints
- **📡 Proxy Setup**: Vite proxy for seamless development
- **🎯 Type Safety**: Full TypeScript coverage

## 💰 Payroll Calculation Formula

The system uses standardized UK-based payroll calculations:

### 📊 Calculation Steps

```
1️⃣ Gross Pay Calculation:
   Gross Pay = Basic Salary + Inner City Allowance + Overtime Pay + Bonuses
   
   Where:
   - Overtime Pay = Overtime Hours × Overtime Rate

2️⃣ Deductions Calculation:
   Tax            = Gross Pay × 9%    (Income Tax)
   Pension        = Gross Pay × 5.5%  (Pension Contribution)
   Student Loan   = Gross Pay × 2.5%  (Student Loan Repayment)
   NI Payment     = Gross Pay × 2.3%  (National Insurance)
   
   Total Deductions = Tax + Pension + Student Loan + NI Payment

3️⃣ Net Pay Calculation:
   Net Pay = Gross Pay - Total Deductions
```

### 📝 Example Calculation

For an employee with:
- Basic Salary: £3,000
- Inner City Allowance: £200
- Overtime: 10 hours @ £25/hour
- Bonus: £100

```
Gross Pay = £3,000 + £200 + (10 × £25) + £100 = £3,550

Tax          = £3,550 × 9%   = £319.50
Pension      = £3,550 × 5.5% = £195.25
Student Loan = £3,550 × 2.5% = £88.75
NI Payment   = £3,550 × 2.3% = £81.65

Total Deductions = £685.15
Net Pay = £3,550 - £685.15 = £2,864.85
```

### 🔒 Security Features

- ✅ **Foreign Key Constraints**: Ensure data integrity across tables
- ✅ **Unique Constraints**: Prevent duplicate records (email, NI number, reference number)
- ✅ **Parameterized Queries**: Protect against SQL injection
- ✅ **Input Validation**: Client and server-side validation
- ✅ **Cascading Deletes**: Maintain referential integrity on deletions

## 🚀 Getting Started (Local MySQL + API)

### Prerequisites

- **XAMPP** (or any MySQL server)
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 📝 Step-by-Step Installation

#### 1️⃣ Start MySQL Server

Start MySQL in XAMPP control panel and note your credentials:
- Default username: `root`
- Default password: (empty)
- Default port: `3306`

#### 2️⃣ Configure API Server

Navigate to the server directory and set up environment variables:

```powershell
cd server
```

Create a `.env` file (or copy from `.env.example`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pms_iii
DB_PORT=3306
PORT=5177
```

#### 3️⃣ Database Setup

The API will automatically create the `pms_iii` database and tables on first run.

**Alternative**: Manually import the schema via phpMyAdmin:
- Open http://localhost/phpmyadmin
- Import `server/mysql-schema.sql`

#### 4️⃣ Install Dependencies & Start Servers

**Terminal 1 - Backend API:**
```powershell
cd server
npm install
npm run dev
```
The API will run at `http://localhost:5177`

**Terminal 2 - Frontend:**
```powershell
# From project root
npm install
npm run dev
```
The frontend will run at `http://localhost:5173`

#### 5️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 🌱 Seed Sample Data (Optional)

To populate the database with sample data:

```powershell
cd server
npm run seed
```

This will create:
- 5 departments (Engineering, HR, Finance, Marketing, Sales)
- 15+ sample employees across different departments
- Sample payslip records

### 🔍 Verify Installation

1. **Check API Health:**
   - Visit `http://localhost:5177/api/health`
   - Should return: `{ "ok": true, "db": true }`

2. **Check Database:**
   - Open phpMyAdmin
   - Verify `pms_iii` database exists
   - Confirm tables are created (departments, employees, payslips)

3. **Check Frontend:**
   - Dashboard should load with statistics
   - Navigate through Employees and Payslips tabs

## 📁 Project Structure

```
PMS_III/
├── 📂 src/                          # Frontend source code
│   ├── 📂 components/               # React components
│   │   ├── Dashboard.tsx            # Main dashboard with statistics
│   │   ├── EmployeeTable.tsx        # Employee list and management
│   │   ├── EmployeeModal.tsx        # Add/Edit employee form
│   │   └── PayslipModal.tsx         # Payslip generation form
│   ├── 📂 hooks/                    # Custom React hooks
│   │   ├── useEmployees.ts          # Employee data management
│   │   └── usePayslips.ts           # Payslip data management
│   ├── 📂 lib/                      # Utility libraries
│   │   ├── api.ts                   # API client functions
│   │   └── supabase.ts              # (Legacy - not used)
│   ├── 📂 types/                    # TypeScript type definitions
│   │   └── index.ts                 # Shared type interfaces
│   ├── 📂 utils/                    # Utility functions
│   │   └── calculations.ts          # Payroll calculation logic
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles and Tailwind
│
├── 📂 server/                       # Backend API
│   ├── index.js                     # Express server and API routes
│   ├── mysql-schema.sql             # Database schema definition
│   ├── seed.js                      # Data seeding script
│   ├── seed.sql                     # SQL seed data
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Environment configuration
│
├── 📂 supabase/                     # Legacy (not in use)
│   └── migrations/                  # Old migration files
│
├── 📄 vite.config.ts                # Vite configuration with proxy
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 package.json                  # Frontend dependencies
└── 📄 README.md                     # This file
```

## 🌐 API Documentation

### Base URL
```
http://localhost:5177/api
```

### Endpoints

#### 🏥 Health Check
```http
GET /api/health
```
Returns API and database status.

**Response:**
```json
{
  "ok": true,
  "db": true
}
```

---

#### 👥 Employees

**Get All Employees**
```http
GET /api/employees
```

**Get Single Employee**
```http
GET /api/employees/:id
```

**Create Employee**
```http
POST /api/employees
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+44 123 456 7890",
  "date_of_birth": "1990-01-01",
  "hire_date": "2024-01-01",
  "department_id": 1,
  "position": "Software Engineer",
  "employment_status": "Active",
  "tax_code": "1257L",
  "ni_number": "AB123456C"
}
```

**Update Employee**
```http
PUT /api/employees/:id
Content-Type: application/json
```

**Delete Employee**
```http
DELETE /api/employees/:id
```

---

#### 💳 Payslips

**Get All Payslips**
```http
GET /api/payslips
```

**Get Payslips by Employee**
```http
GET /api/payslips/employee/:employeeId
```

**Create Payslip**
```http
POST /api/payslips
Content-Type: application/json

{
  "employee_id": 1,
  "pay_period_start": "2024-01-01",
  "pay_period_end": "2024-01-31",
  "basic_salary": 3000,
  "inner_city_allowance": 200,
  "overtime_hours": 10,
  "overtime_rate": 25,
  "bonuses": 100,
  "status": "Draft",
  "notes": "January 2024 payroll"
}
```

**Update Payslip**
```http
PUT /api/payslips/:id
```

**Delete Payslip**
```http
DELETE /api/payslips/:id
```

---

#### 🏢 Departments

**Get All Departments**
```http
GET /api/departments
```

**Get Single Department**
```http
GET /api/departments/:id
```

**Create Department**
```http
POST /api/departments
Content-Type: application/json

{
  "name": "Engineering",
  "code": "ENG",
  "budget": 500000,
  "manager_id": 1
}
```

**Update Department**
```http
PUT /api/departments/:id
```

**Delete Department**
```http
DELETE /api/departments/:id
```

---

### Error Responses

All endpoints return appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **404**: Not Found
- **500**: Internal Server Error

**Error Format:**
```json
{
  "error": "Error message description"
}
```

## 🔮 Future Enhancements

### Planned Features

- [ ] **📊 Advanced Analytics**
  - Monthly/yearly payroll trends
  - Department-wise expense breakdown
  - Tax and deduction analytics
  - Employee cost analysis

- [ ] **📅 Attendance Management**
  - Daily check-in/check-out tracking
  - Leave management system
  - Overtime calculation from attendance
  - Integration with payslip generation

- [ ] **🎁 Bonus & Deduction System**
  - Performance-based bonuses
  - Custom deduction types
  - Approval workflow
  - Historical tracking

- [ ] **👤 User Authentication**
  - Role-based access control (Admin, HR, Employee)
  - Employee self-service portal
  - Secure login system
  - Password management

- [ ] **📄 Report Generation**
  - PDF payslip export
  - Monthly payroll reports
  - Tax reports
  - Custom report builder

- [ ] **📧 Email Notifications**
  - Automated payslip delivery
  - Payment confirmations
  - Reminder notifications
  - System alerts

- [ ] **🔄 Data Export/Import**
  - CSV/Excel export
  - Bulk employee import
  - Data backup functionality
  - Historical data archiving

- [ ] **📱 Mobile App**
  - React Native mobile application
  - Employee mobile access
  - Push notifications
  - Mobile-optimized interface

- [ ] **🌍 Multi-Currency Support**
  - Multiple currency handling
  - Exchange rate management
  - International payroll

- [ ] **⚙️ System Configuration**
  - Customizable tax rates
  - Configurable deduction types
  - Company settings management
  - Email template editor

## 🐛 Troubleshooting

### Common Issues and Solutions

#### ❌ ECONNREFUSED on /api/* in Vite Console

**Cause:** API server is not running or listening on a different port.

**Solution:**
1. Start the API server:
   ```powershell
   cd server
   npm run dev
   ```
2. Verify the server starts with message: `PMS III API listening on http://localhost:5177`
3. Test the health endpoint: Visit `http://localhost:5177/api/health`
4. Expected response: `{ "ok": true, "db": true }`

---

#### ❌ 500 Errors from API Routes

**Cause:** Database connection issues or incorrect credentials.

**Solution:**
1. Check the API terminal for detailed stack traces
2. Verify MySQL is running in XAMPP
3. Check `server/.env` file has correct database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=pms_iii
   ```
4. If user lacks permissions to create databases:
   - Open phpMyAdmin
   - Manually import `server/mysql-schema.sql`

---

#### ❌ CORS Errors

**Cause:** Cross-origin request blocked.

**Solution:**
- Ensure both servers are running (frontend on 5173, backend on 5177)
- Check that CORS is properly configured in `server/index.js`
- Clear browser cache and restart development servers

---

#### ❌ Port Already in Use

**Cause:** Port 5173 or 5177 is already occupied.

**Solution:**
```powershell
# Check what's using the port (PowerShell)
netstat -ano | findstr :5173
netstat -ano | findstr :5177

# Kill the process using the port (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

#### ❌ Module Not Found Errors

**Cause:** Dependencies not installed properly.

**Solution:**
```powershell
# Delete node_modules and reinstall (Frontend)
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Delete node_modules and reinstall (Backend)
cd server
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

#### ⚙️ Bypass Vite Proxy (Advanced)

If you need to configure a custom API base URL:

1. Create a `.env` file in the project root
2. Add:
   ```env
   VITE_API_BASE_URL=http://localhost:5177/api
   ```
3. Restart the development server:
   ```powershell
   npm run dev
   ```

## 📝 License

**Proprietary License** - Advanced Payroll Management System © 2024-2025

All rights reserved. This software and associated documentation files are proprietary and confidential.

## 👨‍💻 Contributing

This is a proprietary project. For any questions or issues, please contact the development team.

## 📧 Support

For technical support or feature requests, please create an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Tailwind CSS** - For the excellent utility-first CSS framework
- **Vite** - For the lightning-fast build tool
- **Lucide** - For beautiful icons
- **MySQL Community** - For the robust database system

## 📊 Project Status

- **Version:** 1.0.0
- **Status:** Active Development
- **Last Updated:** October 2025

---

<div align="center">
  
**Built with ❤️ for efficient payroll management**

[Report Bug](https://github.com/Kalharapasan/Payroll-Management-System-III/issues) · [Request Feature](https://github.com/Kalharapasan/Payroll-Management-System-III/issues)

</div>
