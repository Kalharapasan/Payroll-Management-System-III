
CREATE DATABASE IF NOT EXISTS psIII;
USE psIII;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    postcode VARCHAR(20),
    gender ENUM('m', 'f'),
    reference_no VARCHAR(50) UNIQUE,
    employer VARCHAR(255),
    emp_address VARCHAR(255),
    tax_period VARCHAR(10),
    tax_code VARCHAR(50),
    pay_date DATE,
    inner_city DECIMAL(10,2) DEFAULT 0,
    basic_salary DECIMAL(10,2) DEFAULT 0,
    overtime DECIMAL(10,2) DEFAULT 0,
    gross_pay DECIMAL(10,2) DEFAULT 0,
    taxable_pay DECIMAL(10,2) DEFAULT 0,
    pensionable_pay DECIMAL(10,2) DEFAULT 0,
    student_loan DECIMAL(10,2) DEFAULT 0,
    ni_payment DECIMAL(10,2) DEFAULT 0,
    deduction DECIMAL(10,2) DEFAULT 0,
    net_pay DECIMAL(10,2) DEFAULT 0,
    tax_todate DECIMAL(10,2) DEFAULT 0,
    pension_todate DECIMAL(10,2) DEFAULT 0,
    student_ref VARCHAR(50),
    ni_code VARCHAR(20),
    ni_number VARCHAR(50),
    ref_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
	
	