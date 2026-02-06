import { supabase } from './client';
import { Shift, ShiftWithEmployeeCount, ShiftSwap } from '../../domain/shift/shift';
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

    async getShiftSwaps(companyId: string): Promise<ShiftSwap[]> {
        const { data, error } = await supabase
            .from('shift_swaps')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching shift swaps:", error);
            return [];
        }
        return data || [];
    }

    async updateShiftSwapStatus(id: string, status: string, adminNote?: string): Promise<void> {
        const updateData: any = { status };
        if (adminNote !== undefined) {
            updateData.admin_note = adminNote;
        }

        const { error } = await supabase
            .from('shift_swaps')
            .update(updateData)
            .eq('id', id);

        if (error) throw error;

        // If approved, execute the swap
        if (status === 'approved') {
            await this.executeShiftSwap(id);
        }
    }

    async getEmployeeSchedule(employeeId: string, date: string): Promise<any | null> {
        const { data, error } = await supabase
            .from('employee_schedules')
            .select('*')
            .eq('employee_id', employeeId)
            .eq('date', date)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            console.error("Error fetching employee schedule:", error);
        }
        return data || null;
    }

    async upsertEmployeeSchedule(schedule: { employee_id: string; shift_id: string | null; date: string; company_id: string }): Promise<void> {
        const { error } = await supabase
            .from('employee_schedules')
            .upsert({
                employee_id: schedule.employee_id,
                shift_id: schedule.shift_id,
                date: schedule.date,
                company_id: schedule.company_id,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'employee_id,date'
            });

        if (error) throw error;
    }

    async executeShiftSwap(swapId: string): Promise<void> {
        // 1. Get swap details
        const { data: swap, error: swapError } = await supabase
            .from('shift_swaps')
            .select('*')
            .eq('id', swapId)
            .single();

        if (swapError || !swap) {
            console.error("Failed to fetch swap details:", swapError);
            return;
        }

        // 2. Get requester's current shift for my_shift_date
        const requesterSchedule = await this.getEmployeeSchedule(swap.requester_id, swap.my_shift_date);

        // 3. Get target's current shift for target_shift_date (if target exists)
        let targetSchedule = null;
        if (swap.target_user_id && swap.target_shift_date) {
            targetSchedule = await this.getEmployeeSchedule(swap.target_user_id, swap.target_shift_date);
        }

        // 4. Get default shifts from employees table if schedules don't exist
        const { data: employees } = await supabase
            .from('employees')
            .select('id, shift_id')
            .in('id', [swap.requester_id, swap.target_user_id].filter(Boolean));

        const requesterDefaultShift = employees?.find(e => e.id === swap.requester_id)?.shift_id;
        const targetDefaultShift = employees?.find(e => e.id === swap.target_user_id)?.shift_id;

        const requesterCurrentShift = requesterSchedule?.shift_id || requesterDefaultShift;
        const targetCurrentShift = targetSchedule?.shift_id || targetDefaultShift;

        // 5. Swap the shifts
        if (swap.target_user_id && swap.target_shift_date) {
            // Swap requester's shift on my_shift_date with target's shift
            await this.upsertEmployeeSchedule({
                employee_id: swap.requester_id,
                shift_id: targetCurrentShift,
                date: swap.my_shift_date,
                company_id: swap.company_id
            });

            // Swap target's shift on target_shift_date with requester's shift
            await this.upsertEmployeeSchedule({
                employee_id: swap.target_user_id,
                shift_id: requesterCurrentShift,
                date: swap.target_shift_date,
                company_id: swap.company_id
            });
        }
    }
}

export const shiftRepository = new SupabaseShiftRepository();
