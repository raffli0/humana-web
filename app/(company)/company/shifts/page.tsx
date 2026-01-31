"use client";

import { useState } from "react";
import { Clock, Plus, Trash2, Users, Edit3, Save, X, Calendar, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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
import { useShiftViewModel } from "@/src/presentation/hooks/useShiftViewModel";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { TimePicker } from "../../../components/ui/time-picker";

export default function ShiftManagement() {
    const { shifts, employees, loading, createShift, updateShift, deleteShift, assignShift } = useShiftViewModel();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<any>(null);
    const [editingShift, setEditingShift] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [newShift, setNewShift] = useState({
        name: "",
        start_time: "09:00",
        end_time: "17:00",
        late_tolerance_minutes: 0
    });

    const handleCreateShift = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createShift({
                name: newShift.name,
                start_time: newShift.start_time + ":00",
                end_time: newShift.end_time + ":00",
                late_tolerance_minutes: newShift.late_tolerance_minutes
            });
            setIsCreateModalOpen(false);
            setNewShift({ name: "", start_time: "09:00", end_time: "17:00", late_tolerance_minutes: 0 });
        } catch (error) {
            alert("Failed to create shift");
        }
    };

    const handleUpdateShift = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingShift) return;
        try {
            await updateShift({
                id: editingShift.id,
                name: editingShift.name,
                start_time: editingShift.start_time.length === 5 ? editingShift.start_time + ":00" : editingShift.start_time,
                end_time: editingShift.end_time.length === 5 ? editingShift.end_time + ":00" : editingShift.end_time,
                late_tolerance_minutes: editingShift.late_tolerance_minutes
            });
            setIsEditModalOpen(false);
            setEditingShift(null);
        } catch (error) {
            alert("Failed to update shift");
        }
    };

    const getAssignedEmployees = (shiftId: string) => {
        return employees.filter(e => e.shift_id === shiftId);
    };

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Shift</h1>
                    <p className="text-slate-500 text-sm">Atur dan tetapkan jadwal kerja untuk tim Anda.</p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-blue-900 hover:bg-blue-800 text-white cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Shift Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleCreateShift}>
                            <DialogHeader>
                                <DialogTitle>Buat Shift Baru</DialogTitle>
                                <DialogDescription>
                                    Tentukan jam kerja untuk shift ini.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Nama Shift</label>
                                    <Input
                                        id="name"
                                        placeholder="contoh: Shift Pagi"
                                        value={newShift.name}
                                        onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="start" className="text-sm font-medium">Waktu Mulai</label>
                                        <TimePicker
                                            value={newShift.start_time}
                                            onChange={(val) => setNewShift({ ...newShift, start_time: val })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="end" className="text-sm font-medium">Waktu Selesai</label>
                                        <TimePicker
                                            value={newShift.end_time}
                                            onChange={(val) => setNewShift({ ...newShift, end_time: val })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="tolerance" className="text-sm font-medium">Toleransi Keterlambatan (Menit)</label>
                                    <Input
                                        id="tolerance"
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={newShift.late_tolerance_minutes}
                                        onChange={(e) => setNewShift({ ...newShift, late_tolerance_minutes: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full sm:w-auto">Simpan Shift</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {shifts.map((shift) => (
                                <Card key={shift.id} className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-all duration-200 group">
                                    <CardHeader className="pb-2 bg-white">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                <Clock className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                                    onClick={() => {
                                                        setEditingShift({
                                                            ...shift,
                                                            start_time: shift.start_time.substring(0, 5),
                                                            end_time: shift.end_time.substring(0, 5)
                                                        });
                                                        setIsEditModalOpen(true);
                                                    }}
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                    onClick={() => deleteShift(shift.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CardTitle className="mt-4 text-lg font-semibold">{shift.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 font-medium">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-mono">
                                                {shift.start_time.substring(0, 5)} - {shift.end_time.substring(0, 5)}
                                            </Badge>
                                            {shift.late_tolerance_minutes !== undefined && shift.late_tolerance_minutes > 0 && (
                                                <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">
                                                    Toleransi: {shift.late_tolerance_minutes}m
                                                </Badge>
                                            )}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="bg-white pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Users className="h-4 w-4" />
                                                <span>{shift.employee_count} Karyawan</span>
                                            </div>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-indigo-600 p-0 h-auto font-semibold hover:no-underline"
                                                onClick={() => {
                                                    setSelectedShift(shift);
                                                    setIsAssignModalOpen(true);
                                                }}
                                            >
                                                Kelola Penugasan
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {shifts.length === 0 && (
                                <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                                    <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-900">Belum ada shift</h3>
                                    <p className="text-slate-500">Mulai dengan membuat shift kerja pertama Anda.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Edit Shift Modal */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleUpdateShift}>
                                <DialogHeader>
                                    <DialogTitle>Ubah Shift</DialogTitle>
                                    <DialogDescription>
                                        Perbarui detail untuk shift kerja ini.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="edit-name" className="text-sm font-medium">Nama Shift</label>
                                        <Input
                                            id="edit-name"
                                            value={editingShift?.name || ""}
                                            onChange={(e) => setEditingShift({ ...editingShift, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label htmlFor="edit-start" className="text-sm font-medium">Waktu Mulai</label>
                                            <TimePicker
                                                value={editingShift?.start_time || "09:00"}
                                                onChange={(val) => setEditingShift({ ...editingShift, start_time: val })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label htmlFor="edit-end" className="text-sm font-medium">Waktu Selesai</label>
                                            <TimePicker
                                                value={editingShift?.end_time || "17:00"}
                                                onChange={(val) => setEditingShift({ ...editingShift, end_time: val })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="edit-tolerance" className="text-sm font-medium">Toleransi Keterlambatan (Menit)</label>
                                        <Input
                                            id="edit-tolerance"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={editingShift?.late_tolerance_minutes || 0}
                                            onChange={(e) => setEditingShift({ ...editingShift, late_tolerance_minutes: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full sm:w-auto">Simpan Perubahan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="space-y-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white sticky top-6">
                            <CardHeader className="pb-4 border-b border-slate-100 py-4 px-5 shrink-0 bg-white z-10">
                                <CardTitle className="text-base font-semibold">Pencarian Cepat</CardTitle>
                                <CardDescription>Cari karyawan dan periksa shift yang ditugaskan.</CardDescription>
                                <div className="relative mt-4">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Cari karyawan..."
                                        className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-y-auto max-h-[calc(100vh-20rem)] divide-y divide-slate-50">
                                {filteredEmployees.slice(0, 10).map((employee) => (
                                    <div key={employee.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3 group">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 ring-1 ring-slate-100 shadow-sm">
                                                <AvatarImage src={employee.avatar || undefined} />
                                                <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                                                    {employee.name.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-900 truncate">{employee.name}</p>
                                                <p className="text-[10px] text-slate-500 truncate">{employee.department || "No Department"}</p>
                                            </div>
                                        </div>
                                        {employee.shift_id ? (
                                            <Badge variant="outline" className="text-[8px] sm:text-[10px] font-medium bg-indigo-50/50 text-indigo-700 border-indigo-100 h-5">
                                                {shifts.find(s => s.id === employee.shift_id)?.name || "Ditugaskan"}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] font-medium text-slate-400 border-slate-100 h-5">
                                                Belum ada Shift
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>Tetapkan Karyawan ke {selectedShift?.name}</DialogTitle>
                        <DialogDescription>
                            Pilih karyawan untuk ditetapkan ke shift {selectedShift?.start_time.substring(0, 5)} - {selectedShift?.end_time.substring(0, 5)}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-0">
                        <div className="relative mb-4">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari karyawan..."
                                className="pl-9 h-10 text-sm bg-slate-50 border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                            {filteredEmployees.map((employee) => (
                                <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={employee.avatar || undefined} />
                                            <AvatarFallback>{employee.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{employee.name}</p>
                                            <p className="text-xs text-slate-500">{employee.department}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant={employee.shift_id === selectedShift?.id ? "secondary" : "outline"}
                                        size="sm"
                                        className={cn(
                                            "h-8 text-xs font-semibold transition-all duration-200",
                                            employee.shift_id === selectedShift?.id && "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white"
                                        )}
                                        onClick={() => assignShift(employee.id, employee.shift_id === selectedShift?.id ? null : selectedShift?.id)}
                                    >
                                        {employee.shift_id === selectedShift?.id ? "Ditugaskan" : "Tetapkan"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                        <Button onClick={() => setIsAssignModalOpen(false)} className="w-full sm:w-auto">Selesai</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
