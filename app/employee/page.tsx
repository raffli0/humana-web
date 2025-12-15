"use client"

import { useState } from "react";
import { Search, Plus, Filter, Mail, Phone, Import } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { employees } from "../utils/mockData";
import { HoverEffect } from "../components/ui/card-hover-effect";

export default function Employees() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All");

    const departments = ["All", ...new Set(employees.map(e => e.department))];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === "All" || emp.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    return (
        <main className="min-h-screen overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                {/* Left: Title */}
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Employees</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your team members
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="
                        border-slate-300
                        text-slate-700
                        hover:bg-slate-100
                        hover:border-slate-400
                        cursor-pointer
                        transition-all duration-150
                        hover:-translate-y-px
                        active:translate-y-0">
                        <Import className="w-4 h-4 mr-2" />
                        Import Employee
                    </Button>


                    <Button className="
                        bg-blue-600 
                        hover:bg-blue-700 
                        text-white 
                        cursor-pointer 
                        transition-all duration-150
                        hover:-translate-y-px
                        active:translate-y-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </Button>
                </div>
            </div>


            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 border-slate-300">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, email, or ID..."
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
                            "
                            />

                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {departments.map(dept => (
                                <Button
                                    key={dept}
                                    variant={selectedDepartment === dept ? "default" : "outline"}
                                    onClick={() => setSelectedDepartment(dept)}
                                    className={
                                        selectedDepartment === dept
                                            ? "bg-blue-600 text-white border-blue-600 shadow-none cursor-pointer"
                                            : "border-slate-200 text-slate-700 hover:bg-slate-100 shadow-none cursor-pointer"
                                    }
                                >
                                    {dept}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                    <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <img
                                    src={employee.avatar}
                                    alt={employee.name}
                                    className="w-16 h-16 rounded-full bg-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-900 truncate">{employee.name}</h3>
                                    <p className="text-gray-600 truncate">{employee.position}</p>
                                    <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                        {employee.department}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{employee.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{employee.phone}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600">Employee ID</p>
                                    <p className="text-gray-900">{employee.id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Join Date</p>
                                    <p className="text-gray-900">{employee.joinDate}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    className="
                                    w-full
                                    cursor-pointer
                                    border-slate-300
                                    text-slate-700
                                    shadow-none
                                    transition-all duration-150
                                    hover:border-slate-400  
                                    hover:bg-blue-700
                                    hover:text-white
                                    hover:translate-y-px
                                    ">
                                    View Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-600">No employees found matching your criteria</p>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
