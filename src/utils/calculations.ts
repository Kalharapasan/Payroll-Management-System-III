import { PayrollCalculation } from '../types';

export function calculatePayroll(
  innerCity: number,
  basicSalary: number,
  overtime: number,
  bonuses: number = 0
): PayrollCalculation {
  const gross = innerCity + basicSalary + overtime + bonuses;

  const taxable = gross * 0.09;
  const pension = gross * 0.055;
  const student = gross * 0.025;
  const ni = gross * 0.023;

  const totalDeductions = taxable + pension + student + ni;
  const net = gross - totalDeductions;

  return {
    gross_pay: parseFloat(gross.toFixed(2)),
    taxable_pay: parseFloat(taxable.toFixed(2)),
    pensionable_pay: parseFloat(pension.toFixed(2)),
    student_loan: parseFloat(student.toFixed(2)),
    ni_payment: parseFloat(ni.toFixed(2)),
    total_deductions: parseFloat(totalDeductions.toFixed(2)),
    net_pay: parseFloat(net.toFixed(2)),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateReferenceNo(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `EMP-${timestamp}-${random}`.toUpperCase();
}
