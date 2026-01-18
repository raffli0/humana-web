"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { authService } from "@/src/infrastructure/auth/authService";

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
                setError("No activation token provided.");
                setIsValidating(false);
                return;
            }

            const { data, error: fetchError } = await authService.getInvitationByToken(token);

            if (fetchError || !data) {
                setError("Invalid or expired activation link. Please contact your administrator.");
                setIsValidating(false);
                return;
            }

            setInvitation({
                ...data,
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
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
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
            if (!authData.user) throw new Error("Failed to create user account.");

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
                    status: "Active",
                    join_date: new Date().toISOString().split("T")[0],
                });

                if (employeeError) {
                    console.error("Failed to create employee record:", employeeError);
                }
            }

            // Mark invitation as used
            await authService.markInvitationAsUsed(invitation.id);

            alert("Account activated successfully! Please log in.");
            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Failed to activate account.");
        }

        setIsLoading(false);
    }

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0C212F]" />
                    <p className="text-muted-foreground">Validating activation link...</p>
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
                        <CardTitle>Activation Failed</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push("/login")}
                        >
                            Go to Login
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
                            <p className="font-medium">You've been invited!</p>
                            <p className="text-sm text-white/60">
                                Complete your account setup to get started.
                            </p>
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

            {/* Right Panel */}
            <div className="flex items-center justify-center p-6 bg-slate-50">
                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Activate Your Account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Set up your password to complete registration
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
                                    <span className="text-muted-foreground">Company</span>
                                    <span className="font-medium">{invitation.company_name || "—"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Role</span>
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
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    className="pr-10 bg-white"
                                    placeholder="Min. 8 characters"
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
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    className="pr-10 bg-white"
                                    placeholder="Re-enter password"
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
                            Activate Account
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
                Loading...
            </div>
        }>
            <ActivateAccountContent />
        </Suspense>
    );
}
