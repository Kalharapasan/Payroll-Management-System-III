import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import api, { isSupabaseConfigured } from '../lib/api';
import { Employee } from '../types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('employees')
          .select(`
            *,
            department:departments(*)
          `)
          .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
        setEmployees(data || []);
      } else {
        const data = await api.getEmployees();
        setEmployees(data);
      }
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
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('employees')
          .insert([employee])
          .select()
          .single();
  if (error) throw new Error(error.message);
        await fetchEmployees();
        return { data, error: null };
      } else {
        const data = await api.addEmployee(employee);
        await fetchEmployees();
        return { data, error: null };
      }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add employee' };
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('employees')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
  if (error) throw new Error(error.message);
        await fetchEmployees();
        return { data, error: null };
      } else {
        const data = await api.updateEmployee(id, updates);
        await fetchEmployees();
        return { data, error: null };
      }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update employee' };
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);
  if (error) throw new Error(error.message);
        await fetchEmployees();
        return { error: null };
      } else {
        await api.deleteEmployee(id);
        await fetchEmployees();
        return { error: null };
      }
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
