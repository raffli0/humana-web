export interface OvertimeRequest {
    id: string;
    employee_id: string;
    employee_name: string;
    company_id: string;
    overtime_date: string;
    duration_minutes: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_note?: string;
    created_at: string;
}
