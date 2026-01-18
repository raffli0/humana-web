"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navbar from "../../components/ui/navbar"
import { authService } from "@/src/infrastructure/auth/authService";

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
            try {
                const profile = await authService.getCurrentProfile();

                if (!profile) {
                    router.push("/login")
                    return
                }

                if (profile.role === "super_admin") {
                    router.push("/platform/dashboard")
                    return
                }

                if (profile.role === "employee") {
                    // Employee is mobile only
                    router.push("/login")
                    return
                }

                // If we reach here, user is company_admin or hr_staff
                setAuthorized(true)
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/login");
            } finally {
                setLoading(false)
            }
        }

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
