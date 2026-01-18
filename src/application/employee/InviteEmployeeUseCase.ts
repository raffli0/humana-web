import { IEmployeeRepository } from '../../domain/employee/IEmployeeRepository';
import { Invitation } from '../../domain/employee/employee';

export class InviteEmployeeUseCase {
    constructor(private employeeRepo: IEmployeeRepository) { }

    async execute(invitation: Invitation): Promise<void> {
        await this.employeeRepo.createInvitation(invitation);
    }
}
