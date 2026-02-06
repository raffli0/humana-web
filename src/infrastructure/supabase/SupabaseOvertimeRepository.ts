import { supabase } from './client';
import { OvertimeRequest } from '../../domain/overtime/overtime';
import { IOvertimeRepository } from '../../domain/overtime/IOvertimeRepository';

export class SupabaseOvertimeRepository implements IOvertimeRepository {
    async getOvertimeRequests(companyId: string): Promise<OvertimeRequest[]> {
        const { data, error } = await supabase
            .from('overtime_requests')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching overtime requests:", error);
            throw error;
        }

        return data as OvertimeRequest[];
    }

    async updateOvertimeStatus(id: string, status: 'approved' | 'rejected', adminNote?: string): Promise<void> {
        const updateData: any = { status };
        if (adminNote !== undefined) {
            updateData.admin_note = adminNote;
        }

        const { error } = await supabase
            .from('overtime_requests')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Error updating overtime status:", error);
            throw error;
        }
    }
}

export const overtimeRepository = new SupabaseOvertimeRepository();
