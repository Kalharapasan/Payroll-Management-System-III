-- Seed data for PMS III (idempotent)
USE `pms_iii`;

-- Departments (manager_id set after employees insert)
INSERT INTO departments (id, name, code, manager_id, budget, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Engineering',    'ENG', NULL, 250000.00, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Human Resources','HR',  NULL,  90000.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Finance',        'FIN', NULL, 180000.00, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Marketing',      'MKT', NULL, 150000.00, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Sales',          'SAL', NULL, 200000.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = updated_at;

-- Employees
INSERT INTO employees (
  id, employee_name, email, address, postcode, gender, reference_no, department_id,
  tax_period, tax_code, ni_number, ni_code, student_ref, basic_salary,
  employment_status, hire_date, termination_date, avatar_url, created_at, updated_at
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alice Johnson',  'alice@example.com', '123 Main St', 'AB12 3CD', 'f', 'EMP-0001', '11111111-1111-1111-1111-111111111111', '2025-09', 'TX9', 'NI-0001', 'NIC-A', NULL, 5000.00, 'active', '2023-01-15', NULL, NULL, NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bob Smith',      'bob@example.com',   '45 River Rd', 'ZX98 7YT', 'm', 'EMP-0002', '22222222-2222-2222-2222-222222222222', '2025-09', 'TX9', 'NI-0002', 'NIC-B', NULL, 4500.00, 'active', '2022-07-01', NULL, NULL, NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Carla Gomez',    'carla@example.com', '78 Oak Ave',  'PQ45 6RS', 'f', 'EMP-0003', '33333333-3333-3333-3333-333333333333', '2025-09', 'TX9', 'NI-0003', 'NIC-C', NULL, 5500.00, 'active', '2021-03-01', NULL, NULL, NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Dave Lee',       'dave@example.com',  '9 Lake View', 'LM12 9UV', 'm', 'EMP-0004', '44444444-4444-4444-4444-444444444444', '2025-09', 'TX9', 'NI-0004', 'NIC-D', NULL, 4800.00, 'active', '2024-05-20', NULL, NULL, NOW(), NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Erin Patel',     'erin@example.com',  '2 Hill Way',  'GH34 1JK', 'f', 'EMP-0005', '55555555-5555-5555-5555-555555555555', '2025-09', 'TX9', 'NI-0005', 'NIC-E', NULL, 5200.00, 'active', '2020-11-11', NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = updated_at;

-- Department managers (set after employees are present)
UPDATE departments SET manager_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE departments SET manager_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' WHERE id = '22222222-2222-2222-2222-222222222222';

-- Payslips for September 2025 (calculations adhere to project formula)
-- Helper: functionally we supply pre-computed values
INSERT INTO payslips (
  id, employee_id, pay_date, period_start, period_end, inner_city, basic_salary, overtime, bonuses,
  gross_pay, taxable_pay, pensionable_pay, student_loan, ni_payment, total_deductions, net_pay,
  tax_todate, pension_todate, status, notes, created_at, updated_at
) VALUES
  -- Alice: 5000 + 200 + 150 + 0 = 5350
  ('ps-alice-2025-09-30-0001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-09-30', '2025-09-01', '2025-09-30', 200.00, 5000.00, 150.00, 0.00,
   5350.00, 5350.00, 5350.00, ROUND(5350.00*0.025,2), ROUND(5350.00*0.023,2), ROUND(5350.00*(0.09+0.055+0.025+0.023),2), ROUND(5350.00 - 5350.00*(0.09+0.055+0.025+0.023),2),
   ROUND(5350.00*0.09,2), ROUND(5350.00*0.055,2), 'paid', 'September payroll', NOW(), NOW()),

  -- Bob: 4500 + 100 + 0 + 100 = 4700
  ('ps-bob-2025-09-30-0001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2025-09-30', '2025-09-01', '2025-09-30', 100.00, 4500.00, 0.00, 100.00,
   4700.00, 4700.00, 4700.00, ROUND(4700.00*0.025,2), ROUND(4700.00*0.023,2), ROUND(4700.00*(0.09+0.055+0.025+0.023),2), ROUND(4700.00 - 4700.00*(0.09+0.055+0.025+0.023),2),
   ROUND(4700.00*0.09,2), ROUND(4700.00*0.055,2), 'approved', 'September payroll', NOW(), NOW()),

  -- Carla: 5500 + 0 + 200 + 150 = 5850
  ('ps-carla-2025-09-30-0001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2025-09-30', '2025-09-01', '2025-09-30', 0.00, 5500.00, 200.00, 150.00,
   5850.00, 5850.00, 5850.00, ROUND(5850.00*0.025,2), ROUND(5850.00*0.023,2), ROUND(5850.00*(0.09+0.055+0.025+0.023),2), ROUND(5850.00 - 5850.00*(0.09+0.055+0.025+0.023),2),
   ROUND(5850.00*0.09,2), ROUND(5850.00*0.055,2), 'draft', 'September payroll', NOW(), NOW()),

  -- Dave: 4800 + 50 + 120 + 80 = 5050
  ('ps-dave-2025-09-30-0001', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2025-09-30', '2025-09-01', '2025-09-30', 50.00, 4800.00, 120.00, 80.00,
   5050.00, 5050.00, 5050.00, ROUND(5050.00*0.025,2), ROUND(5050.00*0.023,2), ROUND(5050.00*(0.09+0.055+0.025+0.023),2), ROUND(5050.00 - 5050.00*(0.09+0.055+0.025+0.023),2),
   ROUND(5050.00*0.09,2), ROUND(5050.00*0.055,2), 'paid', 'September payroll', NOW(), NOW()),

  -- Erin: 5200 + 0 + 0 + 300 = 5500
  ('ps-erin-2025-09-30-0001', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2025-09-30', '2025-09-01', '2025-09-30', 0.00, 5200.00, 0.00, 300.00,
   5500.00, 5500.00, 5500.00, ROUND(5500.00*0.025,2), ROUND(5500.00*0.023,2), ROUND(5500.00*(0.09+0.055+0.025+0.023),2), ROUND(5500.00 - 5500.00*(0.09+0.055+0.025+0.023),2),
   ROUND(5500.00*0.09,2), ROUND(5500.00*0.055,2), 'approved', 'September payroll', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = updated_at;

-- Attendance sample
INSERT INTO attendance (
  id, employee_id, date, check_in, check_out, hours_worked, overtime_hours, status, notes, created_at
) VALUES
  ('att-alice-2025-09-29', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-09-29', '2025-09-29 09:00:00', '2025-09-29 17:30:00', 8.50, 0.50, 'present', NULL, NOW()),
  ('att-bob-2025-09-29',   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2025-09-29', '2025-09-29 09:15:00', '2025-09-29 17:15:00', 8.00, 0.00, 'present', NULL, NOW()),
  ('att-alice-2025-09-30', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-09-30', '2025-09-30 09:05:00', '2025-09-30 18:00:00', 8.92, 0.92, 'present', 'Month end', NOW())
ON DUPLICATE KEY UPDATE date = date;
