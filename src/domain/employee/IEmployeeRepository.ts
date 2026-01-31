import { Employee, Department, Position, Invitation } from './employee';

export interface IEmployeeRepository {
    getEmployeesByCompany(companyId: string): Promise<Employee[]>;
    getDepartments(companyId: string): Promise<Department[]>;
    getPositions(companyId: string): Promise<Position[]>;
    updateEmployee(employee: Partial<Employee> & { id: string }): Promise<void>;
    createInvitation(invitation: Invitation): Promise<void>;
    deleteEmployee(id: string): Promise<void>;
}
