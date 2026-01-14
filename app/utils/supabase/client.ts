import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dnmtpwbfnptybciyqlcp.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_YdoBJ9r2kBi6kEgVF3LNtg_a39wBdvl"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
