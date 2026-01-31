import { IPayrollRepository } from '../../domain/payroll/IPayrollRepository';
import { IEmployeeRepository } from '../../domain/employee/IEmployeeRepository';
import { Payslip } from '../../domain/payroll/payroll';

export class GeneratePayslipsUseCase {
    constructor(
        private payrollRepo: IPayrollRepository,
        private employeeRepo: IEmployeeRepository
    ) { }

    async execute(companyId: string, periodStart: Date, periodEnd: Date): Promise<void> {
        // 1. Get all employees
        const employees = await this.employeeRepo.getEmployeesByCompany(companyId);

        // 2. Filter Active Only (optional, assuming 'Active' status string)
        const activeEmployees = employees.filter(e => e.status === 'Active' || e.status === 'Aktif');

        // 3. Generate Draft Payslips
        const payslipsToCreate: Partial<Payslip>[] = activeEmployees.map(emp => {
            const basic = Number(emp.basic_salary) || 0;
            const allowance = 0; // Future: Calculate based on attendance/policies
            const deduction = 0; // Future: Calculate based on late/absent
            const net = basic + allowance - deduction;

            return {
                company_id: companyId,
                employee_id: emp.id,
                period_start: periodStart.toISOString(),
                period_end: periodEnd.toISOString(),
                basic_salary: basic,
                allowances: allowance,
                deductions: deduction,
                net_salary: net,
                status: 'Draft'
            };
        });

        // 4. Save to Repository
        // Using batch or loop. For safety and simplicity now, loop.
        for (const payslip of payslipsToCreate) {
            await this.payrollRepo.createPayslip(payslip);
        }
    }
}
