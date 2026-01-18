export interface JobPost {
    id: string;
    title: string;
    description: string | null;
    department: string | null;
    location: string | null;
    type: string | null; // e.g., 'Full-time', 'Contract'
    status: 'Open' | 'Closed' | 'Draft' | string;
    created_at: string;
    company_id: string;
}

export interface Candidate {
    id: string;
    job_id: string;
    full_name: string;
    email: string;
    phone: string | null;
    status: 'New' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected' | string;
    resume_url: string | null;
    created_at: string;
    jobs?: {
        title: string;
    };
}

export interface RecruitmentSummary {
    open_jobs: number;
    total_candidates: number;
    new_candidates: number;
}
