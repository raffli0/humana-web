"use client"

import { useState, useEffect } from "react"
import {
    Building2,
    Users,
    CreditCard,
    TrendingUp,
    Activity,
    Plus,
    ArrowUpRight,
    Search,
    Bell
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"

export default function PlatformDashboard() {
    const [stats, setStats] = useState({
        totalCompanies: 24,
        totalEmployees: 1240,
        monthlyRevenue: 125000000,
        activeSubscribers: 18
    })
    const [loading, setLoading] = useState(false)

    const recentCompanies = [
        { id: "1", name: "PT Teknologi Muda", owner: "Andi Wijaya", plan: "Enterprise", status: "Active", joined: "2026-01-10" },
        { id: "2", name: "CV Maju Jaya", owner: "Budi Santoso", plan: "Basic", status: "Pending", joined: "2026-01-12" },
        { id: "3", name: "Global Inovasi", owner: "Siska Putri", plan: "Pro", status: "Active", joined: "2026-01-08" },
        { id: "4", name: "Astra International", owner: "Dedi Kurniawan", plan: "Enterprise", status: "Active", joined: "2026-01-05" },
    ]

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Overview</h1>
                    <p className="text-muted-foreground mt-1">Super Admin control center for Humana SaaS.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button className="bg-[#0C212F] hover:bg-[#0C212F]/90">
                        <Plus className="mr-2 h-4 w-4" /> New Company
                    </Button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Companies" value={stats.totalCompanies.toString()} icon={Building2} trend="+2 new this week" />
                <StatsCard title="Total Users" value={stats.totalEmployees.toString()} icon={Users} trend="+124 this month" />
                <StatsCard title="Monthly Revenue" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.monthlyRevenue)} icon={CreditCard} trend="+15.2% vs last month" />
                <StatsCard title="Active Subs" value={stats.activeSubscribers.toString()} icon={Activity} trend="75% conversion rate" />
            </div>

            {/* Recent Companies Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Companies */}
                <Card className="xl:col-span-2 border-none shadow-sm ring-1 ring-gray-200">
                    <CardHeader>
                        <CardTitle>Recent Companies</CardTitle>
                        <CardDescription>Latest company registrations on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentCompanies.map((company) => (
                                    <TableRow key={company.id}>
                                        <TableCell className="font-medium text-gray-900">{company.name}</TableCell>
                                        <TableCell>{company.owner}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{company.plan}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={company.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>
                                                {company.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Subscription Distribution */}
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardHeader>
                        <CardTitle>Plans Distribution</CardTitle>
                        <CardDescription>Revenue by subscription tier.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <PlanItem label="Enterprise" value={45} color="bg-indigo-600" />
                        <PlanItem label="Pro Plan" value={35} color="bg-emerald-500" />
                        <PlanItem label="Basic Plan" value={20} color="bg-amber-500" />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

function StatsCard({ title, value, icon: Icon, trend }: any) {
    return (
        <Card className="border-none shadow-sm ring-1 ring-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
            </CardContent>
        </Card>
    )
}

function PlanItem({ label, value, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="text-muted-foreground">{value}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className={`${color} h-full rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    )
}
