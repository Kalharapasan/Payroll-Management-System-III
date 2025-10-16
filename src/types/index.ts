export interface Department {
  id: string;
  name: string;
  code: string;
  manager_id: string | null;
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  employee_name: string;
  email: string;
  address: string | null;
  postcode: string | null;
  gender: 'm' | 'f' | '';
  reference_no: string | null;
  department_id: string | null;
  tax_period: string | null;
  tax_code: string | null;
  ni_number: string | null;
  ni_code: string | null;
  student_ref: string | null;
  basic_salary: number;
  employment_status: 'active' | 'on_leave' | 'terminated';
  hire_date: string | null;
  termination_date: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Payslip {
  id: string;
  employee_id: string;
  pay_date: string;
  period_start: string | null;
  period_end: string | null;
  inner_city: number;
  basic_salary: number;
  overtime: number;
  bonuses: number;
  gross_pay: number;
  taxable_pay: number;
  pensionable_pay: number;
  student_loan: number;
  ni_payment: number;
  total_deductions: number;
  net_pay: number;
  tax_todate: number;
  pension_todate: number;
  status: 'draft' | 'approved' | 'paid';
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  hours_worked: number | null;
  overtime_hours: number;
  status: 'present' | 'absent' | 'leave' | 'holiday';
  notes: string | null;
  created_at: string;
}

export interface PayrollCalculation {
  gross_pay: number;
  taxable_pay: number;
  pensionable_pay: number;
  student_loan: number;
  ni_payment: number;
  total_deductions: number;
  net_pay: number;
}

export interface AnalyticsData {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  monthlyTrends: Array<{
    month: string;
    gross: number;
    net: number;
    deductions: number;
  }>;
  departmentStats: Array<{
    department: string;
    count: number;
    total: number;
  }>;
}
