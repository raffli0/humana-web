"use client";

import { useState, useEffect } from "react";
import { Search, Plus, FileText, Check, X, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import { supabase } from "../../utils/supabase/client";

export default function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('*, employees(name, avatar)')
        .order('request_date', { ascending: false });
      if (leaveData) setLeaveRequests(leaveData);

      const { data: employeesData } = await supabase.from('employees').select('*');
      if (employeesData) setEmployees(employeesData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const statuses = ["All", "Pending", "Approved", "Rejected"];

  const filteredRequests = leaveRequests.filter((request) => {
    const employeeName = request.employees?.name || request.employee_name || "";
    const matchesSearch =
      employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "Pending":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
      case "Rejected":
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const pendingCount = leaveRequests.filter((r) => r.status === "Pending").length;
  const approvedCount = leaveRequests.filter((r) => r.status === "Approved").length;
  const rejectedCount = leaveRequests.filter((r) => r.status === "Rejected").length;

  const getEmployee = (id: string) => {
    return employees.find((e) => e.id === id);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leave Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage employee leave requests.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{leaveRequests.length}</p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{pendingCount}</p>
                </div>
                <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{approvedCount}</p>
                </div>
                <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{rejectedCount}</p>
                </div>
                <div className="h-10 w-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                  <X className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <Card className="border-none shadow-sm ring-1 ring-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100 space-y-4 md:space-y-0 md:flex md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Requests</CardTitle>
                <CardDescription>A list of all leave requests and their status.</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-[250px] bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="flex gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      onClick={() => setFilterStatus(status)}
                      size="sm"
                      className={filterStatus === status ? "bg-slate-900 border-slate-900 text-white" : "text-slate-600 border-slate-200"}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-[300px]">Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    // eslint-disable-next-line
                    const employee = request.employees || getEmployee(request.employee_id);
                    const empName = employee?.name || request.employee_name || "Unknown";
                    const empAvatar = employee?.avatar;

                    return (
                      <TableRow key={request.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={empAvatar} />
                              <AvatarFallback>{empName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{empName}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{request.reason}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal bg-slate-50">
                            {request.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {request.days} days
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-xs text-gray-500">
                            <span className="font-medium text-gray-700">{request.start_date || request.startDate}</span>
                            <span>to {request.end_date || request.endDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  <span className="sr-only">View Detail</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Leave Request Details</DialogTitle>
                                  <DialogDescription>
                                    Details for {empName}&apos;s request.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-muted-foreground">Type</span>
                                    <span className="col-span-3 font-medium">{request.type}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-muted-foreground">Duration</span>
                                    <span className="col-span-3">{request.days} days ({request.start_date || request.startDate} - {request.end_date || request.endDate})</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-muted-foreground">Reason</span>
                                    <span className="col-span-3 text-sm">{request.reason}</span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-muted-foreground">Status</span>
                                    <span className="col-span-3">
                                      <Badge className={getStatusColor(request.status)}>
                                        {request.status}
                                      </Badge>
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium text-muted-foreground">Requested</span>
                                    <span className="col-span-3 text-sm text-gray-500">{request.request_date || request.requestDate}</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {request.status === "Pending" ? (
                              <>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                                      Reject
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Reject Request?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will notify {empName} that their leave request has been rejected.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">Reject</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white">
                                      Approve
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Approve Request</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Approve {request.days} days of {request.type} for {empName}?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction className="bg-green-600 hover:bg-green-700">Approve</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" disabled>
                                Archived
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
