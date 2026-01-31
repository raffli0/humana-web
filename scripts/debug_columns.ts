
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dnmtpwbfnptybciyqlcp.supabase.co";
const supabaseKey = "sb_publishable_YdoBJ9r2kBi6kEgVF3LNtg_a39wBdvl"; // Using the key from client.ts

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data, error } = await supabase.from('positions').select('id, name, base_salary, transport_allowance, meal_allowance').limit(1);
    if (error) {
        console.log("Error querying columns:", error);
    } else {
        console.log("Success! Columns found. Data:", data);
    }
}

checkColumns();
