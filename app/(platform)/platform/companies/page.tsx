"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Building2,
    Plus,
    MoreVertical,
    Filter,
    Download,
    Mail,
    X,
    Loader2,
    Copy,
    CheckCircle
} from "lucide-react"
import { Skeleton } from "../../../components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Badge } from "../../../components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "../../../components/ui/dialog"
import { supabase } from "../../../../src/infrastructure/supabase/client"

interface Company {
    id: string
    name: string
    status: string
    created_at: string
    admin_email?: string
    admin_name?: string
    employee_count?: number
}

function generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return token
}

export default function CompanyManagement() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [invitationLink, setInvitationLink] = useState<string | null>(null)

    useEffect(() => {
        fetchCompanies()
    }, [])

    async function fetchCompanies() {
        const { data, error } = await supabase
            .from("companies")
            .select("*")
            .order("created_at", { ascending: false })

        if (!error && data) {
            setCompanies(data)
        }
        setLoading(false)
    }

    async function handleCreateCompany(e: React.FormEvent) {
        e.preventDefault()
        setIsSubmitting(true)

        const form = e.target as HTMLFormElement
        const companyName = (form.elements.namedItem("companyName") as HTMLInputElement).value
        const adminName = (form.elements.namedItem("adminName") as HTMLInputElement).value
        const adminEmail = (form.elements.namedItem("adminEmail") as HTMLInputElement).value

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            // Create company
            const { data: company, error: companyError } = await supabase
                .from("companies")
                .insert({ name: companyName })
                .select()
                .single()

            if (companyError) throw companyError

            // Create invitation
            const token = generateToken()
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + 48)

            const { error: inviteError } = await supabase
                .from("invitations")
                .insert({
                    email: adminEmail,
                    full_name: adminName,
                    company_id: company.id,
                    role: "company_admin",
                    token: token,
                    invited_by: user.id,
                    expires_at: expiresAt.toISOString()
                })

            if (inviteError) throw inviteError

            // Generate invitation link
            const link = `${window.location.origin}/activate-account?token=${token}`
            setInvitationLink(link)

            // Log for demo (in production, send email)
            console.log("📧 Invitation Link:", link)

            fetchCompanies()
            form.reset()
        } catch (err: any) {
            alert(err.message || "Failed to create company")
        }

        setIsSubmitting(false)
    }

    async function handleInviteAdmin(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedCompany) return
        setIsSubmitting(true)

        const form = e.target as HTMLFormElement
        const adminName = (form.elements.namedItem("adminName") as HTMLInputElement).value
        const adminEmail = (form.elements.namedItem("adminEmail") as HTMLInputElement).value

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const token = generateToken()
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + 48)

            const { error } = await supabase
                .from("invitations")
                .insert({
                    email: adminEmail,
                    full_name: adminName,
                    company_id: selectedCompany.id,
                    role: "company_admin",
                    token: token,
                    invited_by: user.id,
                    expires_at: expiresAt.toISOString()
                })

            if (error) throw error

            const link = `${window.location.origin}/activate-account?token=${token}`
            setInvitationLink(link)
            console.log("📧 Invitation Link:", link)

            form.reset()
        } catch (err: any) {
            alert(err.message || "Failed to send invitation")
        }

        setIsSubmitting(false)
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Perusahaan</h1>
                    <p className="text-muted-foreground mt-1">Kelola penyewa dan paket langganan mereka.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Download className="h-4 w-4" /> Ekspor
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) setInvitationLink(null) }}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#0C212F] hover:bg-[#0C212F]/90 gap-2">
                                <Plus className="h-4 w-4" /> Daftar Perusahaan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Daftar Perusahaan Baru</DialogTitle>
                                <DialogDescription>
                                    Buat perusahaan dan undang adminnya.
                                </DialogDescription>
                            </DialogHeader>
                            {invitationLink ? (
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="text-green-800 text-sm font-medium">Perusahaan berhasil dibuat!</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tautan Aktivasi</Label>
                                        <div className="flex gap-2">
                                            <Input value={invitationLink} readOnly className="text-xs" />
                                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(invitationLink)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Bagikan tautan ini kepada admin perusahaan. Berlaku selama 48 jam.
                                        </p>
                                    </div>
                                    <Button className="w-full" onClick={() => { setIsCreateOpen(false); setInvitationLink(null) }}>
                                        Selesai
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateCompany} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Nama Perusahaan</Label>
                                        <Input id="companyName" name="companyName" placeholder="PT Contoh Indonesia" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="adminName">Nama Lengkap Admin</Label>
                                        <Input id="adminName" name="adminName" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="adminEmail">Email Admin</Label>
                                        <Input id="adminEmail" name="adminEmail" type="email" placeholder="admin@contoh.com" required />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="w-full bg-[#0C212F]" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Buat & Kirim Undangan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Cari perusahaan berdasarkan nama..."
                                className="pl-10 bg-slate-50 border-slate-200"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 h-9">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="w-[300px]">Perusahaan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-9 w-9 rounded-lg" />
                                                    <Skeleton className="h-4 w-40" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Skeleton className="h-8 w-8 ml-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            ) : companies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Belum ada perusahaan yang terdaftar.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                companies.map((company) => (
                                    <TableRow key={company.id} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center font-bold">
                                                    {company.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{company.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={company.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                                {company.status === "active" ? "aktif" : company.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-sm">
                                            {new Date(company.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => { setSelectedCompany(company); setIsInviteOpen(true) }}>
                                                        <Mail className="h-4 w-4 mr-2" /> Undang Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Perusahaan</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Tangguhkan Akses</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isInviteOpen} onOpenChange={(open) => { setIsInviteOpen(open); if (!open) { setSelectedCompany(null); setInvitationLink(null) } }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Undang Admin Perusahaan</DialogTitle>
                        <DialogDescription>
                            Kirim undangan ke {selectedCompany?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {invitationLink ? (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-green-800 text-sm font-medium">Undangan terkirim!</span>
                            </div>
                            <div className="space-y-2">
                                <Label>Tautan Aktivasi</Label>
                                <div className="flex gap-2">
                                    <Input value={invitationLink} readOnly className="text-xs" />
                                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(invitationLink)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => { setIsInviteOpen(false); setInvitationLink(null) }}>
                                Selesai
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleInviteAdmin} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="adminName">Nama Lengkap</Label>
                                <Input id="adminName" name="adminName" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="adminEmail">Email</Label>
                                <Input id="adminEmail" name="adminEmail" type="email" placeholder="admin@contoh.com" required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full bg-[#0C212F]" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Kirim Undangan
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
