import { supabase } from './client';
import { Shift, ShiftWithEmployeeCount } from '../../domain/shift/shift';
import { IShiftRepository } from '../../domain/shift/IShiftRepository';

export class SupabaseShiftRepository implements IShiftRepository {
    async getShifts(companyId: string): Promise<ShiftWithEmployeeCount[]> {
        // 1. Fetch shifts
        const { data: shifts, error: shiftError } = await supabase
            .from('shifts')
            .select('*')
            .eq('company_id', companyId)
            .order('start_time', { ascending: true });

        if (shiftError) throw shiftError;

        // 2. Fetch employee counts for these shifts
        const { data: employeeCounts, error: countError } = await supabase
            .from('employees')
            .select('shift_id')
            .eq('company_id', companyId)
            .not('shift_id', 'is', null);

        if (countError) throw countError;

        // 3. Map counts
        return (shifts || []).map(shift => {
            const count = (employeeCounts || []).filter(e => e.shift_id === shift.id).length;
            return {
                ...shift,
                employee_count: count
            };
        });
    }

    async createShift(shift: Omit<Shift, 'id' | 'created_at'>): Promise<Shift> {
        const { data, error } = await supabase
            .from('shifts')
            .insert(shift)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateShift(shift: Partial<Shift> & { id: string }): Promise<Shift> {
        const { data, error } = await supabase
            .from('shifts')
            .update(shift)
            .eq('id', shift.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteShift(id: string): Promise<void> {
        const { error } = await supabase
            .from('shifts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async assignShiftToEmployee(employeeId: string, shiftId: string | null): Promise<void> {
        const { error } = await supabase
            .from('employees')
            .update({ shift_id: shiftId })
            .eq('id', employeeId);

        if (error) throw error;
    }
}

export const shiftRepository = new SupabaseShiftRepository();
