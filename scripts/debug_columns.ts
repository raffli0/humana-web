
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dnmtpwbfnptybciyqlcp.supabase.co";
const supabaseKey = "sb_publishable_YdoBJ9r2kBi6kEgVF3LNtg_a39wBdvl"; // Using the key from client.ts

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data, error } = await supabase.from('attendance').select('*').limit(1);
    if (data && data.length > 0) {
        console.log("Attendance Record Structure:", Object.keys(data[0]));
        console.log("First Record:", data[0]);
    } else {
        console.log("No data or error:", error);
    }
}

checkColumns();
