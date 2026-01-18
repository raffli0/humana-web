import { IPayrollRepository } from '../../domain/payroll/IPayrollRepository';
import { Payslip } from '../../domain/payroll/payroll';

export class GetPayslipsUseCase {
    constructor(private payrollRepo: IPayrollRepository) { }

    async execute(companyId: string): Promise<Payslip[]> {
        return await this.payrollRepo.getPayslipsByCompany(companyId);
    }
}

export class UpdatePayslipStatusUseCase {
    constructor(private payrollRepo: IPayrollRepository) { }

    async execute(payslipId: string, status: 'Paid' | 'Cancelled'): Promise<void> {
        await this.payrollRepo.updatePayslipStatus(payslipId, status);
    }
}

export class CreatePayslipUseCase {
    constructor(private payrollRepo: IPayrollRepository) { }

    async execute(payslip: Partial<Payslip>): Promise<void> {
        await this.payrollRepo.createPayslip(payslip);
    }
}
