"use client"

import { useState } from "react"
import {
    Settings,
    Shield,
    Database,
    Cloud,
    Mail,
    Lock,
    Save,
    Bell,
    Globe
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Switch } from "../../../components/ui/switch"
import { Label } from "../../../components/ui/label"

export default function SystemConfiguration() {
    const [maintenanceMode, setMaintenanceMode] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Configuration</h1>
                    <p className="text-muted-foreground mt-1">Platform-wide settings and security controls.</p>
                </div>
                <Button className="bg-[#0C212F] hover:bg-[#0C212F]/90 gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Nav (Mini) */}
                <div className="space-y-2">
                    <NavButton icon={Shield} label="General Settings" active />
                    <NavButton icon={Database} label="Database & Storage" />
                    <NavButton icon={Lock} label="Authentication" />
                    <NavButton icon={Mail} label="Email Notification" />
                    <NavButton icon={Globe} label="Region & Localization" />
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Platform Maintenance</CardTitle>
                            <CardDescription>Control public access to the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Redirect all non-admin users to a maintenance page.</p>
                                </div>
                                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Email Configuration</CardTitle>
                            <CardDescription>Setup SMTP or transactional email provider.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="smtp-host">SMTP Host</Label>
                                <Input id="smtp-host" placeholder="smtp.mailgun.org" className="bg-slate-50 border-slate-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp-port">Port</Label>
                                    <Input id="smtp-port" placeholder="587" className="bg-slate-50 border-slate-200" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="encryption">Encryption</Label>
                                    <Input id="encryption" placeholder="TLS" className="bg-slate-50 border-slate-200" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle>Security & Access</CardTitle>
                            <CardDescription>Manage password policies and global session limits.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Require 2FA for Super Admins</p>
                                    <p className="text-xs text-muted-foreground">Mandatory two-factor authentication for all platform administrators.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <Label>Password Min. Length</Label>
                                <Input type="number" defaultValue={12} className="w-24 mt-2 bg-slate-50 border-slate-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function NavButton({ icon: Icon, label, active = false }: any) {
    return (
        <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-11 px-4 ${active ? "bg-white shadow-sm ring-1 ring-gray-200 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-slate-100"}`}
        >
            <Icon className={`h-4 w-4 ${active ? "text-indigo-600" : "text-gray-400"}`} />
            {label}
        </Button>
    )
}
