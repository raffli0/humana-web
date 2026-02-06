"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, Users, DollarSign, Edit, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { useRecruitmentViewModel } from "@/src/presentation/hooks/useRecruitmentViewModel";
import { EditJobDialog } from "../components/EditJobDialog";

export default function JobDetail() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const { jobPosts, candidates, loading, updateJobStatus, updateJobPost } = useRecruitmentViewModel();
    const [job, setJob] = useState<any>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        const foundJob = jobPosts.find(j => j.id === jobId);
        setJob(foundJob);
    }, [jobPosts, jobId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-gray-500">Lowongan tidak ditemukan</p>
                <Button onClick={() => router.push("/company/recruitment")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Rekrutmen
                </Button>
            </div>
        );
    }

    const jobCandidates = candidates.filter(c => c.job_id === jobId);
    const appliedCount = jobCandidates.filter(c => c.status === "Applied").length;
    const reviewingCount = jobCandidates.filter(c => c.status === "Reviewing").length;
    const shortlistedCount = jobCandidates.filter(c => c.status === "Shortlisted").length;
    const hiredCount = jobCandidates.filter(c => c.status === "Hired").length;

    const handleToggleStatus = async () => {
        const newStatus = job.status === "Open" ? "Closed" : "Open";
        await updateJobStatus(jobId, newStatus);
    };

    const handleEditJob = async (jobId: string, data: any) => {
        try {
            await updateJobPost(jobId, data);
            // Update local state
            setJob({ ...job, ...data });
        } catch (error) {
            console.error("Error updating job:", error);
            throw error;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/company/recruitment")}
                    className="rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{job.title}</h1>
                    <p className="text-muted-foreground mt-1">{job.department}</p>
                </div>
                <Badge variant={job.status === "Open" ? "default" : "secondary"} className={job.status === "Open" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}>
                    {job.status}
                </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Total Pelamar</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{jobCandidates.length}</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Sedang Ditinjau</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{reviewingCount}</p>
                            </div>
                            <div className="h-10 w-10 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Daftar Pendek</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{shortlistedCount}</p>
                            </div>
                            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Diterima</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{hiredCount}</p>
                            </div>
                            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Job Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Deskripsi Pekerjaan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                        </CardContent>
                    </Card>

                    {job.requirements && (
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardHeader>
                                <CardTitle>Persyaratan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Detail Pekerjaan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Lokasi:</span>
                                <span className="font-medium text-gray-900">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Tipe:</span>
                                <span className="font-medium text-gray-900">{job.type}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Rentang Gaji:</span>
                                <span className="font-medium text-gray-900">{job.salary_range || "Tidak ditentukan"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Diposting:</span>
                                <span className="font-medium text-gray-900">{new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Aksi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => router.push(`/company/recruitment/${jobId}/applicants`)}
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Lihat Pelamar ({jobCandidates.length})
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsEditDialogOpen(true)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Lowongan
                            </Button>
                            {job.status === "Open" ? (
                                <Button
                                    variant="outline"
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleToggleStatus}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Tutup Posisi
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={handleToggleStatus}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Buka Kembali Posisi
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Status Lamaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Melamar</span>
                                <span className="font-medium">{appliedCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Sedang Ditinjau</span>
                                <span className="font-medium">{reviewingCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Daftar Pendek</span>
                                <span className="font-medium">{shortlistedCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Diterima</span>
                                <span className="font-medium text-green-600">{hiredCount}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Job Dialog */}
            <EditJobDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                job={job}
                onSubmit={handleEditJob}
            />
        </main>
    );
}
