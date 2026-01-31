import { IAttendanceRepository } from '../../domain/attendance/IAttendanceRepository';
import { AttendanceRecord, OfficeLocation } from '../../domain/attendance/attendance';

export class GetAttendanceUseCase {
    constructor(private attendanceRepo: IAttendanceRepository) { }

    async execute(date: string, companyId: string): Promise<{
        records: AttendanceRecord[];
        officeLocation: OfficeLocation | null;
        departments: string[];
    }> {
        const [records, officeLocation, departments] = await Promise.all([
            this.attendanceRepo.getAttendanceByDate(date),
            this.attendanceRepo.getOfficeLocation(companyId),
            this.attendanceRepo.getDepartments(companyId)
        ]);

        return { records, officeLocation, departments };
    }
}
