"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent } from "@/app/components/ui/card";
import { authService } from "@/src/infrastructure/auth/authService";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [employeeBlocked, setEmployeeBlocked] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setEmployeeBlocked(false);

        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        try {
            const { data, error: authError } = await authService.signIn(email, password);
            if (authError) throw authError;

            // Get profile to check role and redirect
            const profile = await authService.getCurrentProfile();

            if (!profile) {
                setError("Account not found. Please contact your administrator.");
                await authService.signOut();
                return;
            }

            if (profile.status && profile.status !== "active") {
                setError("Your account is inactive. Please contact your administrator.");
                await authService.signOut();
                return;
            }

            // Block employees from web dashboard
            if (profile.role === "employee") {
                await authService.signOut();
                setEmployeeBlocked(true);
                return;
            }

            // Route based on role
            if (profile.role === "super_admin") {
                router.push("/platform/dashboard");
            } else if (profile.company_id) {
                router.push("/company/dashboard");
            } else {
                router.push("/landing-page");
            }
        } catch (err: any) {
            setError(err.message || "Failed to login. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* Left Panel: Branding */}
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
                    <blockquote className="text-lg font-medium leading-relaxed opacity-90">
                        "Humana membawa perubahan signifikan dalam cara kami mengelola kehadiran dan data karyawan. Sistemnya stabil, mudah digunakan, dan sesuai dengan kebutuhan perusahaan."
                    </blockquote>
                    <div className="flex items-center gap-3 pt-2">
                        <div>
                            <div className="font-semibold text-sm">Sofa Nursofa</div>
                            <div className="text-xs text-white/60">Wakil Kepala Sekolah, Raudhatul Atfal Ar-Rahmah</div>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-white/40 flex justify-between">
                    <span>© 2026 Humana Inc.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            {/* Right Panel: Form */}
            <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-black">
                <div className="mx-auto w-full max-w-[350px] space-y-6">
                    {employeeBlocked ? (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Smartphone className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Use the Mobile App
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Employee access is available through the Humana mobile app. Please download the app to attendances, leave requests, and manage your profile.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" className="w-full gap-2">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    Download for iOS
                                </Button>
                                <Button variant="outline" className="w-full gap-2">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.991l-2.303 2.303-8.633-8.636z" />
                                    </svg>
                                    Download for Android
                                </Button>
                            </div>
                            <Button
                                variant="link"
                                className="text-muted-foreground"
                                onClick={() => setEmployeeBlocked(false)}
                            >
                                ← Back to login
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Welcome back
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your credentials to access your account
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <Card className="border-0 shadow-none bg-transparent">
                                <CardContent className="p-0">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                placeholder="name@company.com"
                                                required
                                                type="email"
                                                className="bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                <Link
                                                    href="#"
                                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    className="pr-10 bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full bg-[#0C212F] hover:bg-[#0C212F]/90" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Sign In
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <p className="px-8 text-center text-sm text-muted-foreground">
                                Need access?{" "}
                                <span className="text-gray-900 dark:text-gray-100">
                                    Contact your administrator
                                </span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
