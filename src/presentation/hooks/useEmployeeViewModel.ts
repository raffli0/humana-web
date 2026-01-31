import { useState, useEffect, useCallback } from 'react';
import { employeeRepository } from '../../infrastructure/supabase/SupabaseEmployeeRepository';
import { authService } from '../../infrastructure/auth/authService';
import { GetEmployeesUseCase, UpdateEmployeeUseCase } from '../../application/employee/EmployeeUseCases';
import { InviteEmployeeUseCase } from '../../application/employee/InviteEmployeeUseCase';
import { DeleteEmployeeUseCase } from '../../application/employee/DeleteEmployeeUseCase';
import { Employee, Department, Position, Invitation } from '../../domain/employee/employee';

export function useEmployeeViewModel() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getEmployeesUseCase = new GetEmployeesUseCase(employeeRepository);
    const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository);
    const inviteEmployeeUseCase = new InviteEmployeeUseCase(employeeRepository);
    const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                const { employees, departments, positions } = await getEmployeesUseCase.execute(profile.company_id);
                setEmployees(employees);
                setDepartments(departments);
                setPositions(positions);
            }
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateEmployee = async (employee: Partial<Employee> & { id: string }) => {
        setIsSubmitting(true);
        try {
            await updateEmployeeUseCase.execute(employee);
            setEmployees(prev => prev.map(emp => emp.id === employee.id ? { ...emp, ...employee } : emp));
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteEmployee = async (id: string) => {
        // Optimistic update or wait? Let's wait for safety but we could optimistically remove.
        // We will just call API and then filter out from state.
        try {
            await deleteEmployeeUseCase.execute(id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
        } catch (e) {
            console.error("Delete failed", e);
            throw e;
        }
    };

    const inviteEmployee = async (invitation: Invitation) => {
        setIsSubmitting(true);
        try {
            await inviteEmployeeUseCase.execute(invitation);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        employees,
        departments,
        positions,
        loading,
        isSubmitting,
        updateEmployee,
        inviteEmployee,
        deleteEmployee,
        refresh: fetchData,
        setEmployees // Expose for local updates if needed by existing UI logic
    };
}
