import { supabase } from '../supabase/client';
import { Payslip } from '../../domain/payroll/payroll';
import { IPayrollRepository } from '../../domain/payroll/IPayrollRepository';

export class SupabasePayrollRepository implements IPayrollRepository {
    async getPayslipsByCompany(companyId: string): Promise<Payslip[]> {
        const { data, error } = await supabase
            .from('payslips')
            .select('*, employees(name, avatar, department, position)')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async updatePayslipStatus(payslipId: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('payslips')
            .update({ status })
            .eq('id', payslipId);

        if (error) throw error;
    }

    async createPayslip(payslip: Partial<Payslip>): Promise<void> {
        const { error } = await supabase
            .from('payslips')
            .insert(payslip);

        if (error) throw error;
    }

    async getPayslipsByEmployee(employeeId: string): Promise<Payslip[]> {
        const { data, error } = await supabase
            .from('payslips')
            .select('*')
            .eq('employee_id', employeeId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
}

export const payrollRepository = new SupabasePayrollRepository();
