import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { ShiftSwap } from "@/src/domain/shift/shift";

interface ShiftSwapListProps {
    swaps: ShiftSwap[];
    onUpdateStatus: (id: string, status: string, adminNote?: string) => Promise<void>;
}

export function ShiftSwapList({ swaps, onUpdateStatus }: ShiftSwapListProps) {
    const [selectedSwap, setSelectedSwap] = useState<ShiftSwap | null>(null);
    const [action, setAction] = useState<"approve" | "reject" | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleActionClick = (swap: ShiftSwap, actionType: "approve" | "reject") => {
        setSelectedSwap(swap);
        setAction(actionType);
        setAdminNote("");
    };

    const handleConfirm = async () => {
        if (!selectedSwap || !action) return;

        setIsSubmitting(true);
        try {
            const status = action === "approve" ? "approved" : "rejected";
            await onUpdateStatus(selectedSwap.id, status, adminNote);
            setSelectedSwap(null);
            setAction(null);
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Requester</TableHead>
                        <TableHead>Shift Date</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {swaps.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No shift swap requests found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        swaps.map((swap) => (
                            <TableRow key={swap.id}>
                                <TableCell className="font-medium">
                                    {swap.requester_name}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(swap.my_shift_date), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{swap.target_user_name || "Anyone"}</span>
                                        {swap.target_shift_date && (
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(swap.target_shift_date), "MMM d, yyyy")}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate" title={swap.reason}>
                                    {swap.reason || "-"}
                                </TableCell>
                                <TableCell>{getStatusBadge(swap.status)}</TableCell>
                                <TableCell className="text-right">
                                    {swap.status === "pending" && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                onClick={() => handleActionClick(swap, "reject")}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleActionClick(swap, "approve")}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Dialog open={!!selectedSwap} onOpenChange={(open) => !open && setSelectedSwap(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {action === "approve" ? "Approve Swap Request" : "Reject Swap Request"}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {action} this request from {selectedSwap?.requester_name}?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Admin Note (Optional)</label>
                            <Textarea
                                placeholder="Reason for approval/rejection..."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedSwap(null)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={action === "reject" ? "destructive" : "default"}
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className={action === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                            {isSubmitting ? "Processing..." : action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
