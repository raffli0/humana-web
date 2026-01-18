import { IAttendanceRepository } from '../../domain/attendance/IAttendanceRepository';
import { AttendanceRecord, OfficeLocation } from '../../domain/attendance/attendance';

export class GetAttendanceUseCase {
    constructor(private attendanceRepo: IAttendanceRepository) { }

    async execute(date: string, companyId: string): Promise<{
        records: AttendanceRecord[];
        officeLocation: OfficeLocation | null;
    }> {
        const [records, officeLocation] = await Promise.all([
            this.attendanceRepo.getAttendanceByDate(date),
            this.attendanceRepo.getOfficeLocation(companyId)
        ]);

        return { records, officeLocation };
    }
}
