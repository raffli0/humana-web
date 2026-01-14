"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 1500);
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
                            <div className="font-semibold text-sm">Ateph Bauhaus</div>
                            <div className="text-xs text-white/60">HR Business Partner, PT Global Inovasi</div>
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
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <Card className="border-0 shadow-none bg-transparent">
                        {/* Using Card components purely for structural consistency if needed, 
                but here the design is clean enough without the card border 
                so we act as a container. */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
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
                    </Card>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="underline underline-offset-4 hover:text-primary font-medium text-gray-900 dark:text-gray-100"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
