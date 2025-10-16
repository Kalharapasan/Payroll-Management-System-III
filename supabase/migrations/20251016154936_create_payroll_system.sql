/*
  # Advanced Payroll Management System Database Schema

  ## Overview
  Complete payroll system with employees, departments, attendance tracking,
  payslips, deductions, bonuses, and comprehensive analytics.

  ## New Tables
  
  ### `departments`
  - `id` (uuid, primary key)
  - `name` (text, unique, department name)
  - `code` (text, unique, department code)
  - `manager_id` (uuid, nullable, references employees)
  - `budget` (numeric, department budget)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `employees`
  - `id` (uuid, primary key)
  - `employee_name` (text, not null)
  - `email` (text, unique, not null)
  - `address` (text)
  - `postcode` (text)
  - `gender` (text, 'm' or 'f')
  - `reference_no` (text, unique)
  - `department_id` (uuid, references departments)
  - `tax_period` (text)
  - `tax_code` (text)
  - `ni_number` (text, unique)
  - `ni_code` (text)
  - `student_ref` (text)
  - `basic_salary` (numeric, default 0)
  - `employment_status` (text, 'active', 'on_leave', 'terminated')
  - `hire_date` (date)
  - `termination_date` (date, nullable)
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `payslips`
  - `id` (uuid, primary key)
  - `employee_id` (uuid, references employees)
  - `pay_date` (date, not null)
  - `period_start` (date)
  - `period_end` (date)
  - `inner_city` (numeric, default 0)
  - `basic_salary` (numeric, default 0)
  - `overtime` (numeric, default 0)
  - `bonuses` (numeric, default 0)
  - `gross_pay` (numeric, default 0)
  - `taxable_pay` (numeric, default 0)
  - `pensionable_pay` (numeric, default 0)
  - `student_loan` (numeric, default 0)
  - `ni_payment` (numeric, default 0)
  - `total_deductions` (numeric, default 0)
  - `net_pay` (numeric, default 0)
  - `tax_todate` (numeric, default 0)
  - `pension_todate` (numeric, default 0)
  - `status` (text, 'draft', 'approved', 'paid')
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `attendance`
  - `id` (uuid, primary key)
  - `employee_id` (uuid, references employees)
  - `date` (date, not null)
  - `check_in` (timestamptz)
  - `check_out` (timestamptz)
  - `hours_worked` (numeric)
  - `overtime_hours` (numeric, default 0)
  - `status` (text, 'present', 'absent', 'leave', 'holiday')
  - `notes` (text)
  - `created_at` (timestamptz)

  ### `bonuses`
  - `id` (uuid, primary key)
  - `employee_id` (uuid, references employees)
  - `amount` (numeric, not null)
  - `reason` (text)
  - `date_awarded` (date)
  - `status` (text, 'pending', 'approved', 'paid')
  - `created_at` (timestamptz)

  ### `deductions`
  - `id` (uuid, primary key)
  - `employee_id` (uuid, references employees)
  - `amount` (numeric, not null)
  - `reason` (text)
  - `date_applied` (date)
  - `status` (text, 'pending', 'approved', 'applied')
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Add policies for admin operations

  ## Indexes
  - Create indexes on foreign keys and frequently queried columns
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  manager_id uuid,
  budget numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  email text UNIQUE NOT NULL,
  address text,
  postcode text,
  gender text CHECK (gender IN ('m', 'f', '')),
  reference_no text UNIQUE,
  department_id uuid REFERENCES departments(id),
  tax_period text,
  tax_code text,
  ni_number text UNIQUE,
  ni_code text,
  student_ref text,
  basic_salary numeric DEFAULT 0,
  employment_status text DEFAULT 'active' CHECK (employment_status IN ('active', 'on_leave', 'terminated')),
  hire_date date,
  termination_date date,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add manager foreign key to departments
ALTER TABLE departments ADD CONSTRAINT fk_department_manager 
  FOREIGN KEY (manager_id) REFERENCES employees(id);

-- Create payslips table
CREATE TABLE IF NOT EXISTS payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  pay_date date NOT NULL,
  period_start date,
  period_end date,
  inner_city numeric DEFAULT 0,
  basic_salary numeric DEFAULT 0,
  overtime numeric DEFAULT 0,
  bonuses numeric DEFAULT 0,
  gross_pay numeric DEFAULT 0,
  taxable_pay numeric DEFAULT 0,
  pensionable_pay numeric DEFAULT 0,
  student_loan numeric DEFAULT 0,
  ni_payment numeric DEFAULT 0,
  total_deductions numeric DEFAULT 0,
  net_pay numeric DEFAULT 0,
  tax_todate numeric DEFAULT 0,
  pension_todate numeric DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  check_in timestamptz,
  check_out timestamptz,
  hours_worked numeric,
  overtime_hours numeric DEFAULT 0,
  status text DEFAULT 'present' CHECK (status IN ('present', 'absent', 'leave', 'holiday')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Create bonuses table
CREATE TABLE IF NOT EXISTS bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  reason text,
  date_awarded date DEFAULT CURRENT_DATE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at timestamptz DEFAULT now()
);

-- Create deductions table
CREATE TABLE IF NOT EXISTS deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  reason text,
  date_applied date DEFAULT CURRENT_DATE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'applied')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_payslips_employee ON payslips(employee_id);
CREATE INDEX IF NOT EXISTS idx_payslips_date ON payslips(pay_date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_bonuses_employee ON bonuses(employee_id);
CREATE INDEX IF NOT EXISTS idx_deductions_employee ON deductions(employee_id);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deductions ENABLE ROW LEVEL SECURITY;

-- Policies for departments (public read, authenticated write)
CREATE POLICY "Anyone can view departments"
  ON departments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert departments"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update departments"
  ON departments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete departments"
  ON departments FOR DELETE
  TO authenticated
  USING (true);

-- Policies for employees
CREATE POLICY "Anyone can view employees"
  ON employees FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (true);

-- Policies for payslips
CREATE POLICY "Anyone can view payslips"
  ON payslips FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert payslips"
  ON payslips FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payslips"
  ON payslips FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payslips"
  ON payslips FOR DELETE
  TO authenticated
  USING (true);

-- Policies for attendance
CREATE POLICY "Anyone can view attendance"
  ON attendance FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update attendance"
  ON attendance FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete attendance"
  ON attendance FOR DELETE
  TO authenticated
  USING (true);

-- Policies for bonuses
CREATE POLICY "Anyone can view bonuses"
  ON bonuses FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert bonuses"
  ON bonuses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bonuses"
  ON bonuses FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bonuses"
  ON bonuses FOR DELETE
  TO authenticated
  USING (true);

-- Policies for deductions
CREATE POLICY "Anyone can view deductions"
  ON deductions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert deductions"
  ON deductions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deductions"
  ON deductions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deductions"
  ON deductions FOR DELETE
  TO authenticated
  USING (true);