"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Activity,
  CreditCard,
  Calendar as CalendarIcon,
  Search,
  Bell,
  ChevronDown,
  LucideIcon
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { Separator } from "../../../components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { Skeleton } from "../../../components/ui/skeleton";
import { useDashboardViewModel } from "@/src/presentation/hooks/useDashboardViewModel";
import { exportToCsv } from "@/src/lib/export";

export default function Dashboard() {
  const {
    loading,
    profile,
    employees,
    attendance,
    leaveRequests,
    recruitments,
    payslips,
    presentToday,
    pendingLeaves,
    openPositions,
    payrollChartData,
    departmentStats,
    recentActivities,
    refresh
  } = useDashboardViewModel();

  const pendingAmount = payslips
    .filter(p => p.status !== 'Paid')
    .reduce((sum, p) => sum + (Number(p.net_salary) || 0), 0);

  const nextPaymentDate = payslips.length > 0
    ? new Date(payslips[0].period_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : "Belum dijadwalkan";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleExportReport = () => {
    const data = employees.map(emp => ({
      Name: emp.name,
      Email: emp.email,
      Position: emp.position || '-',
      Department: emp.department || '-',
      Status: emp.status,
      JoinDate: emp.join_date ? new Date(emp.join_date).toLocaleDateString() : '-',
    }));
    exportToCsv(`humana_employees_${new Date().toISOString().split('T')[0]}.csv`, data);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {loading ? (
              <Skeleton className="h-9 w-64 bg-slate-200" />
            ) : (
              profile?.companies?.name || "Perusahaan Saya"
            )}
          </h1>
          <div className="text-muted-foreground mt-1">
            {loading ? (
              <Skeleton className="h-5 w-96 mt-2 bg-slate-200" />
            ) : (
              `Halo ${profile?.full_name || "Pengguna"}, berikut ringkasan perusahaan Anda.`
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-4 w-4 text-gray-500" />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
          <Button
            className="rounded-full bg-blue-900 hover:bg-blue-800 text-white cursor-pointer"
            onClick={handleExportReport}
            disabled={loading || employees.length === 0}
          >
            <CalendarIcon className="mr-2 h-4 w-4" /> Unduh Laporan
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Menunggu Persetujuan"
              value={pendingLeaves.toString()}
              change={`${pendingLeaves} permintaan menunggu`}
              icon={FileText}
              trend="down"
              priority={true}
            />
            <StatsCard
              title="Total Karyawan"
              value={employees.length.toString()}
              change="+12% dari bulan lalu"
              icon={Users}
              trend="up"
            />
            <StatsCard
              title="Hadir Hari Ini"
              value={presentToday.toString()}
              change={`${employees.length > 0 ? ((presentToday / employees.length) * 100).toFixed(0) : 0}% tingkat kehadiran`}
              icon={Activity}
              trend="neutral"
            />
            <StatsCard
              title="Posisi Terbuka"
              value={openPositions.toString()}
              change="Perekrutan aktif"
              icon={Briefcase}
              trend="up"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column (Charts & Tables) */}
            <div className="xl:col-span-2 space-y-8">

              {/* Payroll Chart */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">Analisis Penggajian</CardTitle>
                    <CardDescription>Distribusi gaji kotor vs bersih bulanan</CardDescription>
                  </div>
                  <Tabs defaultValue="year" className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="month">Bulan</TabsTrigger>
                      <TabsTrigger value="year">Tahun</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="h-[350px] pl-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={payrollChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(value)}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      />
                      <Area type="monotone" dataKey="gross" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorGross)" />
                      <Area type="monotone" dataKey="net" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Leave Requests */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Permintaan Cuti Terbaru</CardTitle>
                    <CardDescription>Tinjau dan kelola cuti karyawan</CardDescription>
                  </div>
                  <Button variant="ghost" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer" onClick={() => { }}>
                    Lihat Semua
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Karyawan</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Durasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.slice(0, 5).map((leave) => (
                        <TableRow key={leave.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                  {/* @ts-ignore */}
                                  {(leave.employees?.name || leave.employee_name || "U").charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {/* @ts-ignore */}
                              {leave.employees?.name || leave.employee_name}
                            </div>
                          </TableCell>
                          <TableCell>{leave.type}</TableCell>
                          <TableCell className="text-muted-foreground">{leave.start_date || leave.startDate}</TableCell>
                          <TableCell>{leave.days} hari</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${leave.status === "Approved" || leave.status === "Disetujui"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : leave.status === "Pending" || leave.status === "Menunggu"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                                }`}
                            >
                              {leave.status === "Approved" ? "Disetujui" : leave.status === "Pending" ? "Menunggu" : leave.status === "Rejected" ? "Ditolak" : leave.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">More</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>

            {/* Right Column (Side Widgets) */}
            <div className="space-y-8">

              {/* Department Distribution */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Kapasitas Departemen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{dept.name}</span>
                        <span className="text-muted-foreground">{dept.count}/{dept.total}</span>
                      </div>
                      <Progress value={(dept.count / dept.total) * 100} className="h-2" indicatorClassName={dept.color} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Status */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <div className="bg-indigo-50 p-1.5 rounded-md">
                      <CreditCard className="h-4 w-4 text-indigo-600" />
                    </div>
                    Status Pembayaran
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Pembayaran gaji berikutnya
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</div>
                    <div className="text-gray-500 text-sm mt-1">Dijadwalkan: {nextPaymentDate}</div>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex justify-between items-center text-sm text-gray-900">
                    <span>Estimasi</span>
                    <span className="font-semibold">Bulan ini</span>
                  </div>
                  <Progress value={100} className="h-1.5 mt-2" indicatorClassName="bg-indigo-600" />
                </CardContent>
              </Card>

              {/* Activity / Notifications Generic */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Aktivitas Hari Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.length > 0 ? recentActivities.map((act) => (
                    <div key={act.id} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className={`h-2 w-2 mt-2 rounded-full ${act.color} shrink-0`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{act.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
                        <p className="text-[10px] text-gray-400 mt-2">{act.time}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-center text-muted-foreground py-4">Belum ada aktivitas hari ini.</p>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </>
      )}
    </main>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  priority?: boolean;
}

function StatsCard({ title, value, change, icon: Icon, trend, priority }: StatsCardProps) {
  return (
    <Card className={`border-none shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow ${priority ? 'bg-indigo-50/50 ring-indigo-200' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${priority ? 'text-indigo-900' : 'text-muted-foreground'}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${priority ? 'text-indigo-500' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1 text-xs">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
          {trend === "down" && <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />}
          <span className={trend === "up" ? "text-green-600 font-medium" : trend === "down" ? "text-red-600 font-medium" : "text-muted-foreground"}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
