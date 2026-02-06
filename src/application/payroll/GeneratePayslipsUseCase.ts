import { IPayrollRepository } from '../../domain/payroll/IPayrollRepository';
import { IEmployeeRepository } from '../../domain/employee/IEmployeeRepository';
import { Payslip } from '../../domain/payroll/payroll';

export class GeneratePayslipsUseCase {
    constructor(
        private payrollRepo: IPayrollRepository,
        private employeeRepo: IEmployeeRepository
    ) { }

    async execute(companyId: string, periodStart: Date, periodEnd: Date): Promise<void> {
        // 1. Get all employees and positions concurrently
        const [employees, positions] = await Promise.all([
            this.employeeRepo.getEmployeesByCompany(companyId),
            this.employeeRepo.getPositions(companyId)
        ]);

        // 2. Filter Active Only
        const activeEmployees = employees.filter(e => e.status === 'Active' || e.status === 'Aktif');

        // 3. Generate Draft Payslips
        const payslipsToCreate: Partial<Payslip>[] = activeEmployees.map(emp => {
            // Priority: Employee specific salary > Position default salary > 0
            let basic = Number(emp.basic_salary) || 0;

            // Allowances
            let positionAllowance = 0;
            let transportAllowance = 0;
            let mealAllowance = 0;
            let bpjsHealthAllowance = 0;
            let bpjsLaborAllowance = 0;

            // Deductions
            let bpjsHealthDeduction = 0;
            let bpjsLaborDeduction = 0;
            let taxDeduction = 0;

            // If employee has no specific salary, try to find their position's default
            if (basic === 0 && emp.position) {
                const positionData = positions.find(p => p.name === emp.position);
                if (positionData) {
                    basic = Number(positionData.base_salary) || 0;
                    positionAllowance = Number(positionData.position_allowance) || 0;
                    transportAllowance = Number(positionData.transport_allowance) || 0;
                    mealAllowance = Number(positionData.meal_allowance) || 0;
                }
            }

            // --- Simple Logic Calculation (Can be customized later) ---
            // BPJS Kesehatan (4% Company, 1% Employee) - Cap at some max if needed, simple % for now
            // Assuming basic is the base for BPJS
            bpjsHealthAllowance = Math.floor(basic * 0.04);
            bpjsHealthDeduction = Math.floor(basic * 0.01);

            // BPJS Ketenagakerjaan (JHT 3.7% Company, 2% Employee)
            bpjsLaborAllowance = Math.floor(basic * 0.037);
            bpjsLaborDeduction = Math.floor(basic * 0.02);

            // PPh 21 (Placeholder 5% if above threshold? Let's just put 0 for now or simple logic)
            // taxDeduction = basic > 4500000 ? Math.floor(basic * 0.05) : 0;

            const totalAllowance = positionAllowance + transportAllowance + mealAllowance + bpjsHealthAllowance + bpjsLaborAllowance;
            const totalDeduction = bpjsHealthDeduction + bpjsLaborDeduction + taxDeduction;
            const net = basic + totalAllowance - totalDeduction;

            return {
                company_id: companyId,
                employee_id: emp.id,
                period_start: periodStart.toISOString(),
                period_end: periodEnd.toISOString(),
                basic_salary: basic,

                // Details
                position_allowance: positionAllowance,
                transport_allowance: transportAllowance,
                meal_allowance: mealAllowance,
                bpjs_health_allowance: bpjsHealthAllowance,
                bpjs_labor_allowance: bpjsLaborAllowance,

                allowances: totalAllowance,

                bpjs_health_deduction: bpjsHealthDeduction,
                bpjs_labor_deduction: bpjsLaborDeduction,
                tax_deduction: taxDeduction,

                deductions: totalDeduction,
                net_salary: net,
                status: 'Draft'
            };
        });

        // 4. Save to Repository
        for (const payslip of payslipsToCreate) {
            await this.payrollRepo.createPayslip(payslip);
        }
    }
}
