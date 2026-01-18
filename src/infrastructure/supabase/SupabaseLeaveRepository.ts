import { supabase } from '../supabase/client';
import { LeaveRequest } from '../../domain/leave/leave';
import { ILeaveRepository } from '../../domain/leave/ILeaveRepository';

export class SupabaseLeaveRepository implements ILeaveRepository {
    async getLeaveRequestsByCompany(companyId: string): Promise<LeaveRequest[]> {
        const { data, error } = await supabase
            .from('leave_requests')
            .select('*, employees(name, avatar, department)')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async updateLeaveStatus(leaveId: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('leave_requests')
            .update({ status })
            .eq('id', leaveId);

        if (error) throw error;
    }

    async createLeaveRequest(request: Partial<LeaveRequest>): Promise<void> {
        const { error } = await supabase
            .from('leave_requests')
            .insert(request);

        if (error) throw error;
    }

    async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
        const { data, error } = await supabase
            .from('leave_requests')
            .select('*')
            .eq('employee_id', employeeId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
}

export const leaveRepository = new SupabaseLeaveRepository();
