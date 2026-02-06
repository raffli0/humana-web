-- Add missing allowance columns to payslips
ALTER TABLE payslips
ADD COLUMN IF NOT EXISTS transport_allowance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS meal_allowance NUMERIC DEFAULT 0;
