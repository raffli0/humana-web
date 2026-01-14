"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navbar from "../../components/ui/navbar"
import { supabase } from "../../utils/supabase/client"

export default function CompanyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            // Fetch profile for role check
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            if (!profile) {
                // If no profile, maybe it's a new registration or system error
                router.push("/login")
                return
            }

            if (profile.role === "super_admin") {
                router.push("/platform/dashboard")
                return
            }

            if (profile.role === "employee") {
                // Employee is mobile only
                router.push("/login") // Or a specific "Access Denied" page
                return
            }

            // If we reach here, user is company_admin or hr_staff
            setAuthorized(true)
            setLoading(false)
        }

        // skip check for local dev if needed, or implement properly
        // For now, let's implement properly as requested
        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C212F]"></div>
            </div>
        )
    }

    if (!authorized) return null

    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-50/30">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
