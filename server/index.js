import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174; // separate from Vite dev (5173)

app.use(cors({ origin: /http:\/\/localhost:5173$/, credentials: false }));
app.use(express.json());

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pms_iii',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Helpers
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

// Employees
app.get('/api/employees', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, d.id AS department_id, d.name AS department_name, d.code AS department_code
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       ORDER BY e.created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const id = uuidv4();
    const created_at = now();
    const updated_at = created_at;
    const {
      employee_name,
      email,
      address = null,
      postcode = null,
      gender = '',
      reference_no = null,
      department_id = null,
      tax_period = null,
      tax_code = null,
      ni_number = null,
      ni_code = null,
      student_ref = null,
      basic_salary = 0,
      employment_status = 'active',
      hire_date = null,
      termination_date = null,
      avatar_url = null,
    } = req.body || {};

    await pool.query(
      `INSERT INTO employees (
        id, employee_name, email, address, postcode, gender, reference_no, department_id,
        tax_period, tax_code, ni_number, ni_code, student_ref, basic_salary, employment_status,
        hire_date, termination_date, avatar_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, employee_name, email, address, postcode, gender, reference_no, department_id,
        tax_period, tax_code, ni_number, ni_code, student_ref, basic_salary, employment_status,
        hire_date, termination_date, avatar_url, created_at, updated_at,
      ]
    );
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated_at = now();
    const fields = {
      ...req.body,
      updated_at,
    };
    // Build dynamic SET clause
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'No fields to update' });
    const setSql = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await pool.query(`UPDATE employees SET ${setSql} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Payslips
app.get('/api/payslips', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, e.employee_name, e.email
       FROM payslips p
       LEFT JOIN employees e ON p.employee_id = e.id
       ORDER BY p.pay_date DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/payslips', async (req, res) => {
  try {
    const id = uuidv4();
    const created_at = now();
    const updated_at = created_at;
    const {
      employee_id,
      pay_date,
      period_start = null,
      period_end = null,
      inner_city = 0,
      basic_salary = 0,
      overtime = 0,
      bonuses = 0,
      gross_pay = 0,
      taxable_pay = 0,
      pensionable_pay = 0,
      student_loan = 0,
      ni_payment = 0,
      total_deductions = 0,
      net_pay = 0,
      tax_todate = 0,
      pension_todate = 0,
      status = 'draft',
      notes = null,
    } = req.body || {};

    await pool.query(
      `INSERT INTO payslips (
        id, employee_id, pay_date, period_start, period_end, inner_city, basic_salary, overtime,
        bonuses, gross_pay, taxable_pay, pensionable_pay, student_loan, ni_payment, total_deductions,
        net_pay, tax_todate, pension_todate, status, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, employee_id, pay_date, period_start, period_end, inner_city, basic_salary, overtime,
        bonuses, gross_pay, taxable_pay, pensionable_pay, student_loan, ni_payment, total_deductions,
        net_pay, tax_todate, pension_todate, status, notes, created_at, updated_at,
      ]
    );
    const [rows] = await pool.query('SELECT * FROM payslips WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/payslips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated_at = now();
    const fields = { ...req.body, updated_at };
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'No fields to update' });
    const setSql = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await pool.query(`UPDATE payslips SET ${setSql} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM payslips WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/payslips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM payslips WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`PMS III API listening on http://localhost:${PORT}`);
});
