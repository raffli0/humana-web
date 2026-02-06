"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { JobPost } from "@/src/domain/recruitment/recruitment";

interface EditJobDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    job: JobPost | null;
    onSubmit: (jobId: string, data: Partial<JobPost>) => Promise<void>;
}

export function EditJobDialog({ open, onOpenChange, job, onSubmit }: EditJobDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: "",
        department: "",
        location: "",
        type: "Full-time",
        salary_range: "",
        status: "Open"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || "",
                description: job.description || "",
                requirements: job.requirements || "",
                department: job.department || "",
                location: job.location || "",
                type: job.type || "Full-time",
                salary_range: job.salary_range || "",
                status: job.status || "Open"
            });
        }
    }, [job]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!job) return;

        setIsSubmitting(true);
        try {
            await onSubmit(job.id, formData);
            onOpenChange(false);
        } catch (error: any) {
            console.error("Failed to update job:", error);
            alert(`Gagal mengupdate lowongan: ${error?.message || JSON.stringify(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Lowongan Pekerjaan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Pekerjaan *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Senior Software Engineer"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Departemen *</Label>
                        <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            placeholder="e.g., Engineering"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Lokasi *</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Jakarta"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tipe Pekerjaan *</Label>
                            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="salary_range">Rentang Gaji</Label>
                        <Input
                            id="salary_range"
                            value={formData.salary_range}
                            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                            placeholder="e.g., Rp 10.000.000 - Rp 15.000.000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Pekerjaan *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Jelaskan tanggung jawab, kualifikasi, dan persyaratan pekerjaan..."
                            rows={8}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="requirements">Persyaratan</Label>
                        <Textarea
                            id="requirements"
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            placeholder="Kualifikasi dan persyaratan yang dibutuhkan..."
                            rows={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Open">Terbuka</SelectItem>
                                <SelectItem value="Closed">Ditutup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
