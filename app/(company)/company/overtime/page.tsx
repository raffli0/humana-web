"use client";

import { useOvertimeViewModel } from "@/src/presentation/hooks/useOvertimeViewModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Check, Clock, X, MessageSquare, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function OvertimePage() {
    const { requests, loading, updateStatus } = useOvertimeViewModel();
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [adminNote, setAdminNote] = useState("");
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const historyRequests = requests.filter(r => r.status !== 'pending');

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return;

        await updateStatus(
            selectedRequest.id,
            actionType === 'approve' ? 'approved' : 'rejected',
            adminNote
        );

        setSelectedRequest(null);
        setAdminNote("");
        setActionType(null);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Disetujui</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Ditolak</Badge>;
            default:
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Menunggu</Badge>;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Lembur</h1>
                <p className="text-muted-foreground mt-1">Tinjau dan kelola pengajuan lembur karyawan.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <Tabs defaultValue="pending" className="w-full space-y-6">
                    <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl h-12 shadow-sm inline-flex">
                        <TabsTrigger
                            value="pending"
                            className="gap-2 px-6 rounded-xl data-[state=active]:bg-indigo-950 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 relative"
                        >
                            Menunggu Persetujuan
                            {pendingRequests.length > 0 && (
                                <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white border-none h-5 px-1.5 rounded-full">
                                    {pendingRequests.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="gap-2 px-6 rounded-xl data-[state=active]:bg-indigo-950 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                        >
                            Riwayat Pengajuan
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4">
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                                <Clock className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">Tidak ada pengajuan baru</h3>
                                <p className="text-slate-500">Semua pengajuan lembur telah ditinjau.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingRequests.map((req) => (
                                    <Card key={req.id} className="overflow-hidden border-none shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-all">
                                        <CardHeader className="bg-white pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg font-semibold">{req.employee_name}</CardTitle>
                                                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {format(new Date(req.overtime_date), 'dd MMMM yyyy', { locale: id })}
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="font-mono">
                                                    {req.duration_minutes} Menit
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="bg-slate-50/50 pt-4 space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alasan</p>
                                                <p className="text-sm text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                                                    {req.reason}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                                            onClick={() => {
                                                                setSelectedRequest(req);
                                                                setActionType('reject');
                                                            }}
                                                        >
                                                            <X className="w-4 h-4 mr-2" /> Tolak
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Tolak Pengajuan Lembur</DialogTitle>
                                                            <DialogDescription>
                                                                Apakah Anda yakin ingin menolak pengajuan lembur dari {req.employee_name}?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <label className="text-sm font-medium mb-2 block">Catatan (Opsional)</label>
                                                            <Input
                                                                placeholder="Alasan penolakan..."
                                                                value={adminNote}
                                                                onChange={(e) => setAdminNote(e.target.value)}
                                                            />
                                                        </div>
                                                        <DialogFooter>
                                                            <Button variant="destructive" onClick={handleAction}>Tolak Pengajuan</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            className="w-full bg-indigo-950 hover:bg-indigo-900 text-white"
                                                            onClick={() => {
                                                                setSelectedRequest(req);
                                                                setActionType('approve');
                                                            }}
                                                        >
                                                            <Check className="w-4 h-4 mr-2" /> Setujui
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Setujui Pengajuan Lembur</DialogTitle>
                                                            <DialogDescription>
                                                                Setujui pengajuan lembur dari {req.employee_name} selama {req.duration_minutes} menit.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <label className="text-sm font-medium mb-2 block">Catatan (Opsional)</label>
                                                            <Input
                                                                placeholder="Tambahkan catatan..."
                                                                value={adminNote}
                                                                onChange={(e) => setAdminNote(e.target.value)}
                                                            />
                                                        </div>
                                                        <DialogFooter>
                                                            <Button onClick={handleAction} className="bg-indigo-950 text-white">Konfirmasi Persetujuan</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history">
                        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Karyawan</th>
                                            <th className="px-6 py-4 font-medium">Tanggal</th>
                                            <th className="px-6 py-4 font-medium">Durasi</th>
                                            <th className="px-6 py-4 font-medium">Alasan</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Catatan Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {historyRequests.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                    Belum ada riwayat pengajuan lembur
                                                </td>
                                            </tr>
                                        ) : (
                                            historyRequests.map((req) => (
                                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{req.employee_name}</td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {format(new Date(req.overtime_date), 'dd MMM yyyy', { locale: id })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="font-mono bg-slate-50">
                                                            {req.duration_minutes}m
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={req.reason}>
                                                        {req.reason}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={req.status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 italic">
                                                        {req.admin_note || "-"}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </main>
    );
}
