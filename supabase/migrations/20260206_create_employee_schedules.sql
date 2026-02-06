-- Create employee_schedules table for date-specific shift assignments
CREATE TABLE IF NOT EXISTS employee_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    shift_id uuid REFERENCES shifts(id) ON DELETE SET NULL,
    date date NOT NULL,
    company_id text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(employee_id, date)
);

-- Create index for faster queries
CREATE INDEX idx_employee_schedules_employee_date ON employee_schedules(employee_id, date);
CREATE INDEX idx_employee_schedules_company_date ON employee_schedules(company_id, date);

-- Enable RLS
ALTER TABLE employee_schedules ENABLE ROW LEVEL SECURITY;

-- Policy: Company admins can manage their company's schedules
CREATE POLICY "Company admins can manage schedules"
    ON employee_schedules
    FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM profiles 
            WHERE id = auth.uid() AND role = 'company'
        )
    );

-- Policy: Employees can view their own schedules
CREATE POLICY "Employees can view own schedules"
    ON employee_schedules
    FOR SELECT
    USING (
        employee_id IN (
            SELECT id 
            FROM employees 
            WHERE user_id = auth.uid()
        )
    );
