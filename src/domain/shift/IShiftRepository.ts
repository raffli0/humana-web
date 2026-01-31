import { Shift, ShiftWithEmployeeCount } from './shift';

export interface IShiftRepository {
    getShifts(companyId: string): Promise<ShiftWithEmployeeCount[]>;
    createShift(shift: Omit<Shift, 'id' | 'created_at'>): Promise<Shift>;
    updateShift(shift: Partial<Shift> & { id: string }): Promise<Shift>;
    deleteShift(id: string): Promise<void>;
    assignShiftToEmployee(employeeId: string, shiftId: string | null): Promise<void>;
}
