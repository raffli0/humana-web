import { AttendanceRecord, OfficeLocation } from './attendance';

export interface IAttendanceRepository {
    getAttendanceByDate(date: string): Promise<AttendanceRecord[]>;
    getAttendanceByCompanyAndDate(companyId: string, date: string): Promise<AttendanceRecord[]>;
    getOfficeLocation(companyId: string): Promise<OfficeLocation | null>;
    getDepartments(companyId: string): Promise<string[]>;
}
