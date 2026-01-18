export interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    company_id: string | null;
    role: string | null;
    status: string | null;
    avatar_url?: string;
}
