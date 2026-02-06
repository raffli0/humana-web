"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Building2, Calendar, Loader2, Camera, Edit2, X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { authService } from "@/src/infrastructure/auth/authService";
import { Profile } from "@/src/domain/employee/profile";
import { toast } from "sonner";

export default function CompanyProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form states
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const fetchProfile = async () => {
        try {
            const data = await authService.getCurrentProfile();
            setProfile(data);
            if (data) {
                setFullName(data.full_name || "");
                setEmail(data.email || "");
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!profile) return;
        setIsSaving(true);
        try {
            // Update Full Name in profiles table
            await authService.updateProfile(profile.id, { full_name: fullName });

            // Update Email in Auth (if changed)
            if (email !== profile.email) {
                await authService.updateEmail(email);
                toast.success("Profil diperbarui. Silakan cek email baru Anda untuk konfirmasi.");
            } else {
                toast.success("Profil berhasil diperbarui");
            }

            await fetchProfile();
            setIsEditing(false);
        } catch (error: any) {
            toast.error(`Gagal memperbarui profil: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        setIsUploading(true);
        try {
            const publicUrl = await authService.uploadAvatar(profile.id, file);
            await authService.updateProfile(profile.id, { avatar_url: publicUrl });
            await fetchProfile();
            toast.success("Foto profil berhasil diperbarui");
        } catch (error: any) {
            toast.error(`Gagal mengunggah foto: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <main className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </main>
        );
    }

    if (!profile) return null;

    return (
        <main className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Profile */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-xl relative overflow-hidden">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-2xl bg-indigo-600 text-white font-bold">
                                {profile.full_name?.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                        </Avatar>
                        <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors border-2 border-white">
                            <Camera className="w-4 h-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
                        </label>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            {profile.full_name}
                        </h1>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Mail className="w-4 h-4" />
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                                <Shield className="w-3 h-3 mr-1" />
                                {profile.role === "super_admin" ? "Super Admin" : "Company Admin"}
                            </Badge>
                            <Badge variant="outline" className="border-slate-200">
                                {profile.status === "active" ? "Aktif" : "Nonaktif"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit Profil
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={() => setIsEditing(false)} variant="ghost" className="gap-2">
                            <X className="w-4 h-4" />
                            Batal
                        </Button>
                        <Button onClick={handleSave} className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md" disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informasi Pribadi */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-600" />
                            Informasi Pribadi
                        </CardTitle>
                        <CardDescription>Detail akun administrator Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Lengkap</Label>
                            {isEditing ? (
                                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-slate-50" />
                            ) : (
                                <p className="text-slate-900 font-medium">{profile.full_name}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alamat Email</Label>
                            {isEditing ? (
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-50" />
                            ) : (
                                <p className="text-slate-900 font-medium">{profile.email}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peran Sistem</span>
                            <p className="text-slate-900 font-medium capitalize">{profile.role?.replace("_", " ")}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Informasi Perusahaan */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                            Perusahaan
                        </CardTitle>
                        <CardDescription>Informasi perusahaan yang dikelola</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-1">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Perusahaan</span>
                            <p className="text-slate-900 font-medium">{profile.companies?.name || "Global Admin"}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Akun</span>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <p className="text-slate-900 font-medium">Terverifikasi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
