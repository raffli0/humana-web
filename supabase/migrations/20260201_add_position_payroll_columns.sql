-- Add payroll configuration columns to positions table
ALTER TABLE positions 
ADD COLUMN IF NOT EXISTS base_salary NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS transport_allowance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS meal_allowance NUMERIC DEFAULT 0;
