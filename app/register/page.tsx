"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // For register, usually login or redirect to login
            router.push("/login");
        }, 1500);
    }

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">

            {/* Left Panel: Branding - Identical to Login for consistency */}
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
                        "Humana membantu kami merapikan proses HR yang sebelumnya tersebar dan tidak konsisten. Sekarang, data kehadiran dan karyawan dapat kami pantau secara real-time dengan jauh lebih akurat."
                    </blockquote>
                    <div className="flex items-center gap-3 pt-2">
                        <div>
                            <div className="font-semibold text-sm">Hayley Williams</div>
                            <div className="text-xs text-white/60">CV. Dedsec</div>
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
            <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-black relative">
                <Link
                    href="/login"
                    className="absolute top-8 left-8 hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Link>

                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details to get started with Humana
                        </p>
                    </div>

                    <Card className="border-0 shadow-none bg-transparent">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Asep Balons"
                                    required
                                    className="bg-white"
                                />
                            </div>

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

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="pr-10 bg-white"
                                            placeholder="******"
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

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            className="pr-10 bg-white"
                                            placeholder="******"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-[#0C212F] hover:bg-[#0C212F]/90 mt-2" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register
                            </Button>
                        </form>
                    </Card>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 hover:text-primary font-medium text-gray-900 dark:text-gray-100"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
