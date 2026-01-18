"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
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

import { supabase } from "../../../../src/infrastructure/supabase/client";

const payrollData = [
  { month: "Jan", gross: 26000000, tax: 4000000, net: 22000000 },
  { month: "Feb", gross: 30000000, tax: 5000000, net: 25000000 },
  { month: "Mar", gross: 42000000, tax: 7000000, net: 35000000 },
  { month: "Apr", gross: 52000000, tax: 9000000, net: 43000000 },
  { month: "May", gross: 48000000, tax: 8000000, net: 40000000 },
  { month: "Jun", gross: 45000000, tax: 7500000, net: 37500000 },
  { month: "Jul", gross: 50000000, tax: 8200000, net: 41800000 },
  { month: "Aug", gross: 53000000, tax: 8600000, net: 44400000 },
];

const departmentStats = [
  { name: "Engineering", count: 12, total: 20, color: "bg-blue-500" },
  { name: "Marketing", count: 8, total: 15, color: "bg-purple-500" },
  { name: "HR", count: 3, total: 5, color: "bg-pink-500" },
  { name: "Sales", count: 15, total: 25, color: "bg-emerald-500" },
];

export default function Dashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) setProfile(profileData);
      }

      // Fetch Employees
      const { data: employeesData } = await supabase.from('employees').select('*');
      if (employeesData) setEmployees(employeesData);

      // Fetch Attendance (for today)
      // Use local date to match Attendance page logic (client timezone)
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*, employees(name, avatar)')
        .eq('date', today);
      if (attendanceData) setAttendance(attendanceData);

      // Fetch pending leave requests
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('*, employees(name, avatar)')
        .order('request_date', { ascending: false });
      if (leaveData) setLeaveRequests(leaveData);

      // Fetch recruitments
      const { data: recruitmentData } = await supabase.from('recruitments').select('*');
      if (recruitmentData) setRecruitments(recruitmentData);

      setLoading(false);
    }

    fetchData();
  }, []);

  const presentToday = attendance.filter(
    (a) => a.status === "Present" || a.status === "Late"
  ).length;

  const pendingLeaves = leaveRequests.filter(
    (lr) => lr.status === "Pending"
  ).length;

  const openPositions = recruitments.filter((r) => r.status === "Open").length;

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Hello, {profile?.full_name || profile?.email?.split('@')[0] || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, here&apos;s your company overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full">
            <Search className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-4 w-4 text-gray-500" />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
          <Button className="rounded-full bg-blue-900 hover:bg-blue-800 text-white cursor-pointer">
            <CalendarIcon className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Employees"
              value={employees.length.toString()}
              change="+12% from last month"
              icon={Users}
              trend="up"
            />
            <StatsCard
              title="Present Today"
              value={presentToday.toString()}
              change={`${employees.length > 0 ? ((presentToday / employees.length) * 100).toFixed(0) : 0}% attendance rate`}
              icon={Activity}
              trend="neutral"
            />
            <StatsCard
              title="Pending Leaves"
              value={pendingLeaves.toString()}
              change={`${pendingLeaves} requests waiting`}
              icon={FileText}
              trend="down"
            />
            <StatsCard
              title="Open Positions"
              value={openPositions.toString()}
              change="Hiring is active"
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
                    <CardTitle className="text-lg font-semibold">Payroll Analytics</CardTitle>
                    <CardDescription>Monthly gross vs net salary distribution</CardDescription>
                  </div>
                  <Tabs defaultValue="year" className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="h-[350px] pl-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={payrollData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
                    <CardDescription>Review and manage employee time off</CardDescription>
                  </div>
                  <Button variant="ghost" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer" onClick={() => { }}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
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
                          <TableCell>{leave.days} days</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${leave.status === "Approved"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : leave.status === "Pending"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                                }`}
                            >
                              {leave.status}
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
                    Department Capacity
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
              <Card className="border-none shadow-sm ring-1 ring-gray-200 bg-[#0C212F] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5 opacity-80" />
                    Payment Status
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Next payroll disbursement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">Rp 124.500.999</div>
                    <div className="text-indigo-100 text-sm mt-1">Scheduled for Feb 25, 2026</div>
                  </div>
                  <Separator className="my-6 bg-white/20" />
                  <div className="flex justify-between items-center text-sm">
                    <span>Processing</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <Progress value={68} className="h-1.5 mt-2 bg-indigo-900/30" indicatorClassName="bg-white" />
                </CardContent>
              </Card>

              {/* Activity / Notifications Generic */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Today&apos;s Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">New employee onboarding</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Sarah Johnson joined the Design team</p>
                        <p className="text-[10px] text-gray-400 mt-2">2 hours ago</p>
                      </div>
                    </div>
                  ))}
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
}

function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
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
