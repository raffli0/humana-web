import { supabase } from '../supabase/client';
import { AttendanceRecord, OfficeLocation } from '../../domain/attendance/attendance';
import { IAttendanceRepository } from '../../domain/attendance/IAttendanceRepository';

export class SupabaseAttendanceRepository implements IAttendanceRepository {
    async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
        const { data, error } = await supabase
            .from('attendance')
            .select('*, employees(name, avatar, department)')
            .eq('date', date);

        if (error) throw error;

        return (data || []).map((record: any) => ({
            ...record,
            employeeName: record.employees?.name || record.employee_name || "Unknown",
            check_in: record.check_in,
            check_out: record.check_out,
            employee_id: record.employee_id,
        }));
    }

    async getOfficeLocation(companyId: string): Promise<OfficeLocation | null> {
        const { data, error } = await supabase
            .from("company_settings")
            .select("office_latitude, office_longitude, office_radius_meters, office_address")
            .eq("company_id", companyId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;

        return {
            lat: data.office_latitude,
            lng: data.office_longitude,
            radius: data.office_radius_meters || 100,
            address: data.office_address
        };
    }
}

export const attendanceRepository = new SupabaseAttendanceRepository();
