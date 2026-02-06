"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Navbar from "../../components/ui/navbar"
import { Skeleton } from "@/app/components/ui/skeleton";
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
            <div className="flex flex-col min-h-screen w-full bg-slate-50/30">
                <div className="h-16 w-full bg-[#0C212F] flex items-center px-6">
                    <Skeleton className="h-8 w-32 bg-white/10" />
                </div>
                <div className="p-8 space-y-8">
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-64" />
                            <Skeleton className="h-4 w-96" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
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
