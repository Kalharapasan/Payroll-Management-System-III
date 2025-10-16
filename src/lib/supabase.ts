import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          manager_id: string | null;
          budget: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['departments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['departments']['Insert']>;
      };
      employees: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['employees']['Insert']>;
      };
      payslips: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['payslips']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['payslips']['Insert']>;
      };
      attendance: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>;
      };
    };
  };
}
