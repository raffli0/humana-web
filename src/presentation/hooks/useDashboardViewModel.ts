import { useState, useEffect, useCallback } from 'react';
import { employeeRepository } from '../../infrastructure/supabase/SupabaseEmployeeRepository';
import { attendanceRepository } from '../../infrastructure/supabase/SupabaseAttendanceRepository';
import { leaveRepository } from '../../infrastructure/supabase/SupabaseLeaveRepository';
import { payrollRepository } from '../../infrastructure/supabase/SupabasePayrollRepository';
import { recruitmentRepository } from '../../infrastructure/supabase/SupabaseRecruitmentRepository';
import { shiftRepository } from '../../infrastructure/supabase/SupabaseShiftRepository';
import { overtimeRepository } from '../../infrastructure/supabase/SupabaseOvertimeRepository';
import { authService } from '../../infrastructure/auth/authService';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export function useDashboardViewModel() {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [recruitments, setRecruitments] = useState<any[]>([]);
    const [payslips, setPayslips] = useState<any[]>([]);
    const [pendingShifts, setPendingShifts] = useState<number>(0);
    const [pendingOvertime, setPendingOvertime] = useState<number>(0);
    const [profile, setProfile] = useState<any>(null);

    const labels = ["Karyawan", "Absensi", "Cuti", "Rekrutmen", "Payroll", "Shifts", "Overtime"];
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const currentProfile = await authService.getCurrentProfile();
            if (!currentProfile?.company_id) return;
            setProfile(currentProfile);

            const companyId = currentProfile.company_id;
            const today = format(new Date(), "yyyy-MM-dd");

            const results = await Promise.allSettled([
                employeeRepository.getEmployeesByCompany(companyId),
                attendanceRepository.getAttendanceByCompanyAndDate(companyId, today),
                leaveRepository.getLeaveRequestsByCompany(companyId),
                recruitmentRepository.getJobPostsByCompany(companyId),
                payrollRepository.getPayslipsByCompany(companyId),
                shiftRepository.getShiftSwaps(companyId),
                overtimeRepository.getOvertimeRequests(companyId)
            ]);

            const [empResult, attResult, leaveResult, recResult, payResult, shiftResult, overtimeResult] = results;

            if (empResult.status === 'fulfilled') setEmployees(empResult.value);
            if (attResult.status === 'fulfilled') setAttendance(attResult.value);
            if (leaveResult.status === 'fulfilled') setLeaveRequests(leaveResult.value);
            if (recResult.status === 'fulfilled') setRecruitments(recResult.value);
            if (payResult.status === 'fulfilled') setPayslips(payResult.value);

            if (shiftResult.status === 'fulfilled') {
                setPendingShifts(shiftResult.value.filter(s => s.status === 'pending').length);
            }
            if (overtimeResult.status === 'fulfilled') {
                setPendingOvertime(overtimeResult.value.filter(o => o.status === 'pending').length);
            }

            // Log failures for debugging with names
            results.forEach((res, i) => {
                if (res.status === 'rejected') {
                    console.error(`Dashboard fetch error for ${labels[i]}:`, res.reason);
                }
            });

        } catch (error) {
            console.error("Dashboard ViewModel Error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Aggregate Payroll Data for Chart (Last 6-8 Months)
    const getPayrollChartData = () => {
        const months = [];
        for (let i = 7; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const monthLabel = format(date, "MMM");

            const monthlyPayslips = payslips.filter(p => {
                const pDate = new Date(p.period_start);
                return isSameMonth(pDate, date);
            });

            const gross = monthlyPayslips.reduce((sum, p) => sum + (Number(p.basic_salary) || 0) + (Number(p.allowances) || 0), 0);
            const net = monthlyPayslips.reduce((sum, p) => sum + (Number(p.net_salary) || 0), 0);
            const tax = gross - net;

            months.push({ month: monthLabel, gross, tax, net });
        }
        return months;
    };

    // Calculate Department Stats
    const getDepartmentStats = () => {
        const stats: Record<string, { count: number; total: number; color: string }> = {};
        const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-emerald-500", "bg-orange-500"];

        employees.forEach((emp, index) => {
            const dept = emp.department || "Lainnya";
            if (!stats[dept]) {
                stats[dept] = {
                    count: 0,
                    total: 10, // Default visual limit
                    color: colors[Object.keys(stats).length % colors.length]
                };
            }
            stats[dept].count++;
        });

        return Object.entries(stats).map(([name, data]) => ({
            name,
            ...data
        }));
    };

    // Aggregate Recent Activities
    const getRecentActivities = () => {
        const activities: any[] = [];

        // 1. Attendance Activities
        attendance.slice(0, 5).forEach(att => {
            const attTime = att.created_at || (att.date && att.check_in ? `${att.date}T${att.check_in}` : att.date);
            const displayTime = attTime ? format(new Date(attTime), "HH:mm") : "--:--";
            const timestamp = attTime ? new Date(attTime).getTime() : 0;

            activities.push({
                id: `att-${att.id}`,
                title: "Absensi Karyawan",
                description: `${att.employees?.name || 'Karyawan'} melakukan ${att.status === 'Late' ? 'absen terlambat' : 'absensi'}`,
                time: displayTime,
                timestamp: timestamp,
                color: att.status === 'Late' ? 'bg-orange-500' : 'bg-green-500'
            });
        });

        // 2. Leave Activities
        leaveRequests.filter(l => l.status === 'Pending').slice(0, 3).forEach(l => {
            const lTime = l.created_at || l.request_date;
            activities.push({
                id: `leave-${l.id}`,
                title: "Permintaan Cuti",
                description: `${l.employees?.name || 'Karyawan'} mengajukan cuti ${l.type}`,
                time: lTime ? format(new Date(lTime), "dd MMM") : "--",
                timestamp: lTime ? new Date(lTime).getTime() : 0,
                color: 'bg-blue-500'
            });
        });

        return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    };

    const presentToday = attendance.filter(a => {
        const status = (a.status || "").toLowerCase();
        return status === "present" || status === "late" || status === "hadir" || status === "terlambat";
    }).length;

    const pendingLeaveCount = leaveRequests.filter(lr => lr.status === "Pending" || lr.status === "Menunggu").length;
    // const pendingLeaves is actually the total approvals needed
    const pendingLeaves = pendingLeaveCount + pendingShifts + pendingOvertime;

    const openPositions = recruitments.filter(r => r.status === "Open" || r.status === "Dibuka").length;

    return {
        loading,
        profile,
        employees,
        attendance,
        leaveRequests,
        recruitments,
        payslips,
        presentToday,
        pendingApprovals: pendingLeaves,
        openPositions,
        payrollChartData: getPayrollChartData(),
        departmentStats: getDepartmentStats(),
        recentActivities: getRecentActivities(),
        refresh: fetchData
    };
}
