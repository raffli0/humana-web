"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../../components/ui/navbar"
import { supabase } from "../../utils/supabase/client"

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            if (!profile || profile.role !== "super_admin") {
                router.push("/company/dashboard")
                return
            }

            setAuthorized(true)
            setLoading(false)
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
