"use client"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full flex flex-col items-center">
                <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Halaman Tidak Ditemukan</h1>
                <p className="text-slate-500 mb-8">
                    Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                </p>
                <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
                        Kembali
                    </Button>
                    <Button className="flex-1 bg-blue-900 hover:bg-blue-800" asChild>
                        <Link href="/login">Ke Beranda</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
