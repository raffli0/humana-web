"use client"

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MapPin, Clock, Search, Download, Settings, ChevronDown, CheckCircle2, AlertCircle, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import AttendanceMap, { AttendanceRecord } from "../attendance/AttendanceMap";
import { cn } from "@/lib/utils";
import { supabase } from "../utils/supabase/client";

export default function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  useEffect(() => {
    async function fetchAttendance() {
      if (!formattedDate) return;

      setLoading(true);
      const { data } = await supabase
        .from('attendance')
        .select('*, employees(name, avatar, department)')
        .eq('date', formattedDate);

      if (data) {
        // Transform data to match AttendanceRecord interface
        const transformedData = data.map((record: any) => ({
          ...record,
          employeeName: record.employees?.name || record.employee_name || "Unknown",
          checkIn: record.check_in,
          checkOut: record.check_out,
          employeeId: record.employee_id,
        }));
        setAttendanceData(transformedData);

        if (transformedData.length > 0 && !selectedAttendance) {
          // Optional: select first record by default or leave null
        }
      }
      setLoading(false);
    }
    fetchAttendance();
  }, [formattedDate]);

  const stats = {
    present: attendanceData.filter(a => a.status === "Present").length,
    late: attendanceData.filter(a => a.status === "Late").length,
    absent: attendanceData.filter(a => a.status === "Absent").length,
    total: attendanceData.length
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Present":
        return { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 };
      case "Late":
        return { color: "text-amber-700 bg-amber-50 border-amber-200", icon: AlertCircle };
      case "Absent":
        return { color: "text-rose-700 bg-rose-50 border-rose-200", icon: XCircle };
      default:
        return { color: "text-slate-700 bg-slate-50 border-slate-200", icon: AlertCircle };
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Attendance</h1>
          <p className="text-muted-foreground mt-1">Monitor real-time employee attendance and location.</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePicker date={date} setDate={setDate} />
          <Button variant="outline" size="icon" className="bg-white">
            <Download className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white">
            <Settings className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm ring-1 ring-gray-200 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Present</span>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +4.2%
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.present}</span>
              <span className="text-sm text-gray-500">/ {stats.total} total</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${stats.total ? (stats.present / stats.total) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-gray-200 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Late Arrivals</span>
              <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <ArrowDownRight className="h-3 w-3 mr-1" /> -1.2%
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.late}</span>
              <span className="text-sm text-gray-500">employees</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${stats.total ? (stats.late / stats.total) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-gray-200 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Absent</span>
              <span className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +2.1%
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.absent}</span>
              <span className="text-sm text-gray-500">employees</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${stats.total ? (stats.absent / stats.total) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-gray-200 bg-indigo-50/50">
          <CardContent className="p-5 flex flex-col justify-center h-full">
            <span className="text-sm font-medium text-indigo-600/70 uppercase tracking-wider">Attendance Rate</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-indigo-700">
                {stats.total ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-indigo-600/60 mt-2">Based on checked-in employees today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-18rem)] min-h-[500px]">
        {/* Attendance List */}
        <Card className="xl:col-span-1 border-none shadow-sm ring-1 ring-gray-200 flex flex-col overflow-hidden h-full">
          <CardHeader className="pb-4 border-b border-gray-100 py-3 px-4 shrink-0 bg-white z-10">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-base font-semibold">Employee List</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
                    All Departments <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Engineering</DropdownMenuItem>
                  <DropdownMenuItem>Design</DropdownMenuItem>
                  <DropdownMenuItem>Marketing</DropdownMenuItem>
                  <DropdownMenuItem>HR</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                className="pl-9 h-9 text-sm bg-slate-50 border-slate-200"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0 bg-white">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {attendanceData.map((record) => {
                  const employeeName = record.employees?.name || record.employeeName || "Unknown";
                  const employeeAvatar = record.employees?.avatar;
                  const employeeDept = record.employees?.department || "General";

                  const isSelected = selectedAttendance?.id === record.id;
                  const statusConfig = getStatusConfig(record.status);
                  const StatusIcon = statusConfig.icon;

                  // Construct record for map compatibility if needed
                  const mapRecord = {
                    ...record,
                    employeeName,
                    location: record.location // Ensure location structure matches
                  };

                  return (
                    <div
                      key={record.id}
                      onClick={() => setSelectedAttendance(mapRecord)}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:bg-slate-50 group border-l-4",
                        isSelected
                          ? "bg-indigo-50/40 border-indigo-500"
                          : "border-transparent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 border border-gray-100 shadow-sm mt-0.5">
                            <AvatarImage src={employeeAvatar} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-slate-100 text-indigo-700 font-medium text-xs">
                              {employeeName.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={cn(
                              "text-sm font-semibold leading-none group-hover:text-indigo-700 transition-colors",
                              isSelected ? "text-indigo-900" : "text-gray-900"
                            )}>
                              {employeeName}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Badge variant="secondary" className="text-[10px] font-normal h-4 px-1.5 bg-slate-100 text-slate-500">
                                {employeeDept}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1 shadow-sm", statusConfig.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {record.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 mt-4 gap-2">
                        <div className="bg-slate-50 rounded-md p-2 border border-slate-100">
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                            <Clock className="w-3 h-3 text-indigo-400" /> Check In
                          </div>
                          <div className="font-mono text-sm font-medium text-gray-700 pl-4.5">
                            {record.checkIn || "--:--"}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-md p-2 border border-slate-100">
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                            <Clock className="w-3 h-3 text-orange-400" /> Check Out
                          </div>
                          <div className="font-mono text-sm font-medium text-gray-700 pl-4.5">
                            {record.checkOut || "--:--"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {attendanceData.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                    <div className="bg-slate-50 p-3 rounded-full mb-3">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No records found</p>
                    <p className="text-xs text-muted-foreground mt-1">Select a different date to view attendance.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card className="xl:col-span-2 border-none shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col h-full bg-white">
          <CardHeader className="py-3 px-4 border-b border-gray-100 bg-white shrink-0 z-10 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-50 p-1.5 rounded-md">
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-gray-900">
                  {selectedAttendance ? `${selectedAttendance.employeeName}'s Location` : "Employee Locations"}
                </CardTitle>
              </div>
            </div>
            {selectedAttendance?.location && (
              <Badge variant="outline" className="text-xs font-normal bg-slate-50">
                Live Update
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-0 relative bg-slate-50">
            <AttendanceMap
              attendance={attendanceData}
              selectedAttendance={selectedAttendance}
              onSelectAttendance={setSelectedAttendance}
            />
            {selectedAttendance?.location && (
              <div className="absolute top-4 left-4 z-[500] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200/50 text-sm max-w-[280px] animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 border border-gray-100">
                    <AvatarImage src={selectedAttendance.employees?.avatar} />
                    <AvatarFallback>{selectedAttendance.employeeName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 line-clamp-1">{selectedAttendance.location.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="h-5 text-[10px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-default px-1.5 rounded-md">
                        Checked In: {selectedAttendance.checkIn}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
