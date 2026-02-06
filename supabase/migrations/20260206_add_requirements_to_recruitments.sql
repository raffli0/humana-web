-- Add requirements column to recruitments table
alter table public.recruitments 
add column if not exists requirements text;
