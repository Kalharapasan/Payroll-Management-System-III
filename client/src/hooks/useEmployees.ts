import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Employee } from '../types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (employee: Partial<Employee>) => {
    try {
      const data = await api.addEmployee(employee);
      await fetchEmployees();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add employee' };
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const data = await api.updateEmployee(id, updates);
      await fetchEmployees();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update employee' };
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await api.deleteEmployee(id);
      await fetchEmployees();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete employee' };
    }
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
