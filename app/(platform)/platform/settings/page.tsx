"use client"

import { useState, useEffect } from "react"
import {
    Settings,
    Shield,
    Database,
    Cloud,
    Mail,
    Lock,
    Save,
    Bell,
    Globe
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Skeleton } from "../../../components/ui/skeleton"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Switch } from "../../../components/ui/switch"
import { Label } from "../../../components/ui/label"

export default function SystemConfiguration() {
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-64 bg-slate-200" />
                        <Skeleton className="h-4 w-96 bg-slate-100" />
                    </div>
                    <Skeleton className="h-10 w-32 bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-11 w-full bg-slate-100" />
                        ))}
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border-none shadow-sm ring-1 ring-gray-200">
                                <CardHeader>
                                    <Skeleton className="h-6 w-32 bg-slate-200" />
                                    <Skeleton className="h-4 w-48 bg-slate-100 mt-2" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-16 w-full bg-slate-50" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Konfigurasi Sistem</h1>
                    <p className="text-muted-foreground mt-1">Pengaturan seluruh platform dan kontrol keamanan.</p>
                </div>
                <Button className="bg-[#0C212F] hover:bg-[#0C212F]/90 gap-2">
                    <Save className="h-4 w-4" /> Simpan Perubahan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Nav (Mini) */}
                <div className="space-y-2">
                    <NavButton icon={Shield} label="Pengaturan Umum" active />
                    <NavButton icon={Database} label="Database & Penyimpanan" />
                    <NavButton icon={Lock} label="Autentikasi" />
                    <NavButton icon={Mail} label="Notifikasi Email" />
                    <NavButton icon={Globe} label="Wilayah & Lokalisasi" />
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Pemeliharaan Platform</CardTitle>
                            <CardDescription>Kontrol akses publik ke platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Mode Pemeliharaan</Label>
                                    <p className="text-sm text-muted-foreground">Alihkan semua pengguna non-admin ke halaman pemeliharaan.</p>
                                </div>
                                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Konfigurasi Email</CardTitle>
                            <CardDescription>Atur SMTP atau penyedia email transaksional.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="smtp-host">Host SMTP</Label>
                                <Input id="smtp-host" placeholder="smtp.mailgun.org" className="bg-slate-50 border-slate-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp-port">Port</Label>
                                    <Input id="smtp-port" placeholder="587" className="bg-slate-50 border-slate-200" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="encryption">Enkripsi</Label>
                                    <Input id="encryption" placeholder="TLS" className="bg-slate-50 border-slate-200" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Keamanan & Akses</CardTitle>
                            <CardDescription>Kelola kebijakan kata sandi dan batasan sesi global.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Wajibkan 2FA untuk Super Admin</p>
                                    <p className="text-xs text-muted-foreground">Wajibkan autentikasi dua faktor untuk semua administrator platform.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <Label>Panjang Min. Kata Sandi</Label>
                                <Input type="number" defaultValue={12} className="w-24 mt-2 bg-slate-50 border-slate-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function NavButton({ icon: Icon, label, active = false }: any) {
    return (
        <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-11 px-4 ${active ? "bg-white shadow-sm ring-1 ring-gray-200 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-slate-100"}`}
        >
            <Icon className={`h-4 w-4 ${active ? "text-indigo-600" : "text-gray-400"}`} />
            {label}
        </Button>
    )
}
