import { IEmployeeRepository } from '../../domain/employee/IEmployeeRepository';

export class DeleteEmployeeUseCase {
    constructor(private employeeRepo: IEmployeeRepository) { }

    async execute(id: string): Promise<void> {
        await this.employeeRepo.deleteEmployee(id);
    }
}
