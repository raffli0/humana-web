import { useState, useEffect, useCallback } from 'react';
import { shiftRepository } from '../../infrastructure/supabase/SupabaseShiftRepository';
import { employeeRepository } from '../../infrastructure/supabase/SupabaseEmployeeRepository';
import { authService } from '../../infrastructure/auth/authService';
import { Shift, ShiftWithEmployeeCount, ShiftSwap } from '../../domain/shift/shift';
import { Employee } from '../../domain/employee/employee';

export function useShiftViewModel() {
    const [shifts, setShifts] = useState<ShiftWithEmployeeCount[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shiftSwaps, setShiftSwaps] = useState<ShiftSwap[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyId, setCompanyId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                setCompanyId(profile.company_id);
                const [shiftsData, employeesData, swapsData] = await Promise.all([
                    shiftRepository.getShifts(profile.company_id),
                    employeeRepository.getEmployeesByCompany(profile.company_id),
                    shiftRepository.getShiftSwaps(profile.company_id)
                ]);
                setShifts(shiftsData);
                setEmployees(employeesData);
                setShiftSwaps(swapsData);
            }
        } catch (error) {
            console.error("Failed to fetch shift data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createShift = async (shift: Omit<Shift, 'id' | 'created_at' | 'company_id'>) => {
        if (!companyId) return;
        try {
            await shiftRepository.createShift({ ...shift, company_id: companyId });
            await fetchData();
        } catch (error) {
            console.error("Failed to create shift:", error);
            throw error;
        }
    };

    const updateShift = async (shift: Partial<Shift> & { id: string }) => {
        try {
            await shiftRepository.updateShift(shift);
            await fetchData();
        } catch (error) {
            console.error("Failed to update shift:", error);
            throw error;
        }
    };

    const deleteShift = async (id: string) => {
        try {
            await shiftRepository.deleteShift(id);
            await fetchData();
        } catch (error) {
            console.error("Failed to delete shift:", error);
            throw error;
        }
    };

    const assignShift = async (employeeId: string, shiftId: string | null) => {
        try {
            await shiftRepository.assignShiftToEmployee(employeeId, shiftId);
            await fetchData();
        } catch (error) {
            console.error("Failed to assign shift:", error);
            throw error;
        }
    };

    const updateSwapStatus = async (id: string, status: string, adminNote?: string) => {
        try {
            await shiftRepository.updateShiftSwapStatus(id, status, adminNote);
            setShiftSwaps(prev => prev.map(s => s.id === id ? { ...s, status, admin_note: adminNote } : s));
        } catch (error) {
            console.error("Failed to update swap status:", error);
            throw error;
        }
    };

    return {
        shifts,
        employees,
        shiftSwaps,
        loading,
        createShift,
        updateShift,
        deleteShift,
        assignShift,
        updateSwapStatus,
        refresh: fetchData
    };
}
