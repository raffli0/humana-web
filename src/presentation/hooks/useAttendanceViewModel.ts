import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { attendanceRepository } from '../../infrastructure/supabase/SupabaseAttendanceRepository';
import { authService } from '../../infrastructure/auth/authService';
import { GetAttendanceUseCase } from '../../application/attendance/GetAttendanceUseCase';
import { AttendanceRecord, OfficeLocation } from '../../domain/attendance/attendance';

export function useAttendanceViewModel(initialDate: Date = new Date()) {
    const [date, setDate] = useState<Date | undefined>(initialDate);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [officeLocation, setOfficeLocation] = useState<OfficeLocation | null>(null);

    const getAttendanceUseCase = new GetAttendanceUseCase(attendanceRepository);

    const fetchData = useCallback(async () => {
        if (!date) return;

        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                const formattedDate = format(date, "yyyy-MM-dd");
                const { records, officeLocation: office } = await getAttendanceUseCase.execute(formattedDate, profile.company_id);

                setAttendanceData(records);
                setOfficeLocation(office);
            }
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const stats = {
        present: attendanceData.filter(a => a.status === "Present").length,
        late: attendanceData.filter(a => a.status === "Late").length,
        absent: attendanceData.filter(a => a.status === "Absent").length,
        total: attendanceData.length
    };

    return {
        date,
        setDate,
        attendanceData,
        selectedAttendance,
        setSelectedAttendance,
        loading,
        officeLocation,
        stats,
        refresh: fetchData
    };
}
