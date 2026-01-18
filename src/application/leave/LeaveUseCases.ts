import { ILeaveRepository } from '../../domain/leave/ILeaveRepository';
import { LeaveRequest } from '../../domain/leave/leave';

export class GetLeaveRequestsUseCase {
    constructor(private leaveRepo: ILeaveRepository) { }

    async execute(companyId: string): Promise<LeaveRequest[]> {
        return await this.leaveRepo.getLeaveRequestsByCompany(companyId);
    }
}

export class UpdateLeaveStatusUseCase {
    constructor(private leaveRepo: ILeaveRepository) { }

    async execute(leaveId: string, status: 'Approved' | 'Rejected'): Promise<void> {
        await this.leaveRepo.updateLeaveStatus(leaveId, status);
    }
}

export class CreateLeaveRequestUseCase {
    constructor(private leaveRepo: ILeaveRepository) { }

    async execute(request: Partial<LeaveRequest>): Promise<void> {
        await this.leaveRepo.createLeaveRequest(request);
    }
}
