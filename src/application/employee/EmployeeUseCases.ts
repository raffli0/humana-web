import { IEmployeeRepository } from '../../domain/employee/IEmployeeRepository';
import { Employee, Department, Position } from '../../domain/employee/employee';

export class GetEmployeesUseCase {
    constructor(private employeeRepo: IEmployeeRepository) { }

    async execute(companyId: string): Promise<{
        employees: Employee[];
        departments: Department[];
        positions: Position[];
    }> {
        const [employees, departments, positions] = await Promise.all([
            this.employeeRepo.getEmployeesByCompany(companyId),
            this.employeeRepo.getDepartments(companyId),
            this.employeeRepo.getPositions(companyId)
        ]);

        return { employees, departments, positions };
    }
}

export class UpdateEmployeeUseCase {
    constructor(private employeeRepo: IEmployeeRepository) { }

    async execute(employee: Partial<Employee> & { id: string }): Promise<void> {
        await this.employeeRepo.updateEmployee(employee);
    }
}
