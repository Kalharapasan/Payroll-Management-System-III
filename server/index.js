import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5177; // separate from Vite dev server

// Allow any localhost port during development (e.g., 5173, 5174, 5176)
app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: false }));
app.use(express.json());

// Database init and pool holder
const DB_NAME = process.env.DB_NAME || 'pms_iii';
let pool; // assigned after init

async function ensureDatabaseAndSchema() {
  const baseConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT || 3306),
    multipleStatements: true,
  };

  // Create DB if missing
  const conn = await mysql.createConnection(baseConfig);
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    // Check if core tables exist; if not, load schema
    const [rows] = await conn.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('departments','employees','payslips','attendance')`,
      [DB_NAME]
    );
    const existing = new Set(rows.map((r) => r.TABLE_NAME));
    if (!existing.has('employees') || !existing.has('departments') || !existing.has('payslips') || !existing.has('attendance')) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const schemaPath = path.resolve(__dirname, 'mysql-schema.sql');
      const sql = await fs.readFile(schemaPath, 'utf8');
      await conn.query(sql);
    }
  } finally {
    await conn.end();
  }

  // Create pool for app usage
  pool = mysql.createPool({
    ...baseConfig,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok === 1 });
  } catch (e) {
    console.error('Health check error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Helpers
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

// Departments
app.get('/api/departments', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departments ORDER BY name');
    res.json(rows);
  } catch (e) {
    console.error('GET /api/departments error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Employees
app.get('/api/employees', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         e.*,
         d.id   AS dept_id,
         d.name AS dept_name,
         d.code AS dept_code,
         d.manager_id AS dept_manager_id,
         d.budget AS dept_budget,
         d.created_at AS dept_created_at,
         d.updated_at AS dept_updated_at
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       ORDER BY e.created_at DESC`
    );
    const data = rows.map((r) => {
      const department = r.dept_id
        ? {
            id: r.dept_id,
            name: r.dept_name,
            code: r.dept_code,
            manager_id: r.dept_manager_id,
            budget: r.dept_budget != null ? Number(r.dept_budget) : 0,
            created_at: r.dept_created_at,
            updated_at: r.dept_updated_at,
          }
        : undefined;
      return {
        id: r.id,
        employee_name: r.employee_name,
        email: r.email,
        address: r.address,
        postcode: r.postcode,
        gender: r.gender,
        reference_no: r.reference_no,
        department_id: r.department_id,
        tax_period: r.tax_period,
        tax_code: r.tax_code,
        ni_number: r.ni_number,
        ni_code: r.ni_code,
        student_ref: r.student_ref,
        basic_salary: r.basic_salary != null ? Number(r.basic_salary) : 0,
        employment_status: r.employment_status,
        hire_date: r.hire_date,
        termination_date: r.termination_date,
        avatar_url: r.avatar_url,
        created_at: r.created_at,
        updated_at: r.updated_at,
        department,
      };
    });
    res.json(data);
  } catch (e) {
    console.error('GET /api/employees error:', e);
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
    console.error('POST /api/employees error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated_at = now();
    
    // Define valid employee table columns
    const validColumns = new Set([
      'id', 'employee_name', 'email', 'address', 'postcode', 'gender',
      'reference_no', 'department_id', 'tax_period', 'tax_code', 'ni_number',
      'ni_code', 'student_ref', 'basic_salary', 'employment_status',
      'hire_date', 'termination_date', 'avatar_url', 'updated_at'
    ]);
    
    // Filter out invalid fields (like nested 'department' object)
    const fields = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (validColumns.has(key)) {
        fields[key] = value;
      }
    }
    fields.updated_at = updated_at;
    
    // Build dynamic SET clause
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'No fields to update' });
    const setSql = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await pool.query(`UPDATE employees SET ${setSql} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('PUT /api/employees/:id error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) {
    console.error('DELETE /api/employees/:id error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Payslips
app.get('/api/payslips', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         p.*, 
         e.id AS emp_id,
         e.employee_name AS emp_name,
         e.email AS emp_email,
         e.basic_salary AS emp_basic_salary
       FROM payslips p
       LEFT JOIN employees e ON p.employee_id = e.id
       ORDER BY p.pay_date DESC`
    );
    const data = rows.map((r) => ({
      id: r.id,
      employee_id: r.employee_id,
      pay_date: r.pay_date,
      period_start: r.period_start,
      period_end: r.period_end,
      inner_city: Number(r.inner_city || 0),
      basic_salary: Number(r.basic_salary || 0),
      overtime: Number(r.overtime || 0),
      bonuses: Number(r.bonuses || 0),
      gross_pay: Number(r.gross_pay || 0),
      taxable_pay: Number(r.taxable_pay || 0),
      pensionable_pay: Number(r.pensionable_pay || 0),
      student_loan: Number(r.student_loan || 0),
      ni_payment: Number(r.ni_payment || 0),
      total_deductions: Number(r.total_deductions || 0),
      net_pay: Number(r.net_pay || 0),
      tax_todate: Number(r.tax_todate || 0),
      pension_todate: Number(r.pension_todate || 0),
      status: r.status,
      notes: r.notes,
      created_at: r.created_at,
      updated_at: r.updated_at,
      employee: r.emp_id
        ? {
            id: r.emp_id,
            employee_name: r.emp_name,
            email: r.emp_email,
            basic_salary: r.emp_basic_salary != null ? Number(r.emp_basic_salary) : 0,
          }
        : undefined,
    }));
    res.json(data);
  } catch (e) {
    console.error('GET /api/payslips error:', e);
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
    console.error('POST /api/payslips error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/payslips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated_at = now();
    
    // Define valid payslip table columns
    const validColumns = new Set([
      'id', 'employee_id', 'pay_date', 'period_start', 'period_end',
      'inner_city', 'basic_salary', 'overtime', 'bonuses', 'gross_pay',
      'taxable_pay', 'pensionable_pay', 'student_loan', 'ni_payment',
      'total_deductions', 'net_pay', 'tax_todate', 'pension_todate',
      'status', 'notes', 'updated_at'
    ]);
    
    // Filter out invalid fields (like nested 'employee' object)
    const fields = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (validColumns.has(key)) {
        fields[key] = value;
      }
    }
    fields.updated_at = updated_at;
    
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'No fields to update' });
    const setSql = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await pool.query(`UPDATE payslips SET ${setSql} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM payslips WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('PUT /api/payslips/:id error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/payslips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM payslips WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) {
    console.error('DELETE /api/payslips/:id error:', e);
    res.status(500).json({ error: e.message });
  }
});
// Start server after ensuring DB and schema
(async () => {
  try {
    await ensureDatabaseAndSchema();
    app.listen(PORT, () => {
      console.log(`PMS III API listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
})();
