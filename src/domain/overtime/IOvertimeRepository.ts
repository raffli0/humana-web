import { OvertimeRequest } from "./overtime";

export interface IOvertimeRepository {
    getOvertimeRequests(companyId: string): Promise<OvertimeRequest[]>;
    updateOvertimeStatus(id: string, status: 'approved' | 'rejected', adminNote?: string): Promise<void>;
}
