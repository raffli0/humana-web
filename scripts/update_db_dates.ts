
import { createClient } from '@supabase/supabase-js';

// Hardcoded keys from app/utils/supabase/client.ts
const supabaseUrl = "https://dnmtpwbfnptybciyqlcp.supabase.co";
const supabaseKey = "sb_publishable_YdoBJ9r2kBi6kEgVF3LNtg_a39wBdvl";

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDates() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];

    console.log(`Updating dates to Today: ${today}, Tomorrow: ${tomorrow}`);

    // 1. Update Attendance
    console.log("Fetching attendance records...");
    const { data: attendance, error: attError } = await supabase.from('attendance').select('id');

    if (attError) {
        console.error("Error fetching attendance:", attError);
    } else if (attendance) {
        console.log(`Found ${attendance.length} attendance records. Updating...`);
        for (const rec of attendance) {
            const { error } = await supabase.from('attendance').update({ date: today }).eq('id', rec.id);
            if (error) console.error(`Failed to update attendance ${rec.id}:`, error);
        }
    }

    // 2. Update Leave Requests
    console.log("Fetching leave requests...");
    const { data: leaves, error: leaveError } = await supabase.from('leave_requests').select('id');

    if (leaveError) {
        console.error("Error fetching leave requests:", leaveError);
    } else if (leaves) {
        console.log(`Found ${leaves.length} leave requests. Updating...`);
        for (const rec of leaves) {
            const { error } = await supabase.from('leave_requests').update({
                start_date: today,
                end_date: tomorrow,
                request_date: today
            }).eq('id', rec.id);
            if (error) console.error(`Failed to update leave request ${rec.id}:`, error);
        }
    }

    // 3. Update Recruitments (Optional, blindly updating posted/posted_at if they exist not easy without checking schema, assuming 'posted' column from previous finding)
    console.log("Fetching recruitments...");
    const { data: recruitments, error: recError } = await supabase.from('recruitments').select('id');
    if (recError) {
        console.error("Error fetching recruitments:", recError);
    } else if (recruitments) {
        console.log(`Found ${recruitments.length} recruitments. Updating...`);
        for (const rec of recruitments) {
            // Try updating 'posted'
            const { error } = await supabase.from('recruitments').update({
                posted: today
            }).eq('id', rec.id);
            // Ignore error if column doesn't exist
        }
    }

    console.log("Update process finished.");
}

updateDates();
