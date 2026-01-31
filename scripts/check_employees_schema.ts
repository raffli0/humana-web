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

console.log("Checking employees schema using:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Testing Insert with 'department' and 'position' (STRING columns)...");
    const { error: errorString } = await supabase.from('employees').insert([{
        name: "Test Schema String",
        email: `test_str_${Date.now()}@example.com`,
        company_id: "00000000-0000-0000-0000-000000000000",
        department: "Test Dept",
        position: "Test Pos",
        status: "Active"
    }]);

    console.log("Insert with STRING columns result:", errorString ? errorString.message : "Success");

    console.log("\nTesting Insert with 'department_id' and 'position_id' (UUID columns)...");

    // Using a fake UUID for testing structure
    const { error: errorUUID } = await supabase.from('employees').insert([{
        name: "Test Schema UUID",
        email: `test_uuid_${Date.now()}@example.com`,
        company_id: "00000000-0000-0000-0000-000000000000",
        department_id: "00000000-0000-0000-0000-000000000000", // Will fail FK if FK exists, confirming column exists
        position_id: "00000000-0000-0000-0000-000000000000",   // Will fail FK if FK exists, confirming column exists
        status: "Active"
    }]);

    console.log("Insert with UUID columns result:", errorUUID ? errorUUID.message : "Success");
}

checkSchema();
