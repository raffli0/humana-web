"use client";

import { useState } from "react";
import { FileText, Search, DollarSign, TrendingUp, Users, Download, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";

// Mock Data for Payroll
const payrollData = [
    { id: "PY-001", employee: "Alice Johnson", role: "Software Engineer", salary: "$4,500", status: "Paid", date: "Oct 25, 2023", method: "Bank Transfer" },
    { id: "PY-002", employee: "Bob Smith", role: "Product Manager", salary: "$5,200", status: "Paid", date: "Oct 25, 2023", method: "Bank Transfer" },
    { id: "PY-003", employee: "Charlie Brown", role: "Designer", salary: "$3,800", status: "Processing", date: "Oct 25, 2023", method: "Bank Transfer" },
    { id: "PY-004", employee: "Diana Prince", role: "HR Specialist", salary: "$3,500", status: "Pending", date: "Oct 25, 2023", method: "Check" },
    { id: "PY-005", employee: "Evan Wright", role: "Developer", salary: "$4,200", status: "Paid", date: "Oct 25, 2023", method: "Bank Transfer" },
    { id: "PY-006", employee: "Fiona Gallagher", role: "Support", salary: "$3,000", status: "Failed", date: "Oct 25, 2023", method: "Bank Transfer" },
];

export default function Payroll() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const statuses = ["All", "Paid", "Pending", "Processing", "Failed"];

    const filteredPayroll = payrollData.filter((item) => {
        const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

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

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payroll</h1>
                    <p className="text-muted-foreground mt-1">Manage employee salaries and payment history.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                        <DollarSign className="h-4 w-4" /> Run Payroll
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Payroll</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">$24,200</p>
                            </div>
                            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span className="font-medium">+2.5%</span>
                            <span className="text-muted-foreground ml-1">from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Employees Paid</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">128</p>
                            </div>
                            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span className="font-medium">98%</span>
                            <span className="text-muted-foreground ml-1">success rate</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-orange-600 mt-1">$3,500</p>
                            </div>
                            <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                            2 transactions pending
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Salary</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">$4,033</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span className="font-medium">+1.2%</span>
                            <span className="text-muted-foreground ml-1">inc. bonus</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="pb-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>Recent transactions and salary disbursements.</CardDescription>
                    </div>
                    <div className="flex gap-3 flex-col sm:flex-row">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employee..."
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
                                <TableHead>Employee</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayroll.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://ui-avatars.com/api/?name=${item.employee}`} />
                                                <AvatarFallback>{item.employee.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-900">{item.employee}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500">{item.role}</TableCell>
                                    <TableCell className="text-gray-500">{item.date}</TableCell>
                                    <TableCell className="text-gray-500">{item.method}</TableCell>
                                    <TableCell className="font-medium text-gray-900">{item.salary}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(item.status)}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <FileText className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredPayroll.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}
