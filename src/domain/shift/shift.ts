export interface Shift {
    id: string;
    company_id: string;
    name: string;
    start_time: string; // HH:mm:ss
    end_time: string;   // HH:mm:ss
    late_tolerance_minutes?: number;
    created_at?: string;
}

export interface ShiftWithEmployeeCount extends Shift {
    employee_count: number;
}
