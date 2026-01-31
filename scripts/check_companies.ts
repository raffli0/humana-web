import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars
const envPath = path.resolve(process.cwd(), ".env.local");
let supabaseUrl = "";
let supabaseKey = "";

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    // Simple parser for manual env loading
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = value.trim();
            if (key.trim() === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseKey = value.trim();
        }
    });
}

console.log("Checking companies schema using:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompanies() {
    console.log("--- Companies Table Structure ---");
    const { data: companies, error } = await supabase.from('companies').select('*').limit(1);

    if (error) {
        console.error("Error fetching companies:", error.message);
    } else if (companies && companies.length > 0) {
        console.log("Found company columns:", Object.keys(companies[0]));
        console.log("Sample row:", companies[0]);
    } else {
        console.log("Companies table empty or select failed.");
    }
}

checkCompanies();
