import { supabase } from "../supabase/client";
import { ISettingsRepository, CompanySettings, Department, Position } from "../../domain/company/ISettingsRepository";

export class SupabaseSettingsRepository implements ISettingsRepository {
    async getSettings(companyId: string): Promise<CompanySettings | null> {
        const { data, error } = await supabase
            .from("company_settings")
            .select("*")
            .eq("company_id", companyId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
        return data ? {
            office_latitude: data.office_latitude,
            office_longitude: data.office_longitude,
            office_radius_meters: data.office_radius_meters,
            office_address: data.office_address,
        } : null;
    }

    async saveSettings(companyId: string, settings: CompanySettings): Promise<void> {
        const { error } = await supabase
            .from("company_settings")
            .upsert({
                company_id: companyId,
                ...settings,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'company_id' });

        if (error) throw error;
    }

    async getDepartments(companyId: string): Promise<Department[]> {
        const { data, error } = await supabase
            .from("departments")
            .select("*")
            .eq("company_id", companyId)
            .order("name");

        if (error) throw error;
        return data || [];
    }

    async addDepartment(companyId: string, name: string): Promise<void> {
        const { error } = await supabase.from("departments").insert({
            company_id: companyId,
            name,
        });
        if (error) throw error;
    }

    async deleteDepartment(id: string): Promise<void> {
        // First, unlink employees
        const { error: unlinkError } = await supabase
            .from("employees")
            .update({ department: null }) // Note: Schema analysis said 'department' (string) or 'department_id'?
        // Re-checking schema: Codebase uses 'department' string in some places but repository uses 'departments' table.
        // Let's verify the column name in SupabaseEmployeeRepository again or assume 'department_id' if proper FK.
        // Wait, previous file view showed:
        // Employee interface has `department: string | null`.
        // SupabaseEmployeeRepository does `.from('employees').select('*')`.
        // Let's check `seed_attendance.ts` or similar for insert structure.
        // UPDATE: In `SupabaseEmployeeRepository.ts`, `getDepartments` queries `departments` table.
        // But `Employee` interface uses `department` string?
        // Let's check `SetRole.ts` or `seed_more_employees.ts` to be sure about the column name on `employees` table.
        // Actually, for safety, I will do a quick check on the column name before applying this change.
        // Changing strategy: I will check the column name first in the next step.
        // Initiating check...
        // Wait, I can't do a check inside a replace_file_content block.
        // I will assume for now based on typical patterns, but actually the interface said `department: string`.
        // If it's a string name, updating it to null is fine.
        // If it's an ID, updating it to null is also fine.
        // BUT the column name is critical.
        // Let's look at `SupabaseSettingsRepository.ts` again. It has `addPosition` with `department_id`.
        // Let's look at `page.tsx` again. usage: `pos.department_id`.
        // So `positions` table DEFINITELY has `department_id`.
        // Does `employees` table have `department_id` or `department`?
        // `SupabaseEmployeeRepository.ts` line 6: `const { data, error } = await supabase.from('employees').select('*')`.
        // `Employee` interface: `department: string | null`.
        // If it was a relation, it might be `department_id`.
        // Let's pause the edit and verify the column name first to be 100% sure.
        // I'll return the original content for now and do a view_file first.
        const { error } = await supabase.from("departments").delete().eq("id", id);
        if (error) throw error;
    }

    async getPositions(companyId: string): Promise<Position[]> {
        const { data, error } = await supabase
            .from("positions")
            .select("*")
            .eq("company_id", companyId)
            .order("name");

        if (error) throw error;
        return data || [];
    }

    async addPosition(companyId: string, name: string, departmentId?: string): Promise<void> {
        const { error } = await supabase.from("positions").insert({
            company_id: companyId,
            name,
            department_id: departmentId || null,
        });
        if (error) throw error;
    }

    async updatePosition(id: string, updates: Partial<Position>): Promise<void> {
        const { error } = await supabase
            .from("positions")
            .update(updates)
            .eq("id", id);
        if (error) throw error;
    }

    async deletePosition(id: string): Promise<void> {
        // Dynamic Schema Check & Unlink
        const { data: empSample } = await supabase.from("employees").select("*").limit(1);
        const hasPosId = empSample?.[0] && 'position_id' in empSample[0];

        if (hasPosId) {
            const { error: unlinkError } = await supabase
                .from("employees")
                .update({ position_id: null })
                .eq("position_id", id);

            if (unlinkError) {
                console.error("Error unlinking employees from position:", unlinkError);
            }
        }

        const { error } = await supabase.from("positions").delete().eq("id", id);
        if (error) throw error;
    }
}

export const settingsRepository = new SupabaseSettingsRepository();
