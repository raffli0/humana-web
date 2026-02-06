"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Mail, Phone, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Input } from "../../../../../components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../components/ui/select";
import { useRecruitmentViewModel } from "@/src/presentation/hooks/useRecruitmentViewModel";

export default function Applicants() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const { jobPosts, candidates, loading, updateStatus } = useRecruitmentViewModel();
    const [job, setJob] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState("");

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
    const statuses = ["All", "Applied", "Reviewing", "Shortlisted", "Rejected", "Hired"];

    const filteredCandidates = jobCandidates.filter(candidate => {
        const matchesSearch =
            candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || candidate.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleUpdateStatus = async () => {
        if (!selectedCandidate || !newStatus) return;

        try {
            await updateStatus(selectedCandidate.id, newStatus);
            setIsStatusDialogOpen(false);
            setSelectedCandidate(null);
            setNewStatus("");
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Applied": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "Reviewing": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
            case "Shortlisted": return "bg-purple-100 text-purple-700 hover:bg-purple-200";
            case "Hired": return "bg-green-100 text-green-700 hover:bg-green-200";
            case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-200";
            default: return "bg-gray-100 text-gray-700 hover:bg-gray-200";
        }
    };

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/company/recruitment/${jobId}`)}
                    className="rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pelamar</h1>
                    <p className="text-muted-foreground mt-1">{job.title} - {jobCandidates.length} total pelamar</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Cari berdasarkan nama atau email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
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

            {/* Applicants List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredCandidates.map((candidate) => (
                    <Card key={candidate.id} className="border-none shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{candidate.full_name}</h3>
                                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{candidate.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{candidate.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Melamar {new Date(candidate.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(candidate.status)}>
                                            {candidate.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {candidate.resume_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (candidate.resume_url) {
                                                    window.open(candidate.resume_url, '_blank');
                                                }
                                            }}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Resume
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-none"
                                        onClick={() => {
                                            setSelectedCandidate(candidate);
                                            setNewStatus(candidate.status);
                                            setIsStatusDialogOpen(true);
                                        }}
                                    >
                                        Update Status
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCandidates.length === 0 && (
                <Card className="border-dashed shadow-none bg-transparent">
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-500">Tidak ada pelamar ditemukan.</p>
                    </CardContent>
                </Card>
            )}

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Status Lamaran</DialogTitle>
                        <DialogDescription>
                            Ubah status untuk {selectedCandidate?.full_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Applied">Melamar</SelectItem>
                                <SelectItem value="Reviewing">Sedang Ditinjau</SelectItem>
                                <SelectItem value="Shortlisted">Daftar Pendek</SelectItem>
                                <SelectItem value="Rejected">Ditolak</SelectItem>
                                <SelectItem value="Hired">Diterima</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleUpdateStatus}>
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
