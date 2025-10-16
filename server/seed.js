import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'pms_iii';

async function run() {
  const baseConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT || 3306),
    multipleStatements: true,
  };

  const conn = await mysql.createConnection(baseConfig);
  try {
    // Ensure DB exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await conn.query(`USE \`${DB_NAME}\``);

    // Apply schema if missing core tables
    const [rows] = await conn.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('departments','employees','payslips','attendance')`,
      [DB_NAME]
    );
    const existing = new Set(rows.map((r) => r.TABLE_NAME));

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (!existing.has('departments') || !existing.has('employees') || !existing.has('payslips') || !existing.has('attendance')) {
      const schemaPath = path.resolve(__dirname, 'mysql-schema.sql');
      const schemaSql = await fs.readFile(schemaPath, 'utf8');
      await conn.query(schemaSql);
    }

    // Run seed
    const seedPath = path.resolve(__dirname, 'seed.sql');
    const seedSql = await fs.readFile(seedPath, 'utf8');
    await conn.query(seedSql);

    console.log('Seed data inserted successfully.');
  } finally {
    await conn.end();
  }
}

run().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
