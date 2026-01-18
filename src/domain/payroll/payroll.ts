export interface Payslip {
    id: string;
    employee_id: string;
    period_start: string;
    period_end: string;
    basic_salary: number;
    allowances: number;
    deductions: number;
    net_salary: number;
    status: 'Draft' | 'Paid' | 'Cancelled' | string;
    created_at: string;
    company_id: string;
    employees?: {
        name: string;
        avatar?: string;
        department?: string;
        position?: string;
    };
}

export interface PayrollSummary {
    total_base: number;
    total_allowance: number;
    total_deduction: number;
    net_payout: number;
    employee_count: number;
}
