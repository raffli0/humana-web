import { Profile } from "../employee/profile";

export interface CompanySettings {
    office_latitude: number | null;
    office_longitude: number | null;
    office_radius_meters: number | null;
    office_address: string | null;
}

export interface Department {
    id: string;
    name: string;
    company_id: string;
}

export interface Position {
    id: string;
    name: string;
    department_id: string | null;
    company_id: string;
}

export interface ISettingsRepository {
    getSettings(companyId: string): Promise<CompanySettings | null>;
    saveSettings(companyId: string, settings: CompanySettings): Promise<void>;
    getDepartments(companyId: string): Promise<Department[]>;
    addDepartment(companyId: string, name: string): Promise<void>;
    deleteDepartment(id: string): Promise<void>;
    getPositions(companyId: string): Promise<Position[]>;
    addPosition(companyId: string, name: string, departmentId?: string): Promise<void>;
    deletePosition(id: string): Promise<void>;
}
