import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// Load env vars from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Error: Env vars missing")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
    // 1. Use hardcoded company ID (bypassing RLS fetch issue)
    const companyId = "1c98ac55-af27-4a9e-94bf-be2aa752b548";
    console.log("Using Company ID:", companyId);

    // 2. Update employee 'Sarah Johnson' (ENG001) to this company
    const employeeId = "ENG001";
    const { error: updateError } = await supabase
        .from("employees")
        .update({ company_id: companyId, status: "Active" })
        .eq("id", employeeId);

    if (updateError) {
        console.error("Error updating employee:", updateError);
        return;
    }
    console.log("Updated Sarah Johnson to company:", companyId);

    // 3. Insert Attendance Record for today
    const today = new Date().toISOString().split('T')[0];

    // Check if exists
    const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("employee_id", employeeId)
        .eq("date", today);

    if (existing && existing.length > 0) {
        console.log("Attendance already exists for today. Deleting...");
        await supabase.from("attendance").delete().eq("id", existing[0].id);
    }

    const { error: insertError } = await supabase
        .from("attendance")
        .insert({
            company_id: companyId,
            employee_id: employeeId,
            date: today,
            check_in: "08:30:00",
            check_out: null, // Still working
            status: "Present",
            location: {
                lat: -6.2090, // Slightly different from office to show separation
                lng: 106.8460,
                address: "Coffee Shop Nearby"
            },
            employee_name: "Sarah Johnson"
        });

    if (insertError) {
        console.error("Error inserting attendance:", insertError);
    } else {
        console.log("Successfully seeded attendance for Sarah Johnson!");
    }
}

seed();
