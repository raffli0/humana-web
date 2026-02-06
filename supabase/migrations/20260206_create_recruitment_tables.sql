-- Drop existing tables to ensure clean slate
drop table if exists public.candidates cascade;
drop table if exists public.recruitments cascade;

-- Create recruitments table
create table if not exists public.recruitments (
    id uuid not null default uuid_generate_v4() primary key,
    company_id uuid not null references public.companies(id) on delete cascade,
    title text not null,
    slug text not null,
    department text,
    location text,
    type text, -- 'Full-time', 'Contract', 'Internship'
    status text not null default 'Open', -- 'Open', 'Closed', 'Draft'
    description text,
    salary_range text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create candidates table
create table if not exists public.candidates (
    id uuid not null default uuid_generate_v4() primary key,
    job_id uuid not null references public.recruitments(id) on delete cascade,
    company_id uuid not null references public.companies(id) on delete cascade,
    full_name text not null,
    email text not null,
    phone text,
    resume_url text, 
    status text not null default 'New', -- 'New', 'Screening', 'Interview', 'Offered', 'Rejected', 'Hired'
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Add indexes
create index if not exists recruitments_company_id_idx on public.recruitments(company_id);
create index if not exists candidates_job_id_idx on public.candidates(job_id);
create index if not exists candidates_company_id_idx on public.candidates(company_id);

-- Enable RLS
alter table public.recruitments enable row level security;
alter table public.candidates enable row level security;

-- Policies for Recruitments
-- Admins can do everything on their own company's recruitments
create policy "Admins can manage their company recruitments"
    on public.recruitments
    for all
    using (
        company_id in (
            select company_id from public.profiles 
            where id = auth.uid() 
            and (role = 'company_admin' or role = 'super_admin')
        )
    );

-- Public (Mobile App) can view Open recruitments
create policy "Public can view open recruitments"
    on public.recruitments
    for select
    using (status = 'Open');

-- Policies for Candidates
-- Admins can view candidates for their company
create policy "Admins can view their candidates"
    on public.candidates
    for select
    using (
        company_id in (
            select company_id from public.profiles 
            where id = auth.uid() 
            and (role = 'company_admin' or role = 'super_admin')
        )
    );

-- Admins can update candidates (status change)
create policy "Admins can update their candidates"
    on public.candidates
    for update
    using (
        company_id in (
            select company_id from public.profiles 
            where id = auth.uid() 
            and (role = 'company_admin' or role = 'super_admin')
        )
    );

-- Public (Mobile App) can insert candidates (Apply)
create policy "Public can submit applications"
    on public.candidates
    for insert
    with check (true);
