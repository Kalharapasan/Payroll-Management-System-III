import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Payslip } from '../types';

export function usePayslips() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      const data = await api.getPayslips();
      setPayslips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payslips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  const addPayslip = async (payslip: Partial<Payslip>) => {
    try {
      const data = await api.addPayslip(payslip);
      await fetchPayslips();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add payslip' };
    }
  };

  const updatePayslip = async (id: string, updates: Partial<Payslip>) => {
    try {
      const data = await api.updatePayslip(id, updates);
      await fetchPayslips();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update payslip' };
    }
  };

  const deletePayslip = async (id: string) => {
    try {
      await api.deletePayslip(id);
      await fetchPayslips();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete payslip' };
    }
  };

  return {
    payslips,
    loading,
    error,
    fetchPayslips,
    addPayslip,
    updatePayslip,
    deletePayslip,
  };
}
