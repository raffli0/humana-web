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
    Coins,
} from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
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
import { Position } from "@/src/domain/company/ISettingsRepository";
import { motion, AnimatePresence } from "framer-motion";

interface PositionPayrollCardProps {
    pos: Position;
    onUpdate: (id: string, updates: Partial<Position>) => Promise<void>;
}

function PositionPayrollCard({ pos, onUpdate }: PositionPayrollCardProps) {
    const [salary, setSalary] = useState(pos.base_salary?.toString() || "");
    const [transport, setTransport] = useState(pos.transport_allowance?.toString() || "");
    const [meal, setMeal] = useState(pos.meal_allowance?.toString() || "");
    const [positionAllowance, setPositionAllowance] = useState(pos.position_allowance?.toString() || "");
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(pos.id, {
                base_salary: parseFloat(salary) || 0,
                transport_allowance: parseFloat(transport) || 0,
                meal_allowance: parseFloat(meal) || 0,
                position_allowance: parseFloat(positionAllowance) || 0,
            });
            setHasChanges(false);
        } catch (error: any) {
            console.error("Failed to save payroll:", error);
            alert(`Failed to save payroll: ${error?.message || JSON.stringify(error) || "Unknown error"}`);
        } finally {
            setIsSaving(false);
        }
    };

    const total = (parseFloat(salary) || 0) + (parseFloat(transport) || 0) + (parseFloat(meal) || 0) + (parseFloat(positionAllowance) || 0);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="border-slate-200/60 shadow-none bg-white hover:border-indigo-200 transition-all group overflow-hidden">
                <div className={`h-1 transition-colors ${hasChanges ? "bg-amber-400" : "bg-slate-100 group-hover:bg-indigo-400"}`}></div>
                <CardHeader className="p-5 pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold tracking-tight text-slate-800">
                            {pos.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px] font-mono border-slate-100 text-slate-400">
                            POS-{pos.id.slice(0, 4)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-5 pt-3 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gaji Pokok</Label>
                            <div className="relative group/input">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold bg-slate-50 h-full flex items-center px-2 border-r rounded-l-md group-focus-within/input:text-indigo-600 transition-colors">IDR</span>
                                <Input
                                    type="number"
                                    className="h-10 text-sm pl-16 font-medium border-slate-200 focus-visible:ring-indigo-500"
                                    value={salary}
                                    placeholder="0"
                                    onChange={(e) => {
                                        setSalary(e.target.value);
                                        setHasChanges(true);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Transportasi</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        className="h-9 text-xs border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-500"
                                        value={transport}
                                        placeholder="0"
                                        onChange={(e) => {
                                            setTransport(e.target.value);
                                            setHasChanges(true);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Uang Makan</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        className="h-9 text-xs border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-500"
                                        value={meal}
                                        placeholder="0"
                                        onChange={(e) => {
                                            setMeal(e.target.value);
                                            setHasChanges(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tunjangan Jabatan</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    className="h-9 text-xs border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-500"
                                    value={positionAllowance}
                                    placeholder="0"
                                    onChange={(e) => {
                                        setPositionAllowance(e.target.value);
                                        setHasChanges(true);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Bulanan</span>
                            <span className="text-sm font-bold text-indigo-600">IDR {total.toLocaleString()}</span>
                        </div>
                        <AnimatePresence>
                            {hasChanges && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Button
                                        size="sm"
                                        className="h-9 px-4 text-xs gap-2 font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                        Simpan
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function CompanySettingsPage() {
    const {
        departments,
        positions,
        settings,
        loading,
        saving,
        error,
        addDepartment,
        deleteDepartment,
        addPosition,
        deletePosition,
        updateLocationSettings,
        saveLocationSettings,
        updatePositionPayroll,
    } = useSettingsViewModel();

    // Dialog local states
    const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
    const [isAddPosOpen, setIsAddPosOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");
    const [newPosName, setNewPosName] = useState("");
    const [newPosDeptId, setNewPosDeptId] = useState<string>("");

    // Delete Confirmation State
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'department' | 'position', id: string, name: string } | null>(null);

    const handleLocationChange = useCallback((lat: number, lng: number) => {
        updateLocationSettings({ office_latitude: lat, office_longitude: lng });
    }, [updateLocationSettings]);

    const handleAddressChange = useCallback((address: string) => {
        updateLocationSettings({ office_address: address });
    }, [updateLocationSettings]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-64 bg-slate-200" />
                        <Skeleton className="h-4 w-96 bg-slate-100" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32 bg-slate-200" />
                        <Skeleton className="h-10 w-32 bg-slate-100" />
                        <Skeleton className="h-10 w-32 bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardHeader>
                                <Skeleton className="h-6 w-32 bg-slate-200" />
                                <Skeleton className="h-4 w-48 bg-slate-100 mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-12 w-full bg-slate-50" />
                                <Skeleton className="h-12 w-full bg-slate-50" />
                                <Skeleton className="h-12 w-full bg-slate-50" />
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardHeader>
                                <Skeleton className="h-6 w-32 bg-slate-200" />
                                <Skeleton className="h-4 w-48 bg-slate-100 mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-12 w-full bg-slate-50" />
                                <Skeleton className="h-12 w-full bg-slate-50" />
                                <Skeleton className="h-12 w-full bg-slate-50" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pengaturan Perusahaan</h1>
                    <p className="text-muted-foreground mt-1">Kelola departemen, posisi, dan lokasi kantor.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-center gap-2" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}


            <Tabs defaultValue="organization" className="space-y-6">
                <TabsList className="bg-white border">
                    <TabsTrigger value="organization" className="gap-2">
                        <Building2 className="h-4 w-4" /> Organisasi
                    </TabsTrigger>
                    <TabsTrigger value="location" className="gap-2">
                        <MapPin className="h-4 w-4" /> Lokasi Kantor
                    </TabsTrigger>
                    <TabsTrigger value="payroll" className="gap-2">
                        <Coins className="h-4 w-4" /> Pengaturan Payroll
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
                                        <Users className="h-5 w-5" /> Departemen
                                    </CardTitle>
                                    <CardDescription>Atur tim Anda berdasarkan departemen</CardDescription>
                                </div>
                                <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="gap-1">
                                            <Plus className="h-4 w-4" /> Tambah
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Departemen</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Nama Departemen</Label>
                                                <Input
                                                    value={newDeptName}
                                                    onChange={(e) => setNewDeptName(e.target.value)}
                                                    placeholder="misal: Engineering"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={async () => {
                                                await addDepartment(newDeptName);
                                                setNewDeptName("");
                                                setIsAddDeptOpen(false);
                                            }}>Tambah Departemen</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {departments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        Belum ada departemen. Tambah departemen untuk memulai.
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
                                                    onClick={() => setDeleteTarget({ type: 'department', id: dept.id, name: dept.name })}
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
                                        <Briefcase className="h-5 w-5" /> Posisi
                                    </CardTitle>
                                    <CardDescription>Jabatan dan peran</CardDescription>
                                </div>
                                <Dialog open={isAddPosOpen} onOpenChange={setIsAddPosOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="gap-1">
                                            <Plus className="h-4 w-4" /> Tambah
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Posisi</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Nama Posisi</Label>
                                                <Input
                                                    value={newPosName}
                                                    onChange={(e) => setNewPosName(e.target.value)}
                                                    placeholder="misal: Software Engineer"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Departemen (Opsional)</Label>
                                                <Select value={newPosDeptId} onValueChange={setNewPosDeptId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih departemen" />
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
                                            }}>Tambah Posisi</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {positions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        Belum ada posisi. Tambah posisi untuk memulai.
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
                                                        onClick={() => setDeleteTarget({ type: 'position', id: pos.id, name: pos.name })}
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
                                    <MapPin className="h-5 w-5" /> Geolokasi Kantor
                                </CardTitle>
                                <CardDescription>
                                    Atur lokasi kantor untuk pembatasan wilayah (geofencing) absensi
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Alamat Kantor</Label>
                                    <Input
                                        value={settings.office_address || ""}
                                        onChange={(e) => updateLocationSettings({ office_address: e.target.value })}
                                        placeholder="misal: Jl. Sudirman No. 123, Jakarta"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Garis Lintang (Latitude)</Label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={settings.office_latitude || ""}
                                            onChange={(e) => updateLocationSettings({ office_latitude: parseFloat(e.target.value) || null })}
                                            placeholder="-6.2088"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Garis Bujur (Longitude)</Label>
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
                                    <Label>Radius yang Diizinkan (meter)</Label>
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
                                        Karyawan harus berada dalam radius ini untuk melakukan absensi
                                    </p>
                                </div>

                                <Button onClick={saveLocationSettings} disabled={saving} className="w-full gap-2">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Simpan Pengaturan Lokasi
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Tampilan Peta</CardTitle>
                                <CardDescription>Pilih lokasi di peta</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LocationPickerMap
                                    lat={settings.office_latitude}
                                    lng={settings.office_longitude}
                                    radius={settings.office_radius_meters || 100}
                                    onLocationChange={handleLocationChange}
                                    onAddressChange={handleAddressChange}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Payroll Tab */}
                <TabsContent value="payroll" className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-gray-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Coins className="h-5 w-5" /> Konfigurasi Payroll Posisi
                            </CardTitle>
                            <CardDescription>
                                Atur gaji pokok standar dan tunjangan untuk setiap peran. (Jumlah dalam mata uang lokal)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {departments.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-sm font-medium text-slate-500">
                                        Departemen tidak ditemukan. Buat departemen terlebih dahulu untuk mengelola payroll berdasarkan posisi.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {departments.map((dept) => {
                                        const deptPositions = positions.filter(p => p.department_id === dept.id);
                                        if (deptPositions.length === 0) return null;

                                        return (
                                            <div key={dept.id} className="space-y-5">
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100 px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm">
                                                        {dept.name}
                                                    </Badge>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-indigo-50 to-transparent"></div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                                    {deptPositions.map((pos) => (
                                                        <PositionPayrollCard
                                                            key={pos.id}
                                                            pos={pos}
                                                            onUpdate={updatePositionPayroll}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus permanen <strong>{deleteTarget?.name}</strong> {deleteTarget?.type === 'department' ? 'departemen' : 'posisi'} dan
                            secara otomatis menghapusnya dari karyawan yang ditugaskan. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            onClick={async () => {
                                if (!deleteTarget) return;
                                if (deleteTarget.type === 'department') {
                                    await deleteDepartment(deleteTarget.id);
                                } else {
                                    await deletePosition(deleteTarget.id);
                                }
                                setDeleteTarget(null);
                            }}
                        >
                            Hapus {deleteTarget?.type === 'department' ? 'Departemen' : 'Posisi'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}
