import { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import { Payslip, Employee } from '../types';
import { calculatePayroll, formatCurrency } from '../utils/calculations';
import api from '../lib/api';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payslip: Partial<Payslip>) => Promise<{ data: Payslip | null; error: string | null } | void>;
  payslip?: Payslip | null;
}

export function PayslipModal({ isOpen, onClose, onSave, payslip }: PayslipModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Partial<Payslip>>({
    employee_id: '',
    pay_date: new Date().toISOString().split('T')[0],
    period_start: '',
    period_end: '',
    inner_city: 0,
    basic_salary: 0,
    overtime: 0,
    bonuses: 0,
    status: 'draft',
    notes: '',
  });
  const [calculated, setCalculated] = useState({
    gross_pay: 0,
    taxable_pay: 0,
    pensionable_pay: 0,
    student_loan: 0,
    ni_payment: 0,
    total_deductions: 0,
    net_pay: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (payslip) {
      setFormData(payslip);
    }
  }, [payslip]);

  useEffect(() => {
    const calc = calculatePayroll(
      formData.inner_city || 0,
      formData.basic_salary || 0,
      formData.overtime || 0,
      formData.bonuses || 0
    );
    setCalculated(calc);
  }, [formData.inner_city, formData.basic_salary, formData.overtime, formData.bonuses]);

  const fetchEmployees = async () => {
    const data = await api.getEmployees();
    setEmployees(data.filter((e) => e.employment_status === 'active'));
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeId,
        basic_salary: employee.basic_salary,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payslipData = {
        ...formData,
        ...calculated,
        tax_todate: calculated.taxable_pay,
        pension_todate: calculated.pensionable_pay,
      };
      await onSave(payslipData);
      onClose();
    } catch (error) {
      console.error('Error saving payslip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['inner_city', 'basic_salary', 'overtime', 'bonuses'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">
            {payslip ? 'Edit Payslip' : 'Generate New Payslip'}
          </h2>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded-full p-1">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee *
                </label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_name} - {emp.reference_no}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Date *
                </label>
                <input
                  type="date"
                  name="pay_date"
                  value={formData.pay_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period Start
                </label>
                <input
                  type="date"
                  name="period_start"
                  value={formData.period_start || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period End
                </label>
                <input
                  type="date"
                  name="period_end"
                  value={formData.period_end || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Salary Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Salary
                </label>
                <input
                  type="number"
                  name="basic_salary"
                  value={formData.basic_salary}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inner City Allowance
                </label>
                <input
                  type="number"
                  name="inner_city"
                  value={formData.inner_city}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overtime
                </label>
                <input
                  type="number"
                  name="overtime"
                  value={formData.overtime}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonuses
                </label>
                <input
                  type="number"
                  name="bonuses"
                  value={formData.bonuses}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">
                Calculated Breakdown
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Gross Pay</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(calculated.gross_pay)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Tax (9%)</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatCurrency(calculated.taxable_pay)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Pension (5.5%)</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(calculated.pensionable_pay)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Student Loan (2.5%)</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(calculated.student_loan)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">NI (2.3%)</p>
                <p className="text-lg font-bold text-indigo-600">
                  {formatCurrency(calculated.ni_payment)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Total Deductions</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(calculated.total_deductions)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-lg p-3 shadow-md col-span-2">
                <p className="text-xs text-white mb-1">Net Pay</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(calculated.net_pay)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : payslip ? 'Update Payslip' : 'Generate Payslip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
