import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars
const envPath = path.resolve(process.cwd(), ".env.local");
let supabaseUrl = "";
let supabaseKey = "";

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = value.trim();
            if (key.trim() === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseKey = value.trim();
        }
    });
}

console.log("Checking invitations schema using:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    // 1. Check Invitations Table
    console.log("--- Invitations Table Structure ---");
    const { data: invitations, error: invError } = await supabase.from('invitations').select('*').limit(1);
    if (invError) {
        console.error("Error fetching invitations:", invError.message);
    } else if (invitations && invitations.length > 0) {
        console.log("Found invitation columns:", Object.keys(invitations[0]));
        console.log("Sample row:", invitations[0]);
    } else {
        console.log("Invitations table empty or select failed.");
        // Try inserting a comprehensive dummy to see what fails or checking info via failed insert
        const { error: insertError } = await supabase.from('invitations').insert([{
            email: "debug_schema@test.com",
            token: "debug_token",
            expires_at: new Date().toISOString(),
            department_id: "00000000-0000-0000-0000-000000000000",
            position_id: "00000000-0000-0000-0000-000000000000"
        }]);
        if (insertError) console.log("Insert test error (might indicate missing columns):", insertError.message);
    }

    // 2. Check Employees Table
    console.log("\n--- Employees Table Structure ---");
    const { data: employees, error: empError } = await supabase.from('employees').select('*').limit(1);
    if (empError) {
        console.error("Error fetching employees:", empError.message);
    } else if (employees && employees.length > 0) {
        const row = employees[0];
        console.log("Found employee columns:", Object.keys(row));
        console.log("Has 'department_id'?", 'department_id' in row);
        console.log("Has 'position_id'?", 'position_id' in row);
        console.log("Has 'department' string?", 'department' in row);
        console.log("Has 'position' string?", 'position' in row);
    }
}

checkSchema();
