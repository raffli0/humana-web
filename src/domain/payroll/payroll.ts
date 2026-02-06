export interface Payslip {
    id: string;
    employee_id: string;
    period_start: string;
    period_end: string;
    basic_salary: number;
    // Allowances
    position_allowance?: number;
    bpjs_health_allowance?: number;
    bpjs_labor_allowance?: number;
    transport_allowance?: number;
    meal_allowance?: number;
    overtime?: number;
    bonus?: number;
    allowances: number;

    // Deductions
    bpjs_health_deduction?: number;
    bpjs_labor_deduction?: number;
    tax_deduction?: number;
    loan_deduction?: number;
    deductions: number;

    net_salary: number;
    status: 'Draft' | 'Paid' | 'Cancelled' | 'Pending' | 'Processing' | string;
    created_at: string;
    company_id: string;
    employees?: {
        name: string;
        avatar?: string;
        department?: string;
        position?: string;
        nik?: string;
        npwp?: string;
        employment_status?: string;
    };
}

export interface PayrollSummary {
    total_base: number;
    total_allowance: number;
    total_deduction: number;
    net_payout: number;
    employee_count: number;
}
