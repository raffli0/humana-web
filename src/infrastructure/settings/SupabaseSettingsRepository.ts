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
        const { error } = await supabase.from("positions").delete().eq("id", id);
        if (error) throw error;
    }
}

export const settingsRepository = new SupabaseSettingsRepository();
