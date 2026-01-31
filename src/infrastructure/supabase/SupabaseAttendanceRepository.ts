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

        return (data || []).map((record: any) => {
            let photo_url = `https://placehold.co/400x400?text=No+Photo`;

            if (record.employee_id && record.date && record.check_in) {
                try {
                    // Pattern: {userId}_checkin_{Ymd}_{His}.jpg
                    // Note: Server uses UTC (GMT+0) for filenames, while DB uses local time (GMT+7)
                    const datePart = record.date.replace(/-/g, '');

                    // Create a date object with local time (+7)
                    const [h, m, s] = record.check_in.split(':').map(Number);
                    const localDate = new Date(`${record.date}T${record.check_in}`);

                    // Subtract 7 hours to get UTC if the server is UTC and client/DB is GMT+7
                    // Subtracting hours in a way that handles day rollover
                    const utcDate = new Date(localDate.getTime() - (7 * 60 * 60 * 1000));

                    const ymd = utcDate.getFullYear().toString() +
                        (utcDate.getMonth() + 1).toString().padStart(2, '0') +
                        utcDate.getDate().toString().padStart(2, '0');
                    const his = utcDate.getHours().toString().padStart(2, '0') +
                        utcDate.getMinutes().toString().padStart(2, '0') +
                        utcDate.getSeconds().toString().padStart(2, '0');

                    photo_url = `https://raffdev.my.id/uploads/attendance/${record.employee_id}_checkin_${ymd}_${his}.jpg`;
                } catch (e) {
                    console.error("Error constructing photo URL:", e);
                }
            }

            return {
                ...record,
                employeeName: record.employees?.name || record.employee_name || "Unknown",
                check_in: record.check_in,
                check_out: record.check_out,
                employee_id: record.employee_id,
                photo_url: photo_url,
                fallback_photo_url: record.photo_url || null,
            };
        });
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

    async getDepartments(companyId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('departments')
            .select('name')
            .eq('company_id', companyId);

        if (error) throw error;
        return (data || []).map(d => d.name);
    }
}

export const attendanceRepository = new SupabaseAttendanceRepository();
