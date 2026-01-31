-- 1. Add basic_salary to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS basic_salary NUMERIC DEFAULT 0;

-- 2. Create payslips table
CREATE TABLE IF NOT EXISTS payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    basic_salary NUMERIC NOT NULL DEFAULT 0,
    allowances NUMERIC NOT NULL DEFAULT 0,
    deductions NUMERIC NOT NULL DEFAULT 0,
    net_salary NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Draft', -- Draft, Paid, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- fk for company (if companies table exists, usually yes in Supabase)
-- We'll assume companies table exists based on previous file reads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_payslips_company'
    ) THEN
        ALTER TABLE payslips
        ADD CONSTRAINT fk_payslips_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- View Policy
DROP POLICY IF EXISTS "Users can view payslips of their own company" ON payslips;
CREATE POLICY "Users can view payslips of their own company" ON payslips
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM profiles
            WHERE id = auth.uid()
        )
    );

-- Manage Policy
DROP POLICY IF EXISTS "Admins can manage payslips of their own company" ON payslips;
CREATE POLICY "Admins can manage payslips of their own company" ON payslips
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM profiles
            WHERE id = auth.uid()
        )
    );
