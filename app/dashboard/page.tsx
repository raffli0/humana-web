
"use client"

import { Users, ClipboardCheck, Briefcase, FileText, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { employees, attendance, leaveRequests, recruitments } from "../utils/mockData";
import { Button } from "../components/ui/button";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { Progress } from "../components/ui/progress";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../components/ui/badge";
import { AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";

const employeeBreakdown = [
    { label: "Others", value: 71, color: "#EAB308" }, // yellow
    { label: "Onboarding", value: 27, color: "#22C55E" }, // green
    { label: "Offboarding", value: 23, color: "#6366F1" }, // indigo
];

const payrollData = [
    { month: "Jan", gross: 26000, tax: 4000, net: 22000 },
    { month: "Feb", gross: 30000, tax: 5000, net: 25000 },
    { month: "Mar", gross: 42000, tax: 7000, net: 35000 },
    { month: "Apr", gross: 52000, tax: 9000, net: 43000 },
    { month: "May", gross: 48000, tax: 8000, net: 40000 },
    { month: "Jun", gross: 45000, tax: 7500, net: 37500 },
    { month: "Jul", gross: 50000, tax: 8200, net: 41800 },
    { month: "Aug", gross: 53000, tax: 8600, net: 44400 },
];

const paymentStatus = {
    totalEmployees: 121,
    paid: 68,
    pending: 17,
    unpaid: 15,
};

const latestPayments = [
    {
        name: "Amanda Sisy",
        role: "Project Manager",
        status: "PAID",
        amount: "$3,450",
        date: "11 Aug 2023",
    },
    {
        name: "Cooper Culhane",
        role: "UX Engineer",
        status: "PENDING",
        amount: "$2,320",
        date: "11 Aug 2023",
    },
    {
        name: "Gretchen Konter",
        role: "Lead UX Designer",
        status: "PAID",
        amount: "$3,870",
        date: "10 Aug 2023",
    },
];

export default function Dashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentToday = todayAttendance.filter(a => a.status === "Present" || a.status === "Late").length;
    const pendingLeaves = leaveRequests.filter(lr => lr.status === "Pending").length;
    const openPositions = recruitments.filter(r => r.status === "Open").length;
    const donutTotal = employeeBreakdown.reduce(
        (acc, cur) => acc + cur.value,
        0
    );

    const stats = [
        {
            title: "Total Employees",
            value: employees.length,
            icon: Users,
            change: "+2",
            changeType: "increase",
            color: "bg-blue-500"
        },
        {
            title: "Present Today",
            value: presentToday,
            icon: ClipboardCheck,
            change: `${((presentToday / employees.length) * 100).toFixed(0)}%`,
            changeType: "increase",
            color: "bg-green-500"
        },
        {
            title: "Pending Leaves",
            value: pendingLeaves,
            icon: FileText,
            change: "+3",
            changeType: "neutral",
            color: "bg-orange-500"
        },
        {
            title: "Open Positions",
            value: openPositions,
            icon: Briefcase,
            change: "-1",
            changeType: "decrease",
            color: "bg-purple-500"
        }
    ];

    const recentLeaves = leaveRequests.slice(0, 5);
    const departmentStats = [
        { name: "Engineering", count: 2, color: "bg-blue-500" },
        { name: "Marketing", count: 1, color: "bg-green-500" },
        { name: "HR", count: 1, color: "bg-orange-500" },
        { name: "Sales", count: 1, color: "bg-purple-500" },
        { name: "Finance", count: 1, color: "bg-pink-500" }
    ];

    return (
        <main className="min-h-screen overflow-y-auto p-6 space-y-6 bg-white text-gray-900">
            {/* greeting */}
            <section>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back, Pristia!
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Here is your company&apos;s payroll and employee overview
                    for this month.
                </p>
            </section>


            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
                {/* Payroll section */}
                <Card className="p-6 space-y-1 bg-[#f5f5f5] border border-gray-200 shadow-sm rounded-xl">
                    {/* Header payroll */}
                    <div>
                        <h2 className="text-sb font-semibold tracking-tight text-gray-900">
                            Payroll
                        </h2>
                        <p className="mt-1 text-xs text-gray-600">
                            This is your payroll summary report so far.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* grid left */}
                        {/* Nested card: Payroll Summary Chart */}
                        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-sm text-gray-900">
                                        Payroll Summary
                                    </CardTitle>
                                    <CardDescription className="text-xs text-gray-500">
                                        Gross salary, taxes and net salary overview
                                    </CardDescription>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 rounded-full border-gray-300 text-gray-700">
                                    2023
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                </Button>
                            </CardHeader>

                            <CardContent className="h-60 pt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={payrollData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: "#6b7280" }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: "#6b7280" }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#ffffff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: 11,
                                                color: "#111827",

                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="gross"
                                            stroke="#6366F1"
                                            strokeWidth={2.5}
                                            dot={{ r: 3 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="net"
                                            stroke="#F97316"
                                            strokeWidth={2.5}
                                            dot={{ r: 3 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Payment Status */}
                        <Card className="border border-gray-200 bg-white shadow-sm rounded-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-900">
                                    Payment Status
                                </CardTitle>
                                <CardDescription className="text-xs text-gray-600">
                                    {paymentStatus.totalEmployees} employees
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">

                                {/* Paid */}
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Successfully Paid</span>
                                    <span className="font-medium text-gray-900">
                                        {paymentStatus.paid}%
                                    </span>
                                </div>
                                <Progress value={paymentStatus.paid} className="h-1.5" />
                                {/* Pending */}
                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Pending</span>
                                    <span className="font-medium text-gray-900">
                                        {paymentStatus.pending}%
                                    </span>
                                </div>
                                <Progress
                                    value={paymentStatus.pending}
                                    className="h-1.5"
                                />
                                {/* Unpaid */}
                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Unpaid</span>
                                    <span className="font-medium text-gray-900">
                                        {paymentStatus.unpaid}%
                                    </span>
                                </div>
                                <Progress
                                    value={paymentStatus.unpaid}
                                    className="h-1.5"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </Card>

                {/* Main grid right */}
                <div className="space-y-6">

                    <Card className="p-6 space-y-1 bg-[#f5f5f5] border border-gray-200 shadow-sm rounded-xl">
                        {/* Header Overview */}
                        <div>
                            <h2 className="text-sm font-semibold tracking-tight text-gray-900">
                                Overview
                            </h2>
                            <p className="mt-1 text-xs text-gray-600">
                                It's all about employee.
                            </p>
                        </div>

                        {/* grid 2 kolom */}
                        <div className="space-y-6">
                            {/* Latest Payment */}
                            <Card className="border border-gray-200 bg-white shadow-sm rounded-lg">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-sm text-gray-900">
                                            Latest Payment
                                        </CardTitle>
                                        <CardDescription className="text-xs text-gray-600">
                                            Recent salary disbursement
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[11px] text-gray-500"
                                    >
                                        View all
                                    </Button>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    {latestPayments.map((p) => (
                                        <div
                                            key={p.name}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback>
                                                        {p.name
                                                            .split(" ")
                                                            .map((x) => x[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-gray-900">{p.name}</span>
                                                    <span className="text-[11px] text-gray-500">{p.role}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs font-semibold text-gray-900">
                                                    {p.amount}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`border-0 px-1.5 py-0 text-[10px] ${p.status === "PAID"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                            }`}
                                                    >
                                                        {p.status}
                                                    </Badge>
                                                    <span className="text-[10px] text-gray-500">
                                                        {p.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Payment report footer (optional simple row) */}
                            <Card className="border border-gray-200 bg-white shadow-sm rounded-lg">
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-sm text-gray-900">
                                        Payment Report
                                    </CardTitle>
                                    <CardDescription className="text-xs text-gray-600">
                                        11 Jan – 4 Apr 2023
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 text-[11px] text-gray-500">
                                        <span>Type</span>
                                        <span>Amount</span>
                                        <span>Status</span>
                                        <span className="text-right">Action</span>
                                    </div>

                                    <Separator className="my-2 bg-gray-200" />

                                    <div className="grid grid-cols-4 items-center text-xs">
                                        <span className="text-gray-700">lorem</span>
                                        <span className="text-gray-900">$1,200</span>
                                        <span className="text-emerald-600">Paid</span>
                                        <div className="text-right text-[11px] text-indigo-600 cursor-pointer">
                                            View detail
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card className="border-gray-200 shadow-sm" key={stat.title}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600">{stat.title}</p>
                                        <p className="text-gray-900 mt-2">{stat.value}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            {stat.changeType === "increase" ? (
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                            ) : stat.changeType === "decrease" ? (
                                                <TrendingDown className="w-4 h-4 text-red-600" />
                                            ) : null}
                                            <span className={`${stat.changeType === "increase" ? "text-green-600" :
                                                stat.changeType === "decrease" ? "text-red-600" :
                                                    "text-gray-600"
                                                }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leave Requests */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeaves.map((leave) => (
                                <div key={leave.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                        <div>
                                            <p className="text-gray-900">{leave.employeeName}</p>
                                            <p className="text-gray-600">{leave.type} - {leave.days} days</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full ${leave.status === "Approved" ? "bg-green-100 text-green-700" :
                                        leave.status === "Pending" ? "bg-orange-100 text-orange-700" :
                                            "bg-red-100 text-red-700"
                                        }`}>
                                        {leave.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Department Distribution */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Department Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {departmentStats.map((dept) => (
                                <div key={dept.name}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-700">{dept.name}</span>
                                        <span className="text-gray-900">{dept.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${dept.color} h-2 rounded-full`}
                                            style={{ width: `${(dept.count / employees.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Overview */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Today's Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-green-700">Present</p>
                            <p className="text-green-900 mt-1">
                                {todayAttendance.filter(a => a.status === "Present").length}
                            </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <p className="text-orange-700">Late</p>
                            <p className="text-orange-900 mt-1">
                                {todayAttendance.filter(a => a.status === "Late").length}
                            </p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-red-700">Absent</p>
                            <p className="text-red-900 mt-1">
                                {todayAttendance.filter(a => a.status === "Absent").length}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-700">On Leave</p>
                            <p className="text-blue-900 mt-1">0</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
