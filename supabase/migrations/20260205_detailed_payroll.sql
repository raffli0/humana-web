-- 1. Add Identity Columns to Employees
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS nik TEXT,
ADD COLUMN IF NOT EXISTS npwp TEXT,
ADD COLUMN IF NOT EXISTS marriage_status TEXT, -- 'Single', 'Married', 'Married with 1 child', etc.
ADD COLUMN IF NOT EXISTS employment_status TEXT; -- 'Permanent', 'Contract', 'Probation'

-- 2. Add Position Payroll Config
ALTER TABLE positions
ADD COLUMN IF NOT EXISTS position_allowance NUMERIC DEFAULT 0;

-- 3. Add Detailed Payslip Columns
ALTER TABLE payslips
-- Add Income Components
ADD COLUMN IF NOT EXISTS position_allowance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS bpjs_health_allowance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS bpjs_labor_allowance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS overtime NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS bonus NUMERIC DEFAULT 0,

-- Add Deduction Components
ADD COLUMN IF NOT EXISTS bpjs_health_deduction NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS bpjs_labor_deduction NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_deduction NUMERIC DEFAULT 0, -- PPh 21
ADD COLUMN IF NOT EXISTS loan_deduction NUMERIC DEFAULT 0;
