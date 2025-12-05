"use client"

import { useState } from "react";
import { Search, Plus, MapPin, Briefcase, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { recruitments } from "../utils/mockData";

export default function Recruitment() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const statuses = ["All", "Open", "Closed"];

    const filteredJobs = recruitments.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalApplicants = recruitments.reduce((sum, job) => sum + job.applicants, 0);
    const openPositions = recruitments.filter(j => j.status === "Open").length;

    return (
        <main className="min-h-screen overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-gray-900">Recruitment</h2>
                    <p className="text-gray-600">Manage job postings and applications</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Total Positions</p>
                                <p className="text-gray-900 mt-1">{recruitments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Open Positions</p>
                                <p className="text-gray-900 mt-1">{openPositions}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Total Applicants</p>
                                <p className="text-gray-900 mt-1">{totalApplicants}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
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
                                placeholder="Search job positions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            {statuses.map(status => (
                                <Button
                                    key={status}
                                    variant={filterStatus === status ? "default" : "outline"}
                                    onClick={() => setFilterStatus(status)}
                                    className={filterStatus === status ? "bg-blue-600" : ""}
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
                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-gray-900">{job.title}</CardTitle>
                                    <p className="text-gray-600 mt-1">{job.department}</p>
                                </div>
                                <Badge className={job.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                    {job.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">{job.description}</p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{job.type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Posted {job.posted}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600">Applicants</p>
                                        <p className="text-gray-900">{job.applicants}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline">View Details</Button>
                                        {job.status === "Open" && (
                                            <Button className="bg-blue-600 hover:bg-blue-700">
                                                View Applicants
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-600">No job positions found matching your criteria</p>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
