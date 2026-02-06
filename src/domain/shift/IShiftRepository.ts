import { Shift, ShiftWithEmployeeCount, ShiftSwap } from './shift';

export interface IShiftRepository {
    getShifts(companyId: string): Promise<ShiftWithEmployeeCount[]>;
    createShift(shift: Omit<Shift, 'id' | 'created_at'>): Promise<Shift>;
    updateShift(shift: Partial<Shift> & { id: string }): Promise<Shift>;
    deleteShift(id: string): Promise<void>;
    assignShiftToEmployee(employeeId: string, shiftId: string | null): Promise<void>;

    // Shift Swaps
    getShiftSwaps(companyId: string): Promise<ShiftSwap[]>;
    updateShiftSwapStatus(id: string, status: string, adminNote?: string): Promise<void>;

    // Employee Schedules
    getEmployeeSchedule(employeeId: string, date: string): Promise<any | null>;
    upsertEmployeeSchedule(schedule: { employee_id: string; shift_id: string | null; date: string; company_id: string }): Promise<void>;
    executeShiftSwap(swapId: string): Promise<void>;
}
