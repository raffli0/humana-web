"use client";

import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function Payroll() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const statuses = ["All", "Pending", "Paid", "Failed"];

    // const filteredRequests = .filter(request => {
    //     const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         request.type.toLowerCase().includes(searchQuery.toLowerCase());
    //     const matchesStatus = filterStatus === "All" || request.status === filterStatus;
    //     return matchesSearch && matchesStatus;
    // });

    return (
        <main className="min-h-screen overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Payroll Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage employee salaries, allowances, and deductions
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="">Total Payroll</p>
                                <p>{ }</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="">Total Payroll</p>
                                <p>{ }</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="">Total Payroll</p>
                                <p>{ }</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="">Total Payroll</p>
                                <p>{ }</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by employee name or leave type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="
                                pl-10
                                border-slate-300    
                                shadow-sm
                                transition-all duration-200 ease-out
                                focus-visible:outline-none
                                focus-visible:border-slate-500
                                focus-visible:ring-2
                                focus-visible:ring-slate-500/20
                                bg-[#f7f8fa]
                                "
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
