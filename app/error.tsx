"use client"

import { useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { XCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full flex flex-col items-center">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h1>
                <p className="text-slate-500 mb-8">
                    Maaf, terjadi kesalahan pada sistem. Silakan coba muat ulang halaman.
                </p>
                <div className="flex gap-4 w-full">
                    <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                        Muat Ulang
                    </Button>
                    <Button className="flex-1 bg-blue-900 hover:bg-blue-800" onClick={() => reset()}>
                        Coba Lagi
                    </Button>
                </div>
            </div>
        </div>
    )
}
