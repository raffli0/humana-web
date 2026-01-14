"use client"

import { useState, useEffect } from "react";
import { Search, Plus, MapPin, Briefcase, Users, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

import { supabase } from "../utils/supabase/client";

export default function Recruitment() {
    const [recruitments, setRecruitments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        async function fetchRecruitments() {
            setLoading(true);
            const { data } = await supabase.from('recruitments').select('*');
            if (data) setRecruitments(data);
            setLoading(false);
        }
        fetchRecruitments();
    }, []);

    const statuses = ["All", "Open", "Closed"];

    const filteredJobs = recruitments.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalApplicants = recruitments.reduce((sum, job) => sum + job.applicants, 0);
    const openPositions = recruitments.filter(j => j.status === "Open").length;
    const closedPositions = recruitments.filter(j => j.status === "Closed").length;

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recruitment</h1>
                    <p className="text-muted-foreground mt-1">Manage job postings and applicant tracking.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Post New Job
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{openPositions}</p>
                                </div>
                                <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalApplicants}</p>
                                </div>
                                <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                    <Users className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Closed Positions</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{closedPositions}</p>
                                </div>
                                <div className="h-10 w-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by job title or department..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    {statuses.map(status => (
                                        <Button
                                            key={status}
                                            variant={filterStatus === status ? "default" : "outline"}
                                            onClick={() => setFilterStatus(status)}
                                            size="sm"
                                            className={`whitespace-nowrap ${filterStatus === status ? "bg-slate-900 text-white" : "text-slate-600 border-slate-200"}`}
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Listings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredJobs.map((job) => (
                            <Card key={job.id} className="group hover:shadow-md transition-all duration-200 border-none shadow-sm ring-1 ring-gray-200">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {job.title}
                                                </CardTitle>
                                                <Badge variant={job.status === "Open" ? "default" : "secondary"} className={job.status === "Open" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}>
                                                    {job.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium">{job.department}</p>
                                        </div>
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-slate-100 text-slate-500 font-semibold">
                                                {job.title.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

                                    <div className="flex flex-wrap gap-4 text-xs text-medium">
                                        <div className="flex items-center gap-1.5 text-gray-500 bg-slate-50 px-2.5 py-1.5 rounded-md">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-500 bg-slate-50 px-2.5 py-1.5 rounded-md">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{job.type}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-500 bg-slate-50 px-2.5 py-1.5 rounded-md">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Posted {job.posted}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(3, job.applicants))].map((_, i) => (
                                                    <div key={i} className="h-7 w-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                                                        ?
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium">{job.applicants} Applicants</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="h-8">Details</Button>
                                            {job.status === "Open" && (
                                                <Button size="sm" className="h-8 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-none">
                                                    View Applicants
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <Card className="border-dashed shadow-none bg-transparent">
                            <CardContent className="p-12 text-center">
                                <p className="text-gray-500">No job positions found.</p>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </main>
    );
}
