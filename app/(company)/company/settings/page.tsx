"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    Building2,
    Users,
    Briefcase,
    MapPin,
    Plus,
    Trash2,
    Loader2,
    Save,
    Edit2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { supabase } from "../../../utils/supabase/client";

interface Department {
    id: string;
    name: string;
}

interface Position {
    id: string;
    name: string;
    department_id: string | null;
}

interface CompanySettings {
    office_latitude: number | null;
    office_longitude: number | null;
    office_radius_meters: number;
    office_address: string | null;
}

export default function CompanySettingsPage() {
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [settings, setSettings] = useState<CompanySettings>({
        office_latitude: null,
        office_longitude: null,
        office_radius_meters: 100,
        office_address: null,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Dialog states
    const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
    const [isAddPosOpen, setIsAddPosOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");
    const [newPosName, setNewPosName] = useState("");
    const [newPosDeptId, setNewPosDeptId] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);

        // Get current user's company_id
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
            .from("profiles")
            .select("company_id")
            .eq("id", user.id)
            .single();

        if (!profile?.company_id) {
            setLoading(false);
            return;
        }

        setCompanyId(profile.company_id);

        // Fetch departments
        const { data: depts } = await supabase
            .from("departments")
            .select("*")
            .eq("company_id", profile.company_id)
            .order("name");
        if (depts) setDepartments(depts);

        // Fetch positions
        const { data: pos } = await supabase
            .from("positions")
            .select("*")
            .eq("company_id", profile.company_id)
            .order("name");
        if (pos) setPositions(pos);

        // Fetch company settings
        const { data: settingsData } = await supabase
            .from("company_settings")
            .select("*")
            .eq("company_id", profile.company_id)
            .single();
        if (settingsData) {
            setSettings({
                office_latitude: settingsData.office_latitude,
                office_longitude: settingsData.office_longitude,
                office_radius_meters: settingsData.office_radius_meters || 100,
                office_address: settingsData.office_address,
            });
        }

        setLoading(false);
    }

    async function addDepartment() {
        if (!companyId || !newDeptName.trim()) return;

        const { error } = await supabase.from("departments").insert({
            company_id: companyId,
            name: newDeptName.trim(),
        });

        if (!error) {
            setNewDeptName("");
            setIsAddDeptOpen(false);
            fetchData();
        }
    }

    async function deleteDepartment(id: string) {
        if (!confirm("Delete this department? Positions in this department will be unlinked.")) return;

        await supabase.from("departments").delete().eq("id", id);
        fetchData();
    }

    async function addPosition() {
        if (!companyId || !newPosName.trim()) return;

        const { error } = await supabase.from("positions").insert({
            company_id: companyId,
            name: newPosName.trim(),
            department_id: newPosDeptId || null,
        });

        if (!error) {
            setNewPosName("");
            setNewPosDeptId("");
            setIsAddPosOpen(false);
            fetchData();
        }
    }

    async function deletePosition(id: string) {
        if (!confirm("Delete this position?")) return;

        await supabase.from("positions").delete().eq("id", id);
        fetchData();
    }

    async function saveLocationSettings() {
        if (!companyId) return;
        setSaving(true);

        // Upsert company settings
        const { error } = await supabase
            .from("company_settings")
            .upsert({
                company_id: companyId,
                office_latitude: settings.office_latitude,
                office_longitude: settings.office_longitude,
                office_radius_meters: settings.office_radius_meters,
                office_address: settings.office_address,
                updated_at: new Date().toISOString(),
            });

        if (!error) {
            alert("Settings saved successfully!");
        }
        setSaving(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Company Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage departments, positions, and office location.</p>
                </div>
            </div>

            <Tabs defaultValue="organization" className="space-y-6">
                <TabsList className="bg-white border">
                    <TabsTrigger value="organization" className="gap-2">
                        <Building2 className="h-4 w-4" /> Organization
                    </TabsTrigger>
                    <TabsTrigger value="location" className="gap-2">
                        <MapPin className="h-4 w-4" /> Office Location
                    </TabsTrigger>
                </TabsList>

                {/* Organization Tab */}
                <TabsContent value="organization" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Departments */}
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="h-5 w-5" /> Departments
                                    </CardTitle>
                                    <CardDescription>Organize your team by departments</CardDescription>
                                </div>
                                <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="gap-1">
                                            <Plus className="h-4 w-4" /> Add
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Department</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Department Name</Label>
                                                <Input
                                                    value={newDeptName}
                                                    onChange={(e) => setNewDeptName(e.target.value)}
                                                    placeholder="e.g., Engineering"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={addDepartment}>Add Department</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {departments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No departments yet. Add one to get started.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {departments.map((dept) => (
                                            <div
                                                key={dept.id}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                            >
                                                <span className="font-medium">{dept.name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => deleteDepartment(dept.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Positions */}
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" /> Positions
                                    </CardTitle>
                                    <CardDescription>Job titles and roles</CardDescription>
                                </div>
                                <Dialog open={isAddPosOpen} onOpenChange={setIsAddPosOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="gap-1">
                                            <Plus className="h-4 w-4" /> Add
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Position</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Position Name</Label>
                                                <Input
                                                    value={newPosName}
                                                    onChange={(e) => setNewPosName(e.target.value)}
                                                    placeholder="e.g., Software Engineer"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Department (Optional)</Label>
                                                <Select value={newPosDeptId} onValueChange={setNewPosDeptId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map((dept) => (
                                                            <SelectItem key={dept.id} value={dept.id}>
                                                                {dept.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={addPosition}>Add Position</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {positions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No positions yet. Add one to get started.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {positions.map((pos) => {
                                            const dept = departments.find((d) => d.id === pos.department_id);
                                            return (
                                                <div
                                                    key={pos.id}
                                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                                >
                                                    <div>
                                                        <span className="font-medium">{pos.name}</span>
                                                        {dept && (
                                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                                {dept.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => deletePosition(pos.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Location Tab */}
                <TabsContent value="location" className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-gray-200 max-w-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="h-5 w-5" /> Office Geolocation
                            </CardTitle>
                            <CardDescription>
                                Set your office location for attendance geofencing
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Office Address</Label>
                                <Input
                                    value={settings.office_address || ""}
                                    onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                                    placeholder="e.g., Jl. Sudirman No. 123, Jakarta"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Latitude</Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={settings.office_latitude || ""}
                                        onChange={(e) => setSettings({ ...settings, office_latitude: parseFloat(e.target.value) || null })}
                                        placeholder="-6.2088"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Longitude</Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={settings.office_longitude || ""}
                                        onChange={(e) => setSettings({ ...settings, office_longitude: parseFloat(e.target.value) || null })}
                                        placeholder="106.8456"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Allowed Radius (meters)</Label>
                                <Input
                                    type="number"
                                    value={settings.office_radius_meters}
                                    onChange={(e) => setSettings({ ...settings, office_radius_meters: parseInt(e.target.value) || 100 })}
                                    placeholder="100"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Employees must be within this radius to clock in/out
                                </p>
                            </div>

                            <Button onClick={saveLocationSettings} disabled={saving} className="gap-2">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Location Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
