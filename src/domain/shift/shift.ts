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

export interface ShiftSwap {
    id: string;
    requester_id: string;
    requester_name: string;
    company_id: string;
    my_shift_date: string;       // "YYYY-MM-DD"
    target_user_id?: string;     // Can be nullable/undefined if swapping with "Anyone" (though schema said text)
    target_user_name?: string;
    target_shift_date?: string;  // "YYYY-MM-DD"
    reason?: string;
    status: 'pending' | 'approved' | 'rejected' | string;
    admin_note?: string;
    created_at: string;
}

export interface EmployeeSchedule {
    id: string;
    employee_id: string;
    shift_id: string | null;
    date: string;  // "YYYY-MM-DD"
    company_id: string;
    created_at?: string;
    updated_at?: string;
}

