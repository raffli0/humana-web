import { createClient } from "@supabase/supabase-js"

// Hardcoded for now as per the app's current state
const supabaseUrl = "https://dnmtpwbfnptybciyqlcp.supabase.co"
const supabaseAnonKey = "sb_publishable_YdoBJ9r2kBi6kEgVF3LNtg_a39wBdvl"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setRole(email: string, role: string) {
    console.log(`Setting role '${role}' for user '${email}'...`)

    const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single()

    if (fetchError || !profile) {
        console.error("Error: User profile not found. Make sure the user is registered.")
        return
    }

    const { error: updateError } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", profile.id)

    if (updateError) {
        console.error("Error updating role:", updateError.message)
    } else {
        console.log("Success! Role updated.")
    }
}

const args = process.argv.slice(2)
if (args.length < 2) {
    console.log("Usage: npx tsx scripts/set_role.ts <email> <role>")
    console.log("Roles: super_admin, company_admin, hr_staff, employee")
} else {
    setRole(args[0], args[1])
}
