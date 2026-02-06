"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { authService } from "@/src/infrastructure/auth/authService";
import { supabase } from "@/src/infrastructure/supabase/client";

interface InvitationData {
    id: string;
    email: string;
    full_name: string | null;
    company_id: string;
    role: string;
    token: string;
    company_name?: string;
    department_id?: string;
    position_id?: string;
    department_name?: string;
    position_name?: string;
}

function ActivateAccountContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [invitation, setInvitation] = useState<InvitationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function validateToken() {
            if (!token) {
                setError("Token aktivasi tidak ditemukan.");
                setIsValidating(false);
                return;
            }

            const { data, error: fetchError } = await authService.getInvitationByToken(token);

            if (fetchError || !data) {
                setError("Tautan aktivasi tidak valid atau sudah kedaluwarsa. Silakan hubungi administrator Anda.");
                setIsValidating(false);
                return;
            }

            let deptName = "";
            let posName = "";

            if (data.department_id) {
                const { data: d } = await supabase.from('departments').select('name').eq('id', data.department_id).single();
                if (d) deptName = d.name;
            }

            if (data.position_id) {
                const { data: p } = await supabase.from('positions').select('name').eq('id', data.position_id).single();
                if (p) posName = p.name;
            }

            setInvitation({
                ...data,
                department_name: deptName,
                position_name: posName,
                company_name: "Your Company", // Simplified for now to avoid complex joins in one go
            });
            setIsValidating(false);
        }

        validateToken();
    }, [token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!invitation) return;

        setIsLoading(true);
        const form = e.target as HTMLFormElement;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

        if (password !== confirmPassword) {
            setError("Kata sandi tidak cocok.");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Kata sandi harus minimal 8 karakter.");
            setIsLoading(false);
            return;
        }

        try {
            // Create auth user
            const { data: authData, error: authError } = await authService.signUp(
                invitation.email,
                password
            );

            if (authError) throw authError;
            if (!authData.user) throw new Error("Gagal membuat akun pengguna.");

            // Create profile
            const { error: profileError } = await authService.createProfile({
                id: authData.user.id,
                email: invitation.email,
                full_name: invitation.full_name,
                company_id: invitation.company_id,
                role: invitation.role,
                status: "active",
            });

            if (profileError) throw profileError;

            // If role is employee, also insert into employees table
            if (invitation.role === "employee") {
                const { error: employeeError } = await authService.createEmployee({
                    id: authData.user.id,
                    name: invitation.full_name || invitation.email.split("@")[0],
                    email: invitation.email,
                    company_id: invitation.company_id,
                    department: invitation.department_name || null,
                    position: invitation.position_name || null,
                    department_id: invitation.department_id || null, // Link FK if exists
                    position_id: invitation.position_id || null,     // Link FK if exists
                    status: "Active",
                    join_date: new Date().toISOString().split("T")[0],
                });

                if (employeeError) {
                    console.error("Failed to create employee record:", employeeError);
                }
            }

            // Mark invitation as used
            await authService.markInvitationAsUsed(invitation.id);

            alert("Akun berhasil diaktifkan! Silakan masuk.");
            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Gagal mengaktifkan akun.");
        }

        setIsLoading(false);
    }

    if (isValidating) {
        return (
            <div className="w-full min-h-screen grid lg:grid-cols-2">
                <div className="hidden lg:flex flex-col justify-between bg-[#0C212F] p-10">
                    <Skeleton className="h-8 w-32 bg-white/10" />
                    <Skeleton className="h-24 w-full bg-white/10 rounded-lg" />
                    <Skeleton className="h-4 w-48 bg-white/10" />
                </div>
                <div className="flex items-center justify-center p-6 bg-slate-50">
                    <div className="w-full max-w-[400px] space-y-6">
                        <div className="space-y-2 text-center">
                            <Skeleton className="h-8 w-64 mx-auto" />
                            <Skeleton className="h-4 w-48 mx-auto" />
                        </div>
                        <Skeleton className="h-32 w-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="max-w-md w-full mx-4">
                    <CardHeader className="text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <CardTitle>Aktivasi Gagal</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push("/login")}
                        >
                            Ke Halaman Masuk
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* Left Panel */}
            <div className="hidden lg:flex flex-col justify-between bg-[#0C212F] p-10 text-white">
                <div>
                    <div className="flex items-center gap-2 font-semibold text-xl">
                        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                            <span className="text-white font-bold">H</span>
                        </div>
                        Humana
                    </div>
                </div>

                <div className="max-w-md space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                        <div>
                            <p className="font-medium">Anda telah diundang!</p>
                            <p className="text-sm text-white/60">
                                Selesaikan pengaturan akun Anda untuk memulai.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-white/40 flex justify-between">
                    <span>© 2026 Humana Inc.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privasi</a>
                        <a href="#" className="hover:text-white transition-colors">Ketentuan</a>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex items-center justify-center p-6 bg-slate-50">
                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Aktifkan Akun Anda
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Atur kata sandi Anda untuk menyelesaikan pendaftaran
                        </p>
                    </div>

                    {invitation && (
                        <Card className="border bg-white shadow-sm">
                            <CardContent className="pt-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium">{invitation.email}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Perusahaan</span>
                                    <span className="font-medium">{invitation.company_name || "—"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Peran</span>
                                    <span className="font-medium capitalize">{invitation.role.replace("_", " ")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    className="pr-10 bg-white"
                                    placeholder="Minimal 8 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    className="pr-10 bg-white"
                                    placeholder="Masukkan kembali kata sandi"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#0C212F] hover:bg-[#0C212F]/90"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Aktifkan Akun
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ActivateAccountPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-medium text-slate-500">
                Memuat...
            </div>
        }>
            <ActivateAccountContent />
        </Suspense>
    );
}
