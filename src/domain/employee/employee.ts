export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    department: string | null;
    position: string | null;
    status: 'Active' | 'Inactive' | 'On Leave' | string;
    avatar: string | null;
    join_date: string | null;
    company_id: string;
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

export interface Invitation {
    email: string;
    full_name: string;
    company_id: string;
    role: string;
    token: string;
    invited_by: string;
    expires_at: string;
    department_id: string | null;
    position_id: string | null;
}
