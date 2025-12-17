"use client";

import { useState } from "react";
import { Search, Upload, UserPlus, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import { employees } from "../utils/mockData";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const departments = ["All", ...new Set(employees.map((e) => e.department))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-none shadow-sm ring-1 ring-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`whitespace-nowrap ${selectedDepartment === dept
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "text-slate-600 border-slate-200"
                    }`}
                  size="sm"
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="group hover:shadow-md transition-all duration-200 border-none shadow-sm ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 ring-4 ring-slate-50 mb-4">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback className="text-lg bg-indigo-100 text-indigo-700 font-medium">
                    {employee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 truncate max-w-[200px]">{employee.name}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">{employee.position}</p>
                </div>

                <Badge variant="secondary" className="mt-3 bg-slate-100 text-slate-700 hover:bg-slate-200">
                  {employee.department}
                </Badge>

                <div className="w-full mt-6 space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate text-left bg-slate-50 p-2 rounded-md">
                    {employee.email}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </span>
                    <span className="text-gray-900">{employee.phone}</span>
                  </div>
                </div>

                <div className="w-full mt-6">
                  <Button variant="outline" className="w-full border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="border-dashed shadow-none bg-transparent">
          <CardContent className="p-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query.</p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
