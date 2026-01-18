"use client";

import { useState, useCallback } from "react";
import {
    Building2,
    Users,
    Briefcase,
    MapPin,
    Plus,
    Trash2,
    Loader2,
    Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
    Dialog,
    DialogContent,
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
import { useSettingsViewModel } from "@/src/presentation/hooks/useSettingsViewModel";
import LocationPickerMap from "./LocationPickerMap";

export default function CompanySettingsPage() {
    const {
        departments,
        positions,
        settings,
        loading,
        saving,
        addDepartment,
        deleteDepartment,
        addPosition,
        deletePosition,
        updateLocationSettings,
        saveLocationSettings,
    } = useSettingsViewModel();

    // Dialog local states
    const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
    const [isAddPosOpen, setIsAddPosOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");
    const [newPosName, setNewPosName] = useState("");
    const [newPosDeptId, setNewPosDeptId] = useState<string>("");

    const handleLocationChange = useCallback((lat: number, lng: number) => {
        updateLocationSettings({ office_latitude: lat, office_longitude: lng });
    }, [updateLocationSettings]);

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
                                            <Button onClick={async () => {
                                                await addDepartment(newDeptName);
                                                setNewDeptName("");
                                                setIsAddDeptOpen(false);
                                            }}>Add Department</Button>
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
                                            <Button onClick={async () => {
                                                await addPosition(newPosName, newPosDeptId);
                                                setNewPosName("");
                                                setNewPosDeptId("");
                                                setIsAddPosOpen(false);
                                            }}>Add Position</Button>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-gray-200 h-fit">
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
                                        onChange={(e) => updateLocationSettings({ office_address: e.target.value })}
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
                                            onChange={(e) => updateLocationSettings({ office_latitude: parseFloat(e.target.value) || null })}
                                            placeholder="-6.2088"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Longitude</Label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={settings.office_longitude || ""}
                                            onChange={(e) => updateLocationSettings({ office_longitude: parseFloat(e.target.value) || null })}
                                            placeholder="106.8456"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Allowed Radius (meters)</Label>
                                    <Input
                                        type="number"
                                        value={settings.office_radius_meters ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            updateLocationSettings({
                                                office_radius_meters: val === "" ? null : parseInt(val)
                                            });
                                        }}
                                        placeholder="100"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Employees must be within this radius to clock in/out
                                    </p>
                                </div>

                                <Button onClick={saveLocationSettings} disabled={saving} className="w-full gap-2">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Location Settings
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Map View</CardTitle>
                                <CardDescription>Select location on map</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LocationPickerMap
                                    lat={settings.office_latitude}
                                    lng={settings.office_longitude}
                                    radius={settings.office_radius_meters || 100}
                                    onLocationChange={handleLocationChange}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
}
