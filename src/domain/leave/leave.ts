export interface LeaveRequest {
    id: string;
    employee_id: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string | null;
    status: 'Pending' | 'Approved' | 'Rejected' | string;
    created_at: string;
    company_id: string;
    employees?: {
        name: string;
        avatar?: string;
        department?: string;
    };
}

export interface LeaveBalance {
    id: string;
    employee_id: string;
    leave_type: string;
    total_days: number;
    used_days: number;
    remaining_days: number;
    year: number;
}
