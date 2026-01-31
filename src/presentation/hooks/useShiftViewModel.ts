import { useState, useEffect, useCallback } from 'react';
import { shiftRepository } from '../../infrastructure/supabase/SupabaseShiftRepository';
import { employeeRepository } from '../../infrastructure/supabase/SupabaseEmployeeRepository';
import { authService } from '../../infrastructure/auth/authService';
import { Shift, ShiftWithEmployeeCount } from '../../domain/shift/shift';
import { Employee } from '../../domain/employee/employee';

export function useShiftViewModel() {
    const [shifts, setShifts] = useState<ShiftWithEmployeeCount[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyId, setCompanyId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                setCompanyId(profile.company_id);
                const [shiftsData, employeesData] = await Promise.all([
                    shiftRepository.getShifts(profile.company_id),
                    employeeRepository.getEmployeesByCompany(profile.company_id)
                ]);
                setShifts(shiftsData);
                setEmployees(employeesData);
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

    return {
        shifts,
        employees,
        loading,
        createShift,
        updateShift,
        deleteShift,
        assignShift,
        refresh: fetchData
    };
}
