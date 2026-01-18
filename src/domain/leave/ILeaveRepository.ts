import { LeaveRequest } from './leave';

export interface ILeaveRepository {
    getLeaveRequestsByCompany(companyId: string): Promise<LeaveRequest[]>;
    updateLeaveStatus(leaveId: string, status: string): Promise<void>;
    createLeaveRequest(request: Partial<LeaveRequest>): Promise<void>;
    getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]>;
}
