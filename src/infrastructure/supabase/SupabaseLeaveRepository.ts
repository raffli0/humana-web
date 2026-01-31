import { supabase } from '../supabase/client';
import { LeaveRequest } from '../../domain/leave/leave';
import { ILeaveRepository } from '../../domain/leave/ILeaveRepository';

export class SupabaseLeaveRepository implements ILeaveRepository {
    async getLeaveRequestsByCompany(companyId: string): Promise<LeaveRequest[]> {
        const { data, error } = await supabase
            .from('leave_requests')
            .select('*, employees(name, avatar, department)')
            .eq('company_id', companyId)
            .order('request_date', { ascending: false });

        if (error) throw error;

        return (data || []).map((row: any) => ({
            ...row,
            leave_type: row.type || row.leave_type, // Fallback in case both exist or for transition
            created_at: row.request_date || row.created_at
        }));
    }

    async updateLeaveStatus(leaveId: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('leave_requests')
            .update({ status })
            .eq('id', leaveId);

        if (error) throw error;
    }

    async createLeaveRequest(request: Partial<LeaveRequest>): Promise<void> {
        const dbRequest = {
            ...request,
            type: request.leave_type,
            request_date: request.created_at || new Date().toISOString().split('T')[0],
        };

        // Remove domain-only properties before insert
        delete (dbRequest as any).leave_type;
        delete (dbRequest as any).created_at;
        delete (dbRequest as any).employees;

        const { error } = await supabase
            .from('leave_requests')
            .insert(dbRequest);

        if (error) throw error;
    }

    async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
        const { data, error } = await supabase
            .from('leave_requests')
            .select('*')
            .eq('employee_id', employeeId)
            .order('request_date', { ascending: false });

        if (error) throw error;

        return (data || []).map((row: any) => ({
            ...row,
            leave_type: row.type || row.leave_type,
            created_at: row.request_date || row.created_at
        }));
    }
}

export const leaveRepository = new SupabaseLeaveRepository();
