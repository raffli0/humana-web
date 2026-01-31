import { useState, useEffect, useCallback } from 'react';
import { payrollRepository } from '../../infrastructure/supabase/SupabasePayrollRepository';
import { employeeRepository } from '../../infrastructure/supabase/SupabaseEmployeeRepository';
import { authService } from '../../infrastructure/auth/authService';
import { GetPayslipsUseCase, UpdatePayslipStatusUseCase, CreatePayslipUseCase } from '../../application/payroll/PayrollUseCases';
import { GeneratePayslipsUseCase } from '../../application/payroll/GeneratePayslipsUseCase';
import { Payslip, PayrollSummary } from '../../domain/payroll/payroll';

export function usePayrollViewModel() {
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getPayslipsUseCase = new GetPayslipsUseCase(payrollRepository);
    const updatePayslipStatusUseCase = new UpdatePayslipStatusUseCase(payrollRepository);
    const generatePayslipsUseCase = new GeneratePayslipsUseCase(payrollRepository, employeeRepository);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                const data = await getPayslipsUseCase.execute(profile.company_id);
                setPayslips(data);
            }
        } catch (error) {
            console.error("Failed to fetch payslips:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateStatus = async (payslipId: string, status: 'Paid' | 'Cancelled') => {
        setIsSubmitting(true);
        try {
            await updatePayslipStatusUseCase.execute(payslipId, status);
            setPayslips(prev => prev.map(p => p.id === payslipId ? { ...p, status } : p));
        } finally {
            setIsSubmitting(false);
        }
    };

    const generatePayroll = async () => {
        setIsSubmitting(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                // Generate for current month
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                await generatePayslipsUseCase.execute(profile.company_id, start, end);
                await fetchData();
            }
        } catch (error) {
            console.error("Failed to generate payroll:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateSummary = useCallback((): PayrollSummary => {
        return payslips.reduce((acc, p) => ({
            total_base: acc.total_base + (p.basic_salary || 0),
            total_allowance: acc.total_allowance + (p.allowances || 0),
            total_deduction: acc.total_deduction + (p.deductions || 0),
            net_payout: acc.net_payout + (p.net_salary || 0),
            employee_count: acc.employee_count + 1
        }), {
            total_base: 0,
            total_allowance: 0,
            total_deduction: 0,
            net_payout: 0,
            employee_count: 0
        });
    }, [payslips]);

    return {
        payslips,
        loading,
        isSubmitting,
        updateStatus,
        calculateSummary,
        refresh: fetchData,
        generatePayroll
    };
}
