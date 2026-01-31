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
    const [departments, setDepartments] = useState<string[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
    const [searchQuery, setSearchQuery] = useState("");

    const getAttendanceUseCase = new GetAttendanceUseCase(attendanceRepository);

    const fetchData = useCallback(async () => {
        if (!date) return;

        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                const formattedDate = format(date, "yyyy-MM-dd");
                const { records, officeLocation: office, departments: depts } = await getAttendanceUseCase.execute(formattedDate, profile.company_id);

                setAttendanceData(records);
                setOfficeLocation(office);
                setDepartments(depts);
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

    const filteredAttendanceData = attendanceData.filter(record => {
        const matchesDepartment = selectedDepartment === "All Departments" ||
            (record.employees?.department === selectedDepartment);

        const employeeName = record.employees?.name || record.employeeName || "";
        const matchesSearch = employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesDepartment && matchesSearch;
    });

    const stats = {
        present: attendanceData.filter(a => a.status === "Present").length,
        late: attendanceData.filter(a => a.status === "Late").length,
        absent: attendanceData.filter(a => a.status === "Absent").length,
        total: attendanceData.length
    };

    return {
        date,
        setDate,
        attendanceData: filteredAttendanceData,
        allAttendanceData: attendanceData,
        selectedAttendance,
        setSelectedAttendance,
        loading,
        officeLocation,
        departments,
        selectedDepartment,
        setSelectedDepartment,
        searchQuery,
        setSearchQuery,
        stats,
        refresh: fetchData
    };
}
