import { Payslip } from './payroll';

export interface IPayrollRepository {
    getPayslipsByCompany(companyId: string): Promise<Payslip[]>;
    updatePayslipStatus(payslipId: string, status: string): Promise<void>;
    createPayslip(payslip: Partial<Payslip>): Promise<void>;
    getPayslipsByEmployee(employeeId: string): Promise<Payslip[]>;
}
