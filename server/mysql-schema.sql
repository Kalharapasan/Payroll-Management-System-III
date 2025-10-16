-- MySQL schema for PMS III (compatible with XAMPP)
CREATE DATABASE IF NOT EXISTS `pms_iii` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pms_iii`;

-- departments
CREATE TABLE IF NOT EXISTS departments (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(64) NOT NULL UNIQUE,
  manager_id CHAR(36) NULL,
  budget DECIMAL(12,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- employees
CREATE TABLE IF NOT EXISTS employees (
  id CHAR(36) PRIMARY KEY,
  employee_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address TEXT NULL,
  postcode VARCHAR(32) NULL,
  gender ENUM('m','f','') DEFAULT '',
  reference_no VARCHAR(128) NULL UNIQUE,
  department_id CHAR(36) NULL,
  tax_period VARCHAR(64) NULL,
  tax_code VARCHAR(64) NULL,
  ni_number VARCHAR(64) NULL UNIQUE,
  ni_code VARCHAR(64) NULL,
  student_ref VARCHAR(64) NULL,
  basic_salary DECIMAL(12,2) DEFAULT 0,
  employment_status ENUM('active','on_leave','terminated') DEFAULT 'active',
  hire_date DATE NULL,
  termination_date DATE NULL,
  avatar_url VARCHAR(512) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- add manager FK after employees exists
ALTER TABLE departments ADD CONSTRAINT fk_department_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- payslips
CREATE TABLE IF NOT EXISTS payslips (
  id CHAR(36) PRIMARY KEY,
  employee_id CHAR(36) NOT NULL,
  pay_date DATE NOT NULL,
  period_start DATE NULL,
  period_end DATE NULL,
  inner_city DECIMAL(12,2) DEFAULT 0,
  basic_salary DECIMAL(12,2) DEFAULT 0,
  overtime DECIMAL(12,2) DEFAULT 0,
  bonuses DECIMAL(12,2) DEFAULT 0,
  gross_pay DECIMAL(12,2) DEFAULT 0,
  taxable_pay DECIMAL(12,2) DEFAULT 0,
  pensionable_pay DECIMAL(12,2) DEFAULT 0,
  student_loan DECIMAL(12,2) DEFAULT 0,
  ni_payment DECIMAL(12,2) DEFAULT 0,
  total_deductions DECIMAL(12,2) DEFAULT 0,
  net_pay DECIMAL(12,2) DEFAULT 0,
  tax_todate DECIMAL(12,2) DEFAULT 0,
  pension_todate DECIMAL(12,2) DEFAULT 0,
  status ENUM('draft','approved','paid') DEFAULT 'draft',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payslips_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- attendance
CREATE TABLE IF NOT EXISTS attendance (
  id CHAR(36) PRIMARY KEY,
  employee_id CHAR(36) NOT NULL,
  date DATE NOT NULL,
  check_in DATETIME NULL,
  check_out DATETIME NULL,
  hours_worked DECIMAL(10,2) NULL,
  overtime_hours DECIMAL(10,2) DEFAULT 0,
  status ENUM('present','absent','leave','holiday') DEFAULT 'present',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_employee_date (employee_id, date),
  CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- simple indexes
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(employment_status);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_payslips_date ON payslips(pay_date);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
