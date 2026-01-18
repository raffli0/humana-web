export interface AttendanceRecord {
    id: string;
    employee_id: string;
    employee_name: string;
    employeeName?: string; // For compatibility with existing UI
    check_in: string | null;
    check_out: string | null;
    status: 'Present' | 'Late' | 'Absent';
    date: string;
    location?: {
        lat: number;
        lng: number;
        address: string;
    };
    employees?: {
        name: string;
        avatar?: string;
        department?: string;
    };
}

export interface OfficeLocation {
    lat: number;
    lng: number;
    radius: number;
    address: string | null;
}
