import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/calculations';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  averageSalary: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    totalPayroll: 0,
    averageSalary: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesRes, payslipsRes] = await Promise.all([
        supabase.from('employees').select('id, employment_status'),
        supabase.from('payslips').select('gross_pay, net_pay'),
      ]);

      const employees = employeesRes.data || [];
      const payslips = payslipsRes.data || [];

      const activeCount = employees.filter((e) => e.employment_status === 'active').length;
      const totalPayroll = payslips.reduce((sum, p) => sum + p.net_pay, 0);
      const avgSalary = employees.length > 0 ? totalPayroll / employees.length : 0;

      setStats({
        totalEmployees: employees.length,
        activeEmployees: activeCount,
        totalPayroll,
        averageSalary: avgSalary,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      icon: Briefcase,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Payroll',
      value: formatCurrency(stats.totalPayroll),
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
    {
      title: 'Average Salary',
      value: formatCurrency(stats.averageSalary),
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                <p className={`text-2xl font-bold mt-2 ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg bg-opacity-10`}>
                <Icon className={card.textColor} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
