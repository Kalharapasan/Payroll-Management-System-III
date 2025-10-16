import { useState } from 'react';
import { FileText, Users, Building2, BarChart3, Plus } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModal } from './components/EmployeeModal';
import { PayslipModal } from './components/PayslipModal';
import { useEmployees } from './hooks/useEmployees';
import { usePayslips } from './hooks/usePayslips';
import { Employee, Payslip } from './types';

type Tab = 'dashboard' | 'employees' | 'payslips' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  const { employees, loading: employeesLoading, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { payslips, loading: payslipsLoading, addPayslip, updatePayslip, deletePayslip } = usePayslips();

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
    { id: 'employees' as Tab, label: 'Employees', icon: Users },
    { id: 'payslips' as Tab, label: 'Payslips', icon: FileText },
  ];

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('add');
    setEmployeeModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setEmployeeModalOpen(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setEmployeeModalOpen(true);
  };

  const handleSaveEmployee = async (employee: Partial<Employee>) => {
    if (modalMode === 'add') {
      await addEmployee(employee);
    } else if (modalMode === 'edit' && selectedEmployee) {
      await updateEmployee(selectedEmployee.id, employee);
    }
  };

  const handleAddPayslip = () => {
    setSelectedPayslip(null);
    setPayslipModalOpen(true);
  };

  const handleSavePayslip = async (payslip: Partial<Payslip>) => {
    if (selectedPayslip) {
      await updatePayslip(selectedPayslip.id, payslip);
    } else {
      await addPayslip(payslip);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Building2 size={36} />
                Advanced Payroll System
              </h1>
              <p className="text-blue-100 mt-1">
                Comprehensive payroll management with analytics
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <Dashboard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleAddEmployee}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                  >
                    <Users size={20} />
                    <span className="font-medium">Add New Employee</span>
                  </button>
                  <button
                    onClick={handleAddPayslip}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                  >
                    <FileText size={20} />
                    <span className="font-medium">Generate Payslip</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {payslips.slice(0, 5).map((payslip) => (
                    <div
                      key={payslip.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {payslip.employee?.employee_name}
                        </p>
                        <p className="text-sm text-gray-600">{payslip.pay_date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payslip.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : payslip.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payslip.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <EmployeeTable
            employees={employees}
            loading={employeesLoading}
            onAdd={handleAddEmployee}
            onEdit={handleEditEmployee}
            onView={handleViewEmployee}
            onDelete={deleteEmployee}
          />
        )}

        {activeTab === 'payslips' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Payslip Management</h2>
                <button
                  onClick={handleAddPayslip}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                >
                  <Plus size={20} />
                  Generate Payslip
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pay Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Pay
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payslipsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                      </td>
                    </tr>
                  ) : payslips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No payslips found
                      </td>
                    </tr>
                  ) : (
                    payslips.map((payslip) => (
                      <tr
                        key={payslip.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payslip.employee?.employee_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payslip.pay_date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          £{payslip.gross_pay.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          £{payslip.total_deductions.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          £{payslip.net_pay.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payslip.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : payslip.status === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {payslip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedPayslip(payslip);
                              setPayslipModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this payslip?')) {
                                deletePayslip(payslip.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <EmployeeModal
        isOpen={employeeModalOpen}
        onClose={() => {
          setEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        mode={modalMode}
      />

      <PayslipModal
        isOpen={payslipModalOpen}
        onClose={() => {
          setPayslipModalOpen(false);
          setSelectedPayslip(null);
        }}
        onSave={handleSavePayslip}
        payslip={selectedPayslip}
      />

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Advanced Payroll Management System 2024 | Secure & Reliable
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
