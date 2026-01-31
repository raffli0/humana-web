import { supabase } from '../supabase/client';
import { Employee, Department, Position, Invitation } from '../../domain/employee/employee';
import { IEmployeeRepository } from '../../domain/employee/IEmployeeRepository';

export class SupabaseEmployeeRepository implements IEmployeeRepository {
    async getEmployeesByCompany(companyId: string): Promise<Employee[]> {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('company_id', companyId);

        if (error) throw error;
        return data || [];
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

    async getPositions(companyId: string): Promise<Position[]> {
        const { data, error } = await supabase
            .from("positions")
            .select("*")
            .eq("company_id", companyId)
            .order("name");

        if (error) throw error;
        return data || [];
    }

    async updateEmployee(employee: Partial<Employee> & { id: string }): Promise<void> {
        const { error } = await supabase
            .from('employees')
            .update(employee)
            .eq('id', employee.id);

        if (error) throw error;
    }

    async createInvitation(invitation: Invitation): Promise<void> {
        const { error } = await supabase
            .from("invitations")
            .insert(invitation);

        if (error) throw error;
    }

    async deleteEmployee(id: string): Promise<void> {
        // Cascade delete dependent records first
        // 1. Attendance
        const { error: attError } = await supabase
            .from('attendance')
            .delete()
            .eq('employee_id', id);

        if (attError) console.error("Error deleting attendance records:", attError);

        // 2. Leave Requests
        const { error: leaveError } = await supabase
            .from('leave_requests')
            .delete()
            .eq('employee_id', id);

        if (leaveError) console.error("Error deleting leave requests:", leaveError);

        // 3. Payslips
        const { error: payError } = await supabase
            .from('payslips')
            .delete()
            .eq('employee_id', id);

        if (payError) console.error("Error deleting payslips:", payError);

        // 4. Finally Delete Employee
        const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}

export const employeeRepository = new SupabaseEmployeeRepository();
