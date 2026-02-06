"use client";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import { FileText, Search, DollarSign, TrendingUp, Users, Download, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { authService } from "@/src/infrastructure/auth/authService";
import { exportToCsv } from "@/src/lib/export";
import { usePayrollViewModel } from "@/src/presentation/hooks/usePayrollViewModel";
import { Payslip } from "@/src/domain/payroll/payroll";
import { EditPayslipDialog } from "@/app/components/payroll/EditPayslipDialog";

export default function Payroll() {
    const {
        payslips: payrollData,
        loading,
        calculateSummary,
        refresh,
        generatePayroll,
        isSubmitting,
        updateStatus,
        updateData
    } = usePayrollViewModel();

    const handleEditClick = (payslip: Payslip) => {
        setEditingPayslip(payslip);
        setIsEditDialogOpen(true);
    };

    const handleSavePayslip = async (id: string, data: Partial<Payslip>) => {
        await updateData(id, data);
        setIsEditDialogOpen(false);
    };

    const summary = calculateSummary();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [editingPayslip, setEditingPayslip] = useState<Payslip | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const statuses = ["All", "Draft", "Paid", "Pending", "Processing", "Failed"];

    const filteredPayroll = payrollData.filter((item) => {
        const matchesSearch =
            (item.employees?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.employees?.position || "").toLowerCase().includes(searchQuery.toLowerCase());

        const activeFilter = filterStatus;
        const matchesStatus = filterStatus === "All" || item.status === activeFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPayroll = summary.net_payout;
    const paidCount = payrollData.filter(i => i.status === "Paid").length;
    const paidRate = payrollData.length ? Math.round((paidCount / payrollData.length) * 100) : 0;
    const pendingAmount = payrollData
        .filter(i => i.status === "Pending" || i.status === "Processing" || i.status === "Draft")
        .reduce((sum, item) => sum + (item.net_salary || 0), 0);
    const pendingCount = payrollData.filter(i => i.status === "Pending" || i.status === "Processing" || i.status === "Draft").length;
    const avgSalary = payrollData.length ? Math.round(totalPayroll / payrollData.length) : 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
            case "Pending":
                return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
            case "Processing":
                return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
            case "Failed":
                return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleExportPayroll = () => {
        const data = filteredPayroll.map(p => ({
            PeriodStart: new Date(p.period_start).toLocaleDateString(),
            PeriodEnd: new Date(p.period_end).toLocaleDateString(),
            Employee: p.employees?.name || 'Unknown',
            Position: p.employees?.position || '-',
            BasicSalary: p.basic_salary,
            TotalAllowances: p.allowances,
            TotalDeductions: p.deductions,
            NetSalary: p.net_salary,
            Status: p.status
        }));
        exportToCsv(`humana_payroll_${new Date().toISOString().split('T')[0]}.csv`, data);
    };

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Penggajian</h1>
                    <p className="text-muted-foreground mt-1">Kelola gaji dan riwayat pembayaran karyawan.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExportPayroll} disabled={loading || filteredPayroll.length === 0}>
                        <Download className="h-4 w-4" /> Ekspor Laporan
                    </Button>
                    <Button
                        onClick={generatePayroll}
                        disabled={isSubmitting}
                        className="rounded-full bg-blue-900 hover:bg-blue-800 text-white cursor-pointer"
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                            <DollarSign className="h-4 w-4 mr-2" />
                        )}
                        Jalankan Penggajian
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-md ring-1 ring-indigo-100 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Gaji</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{formatCurrency(totalPayroll)}</p>
                            </div>
                            <div className="h-12 w-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center shadow-sm">
                                <DollarSign className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+2.5%</span>
                            <span className="text-green-600/80 ml-1">vs bulan lalu</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Karyawan Dibayar</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{paidCount}</p>
                            </div>
                            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span className="font-medium">{paidRate}%</span>
                            <span className="text-muted-foreground ml-1">tingkat sukses</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-amber-200 bg-amber-50/30">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-800">Menunggu Pembayaran</p>
                                <p className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(pendingAmount)}</p>
                            </div>
                            <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-medium text-amber-800 bg-amber-100/50 w-fit px-2 py-1 rounded-full flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {pendingCount} transaksi perlu tindakan
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Rata-rata Gaji</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(avgSalary)}</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span className="font-medium">+1.2%</span>
                            <span className="text-muted-foreground ml-1">trmsk. bonus</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="pb-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle>Riwayat Pembayaran</CardTitle>
                        <CardDescription>Transaksi terbaru dan pencairan gaji.</CardDescription>
                    </div>
                    <div className="flex gap-3 flex-col sm:flex-row">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari karyawan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-[250px] bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {statuses.map((status) => (
                                <Button
                                    key={status}
                                    variant={filterStatus === status ? "default" : "outline"}
                                    onClick={() => setFilterStatus(status)}
                                    size="sm"
                                    className={filterStatus === status ? "bg-slate-900 border-slate-900 text-white" : "text-slate-600 border-slate-200"}
                                >
                                    {status === "All" ? "Semua" :
                                        status === "Draft" ? "Draft" :
                                            status === "Paid" ? "Dibayar" :
                                                status === "Pending" ? "Menunggu" :
                                                    status === "Processing" ? "Diproses" :
                                                        status === "Failed" ? "Gagal" : status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                    <TableHead>Karyawan</TableHead>
                                    <TableHead>Peran</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Metode</TableHead>
                                    <TableHead className="text-right">Jumlah</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayroll.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 overflow-hidden">
                                                    {item.employees?.avatar ? (
                                                        <NextImage
                                                            src={item.employees.avatar}
                                                            alt={item.employees.name || "Employee"}
                                                            width={32}
                                                            height={32}
                                                            className="aspect-square size-full object-cover"
                                                        />
                                                    ) : (
                                                        <AvatarFallback>{(item.employees?.name || "U").charAt(0)}</AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <span className="font-medium text-gray-900">{item.employees?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500">{item.employees?.position}</TableCell>
                                        <TableCell className="text-gray-500">{new Date(item.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                                        <TableCell className="text-gray-500">Transfer Bank</TableCell>
                                        <TableCell className="font-medium text-gray-900 text-right font-mono">{formatCurrency(item.net_salary)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(item.status)}>
                                                {item.status === "Paid" ? "Dibayar" :
                                                    item.status === "Pending" ? "Menunggu" :
                                                        item.status === "Processing" ? "Diproses" :
                                                            item.status === "Draft" ? "Draft" : "Gagal"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => updateStatus(item.id!, 'Paid')}
                                                        disabled={item.status === 'Paid'}
                                                        className="text-green-600 focus:text-green-700 font-medium"
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Tandai Dibayar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => updateStatus(item.id!, 'Processing')}
                                                        disabled={item.status === 'Processing'}
                                                        className="text-blue-600 focus:text-blue-700"
                                                    >
                                                        <RefreshCw className="mr-2 h-4 w-4" /> Diproses
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => updateStatus(item.id!, 'Pending')}
                                                        disabled={item.status === 'Pending'}
                                                        className="text-orange-600 focus:text-orange-700"
                                                    >
                                                        <Clock className="mr-2 h-4 w-4" /> Ditunda
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => updateStatus(item.id!, 'Cancelled')}
                                                        disabled={item.status === 'Cancelled'}
                                                        className="text-red-600 focus:text-red-700"
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" /> Batalkan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditClick(item)}
                                                        disabled={item.status === 'Paid'}
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" /> Edit Rincian
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredPayroll.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <EditPayslipDialog
                payslip={editingPayslip}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={handleSavePayslip}
            />
        </main>
    );
}
