import type { Employee, Payslip } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function http(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  // Employees
  getEmployees: (): Promise<Employee[]> => http('/employees', { method: 'GET' }),
  addEmployee: (payload: Partial<Employee>): Promise<Employee> => http('/employees', { method: 'POST', body: JSON.stringify(payload) }),
  updateEmployee: (id: string, payload: Partial<Employee>): Promise<Employee> => http(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEmployee: (id: string) => http(`/employees/${id}`, { method: 'DELETE' }),

  // Payslips
  getPayslips: (): Promise<Payslip[]> => http('/payslips', { method: 'GET' }),
  addPayslip: (payload: Partial<Payslip>): Promise<Payslip> => http('/payslips', { method: 'POST', body: JSON.stringify(payload) }),
  updatePayslip: (id: string, payload: Partial<Payslip>): Promise<Payslip> => http(`/payslips/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePayslip: (id: string) => http(`/payslips/${id}`, { method: 'DELETE' }),
};

export default api;
