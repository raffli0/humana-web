import { useState, useEffect } from "react";
import { Payslip } from "@/src/domain/payroll/payroll";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Separator } from "@/app/components/ui/separator";

interface EditPayslipDialogProps {
    payslip: Payslip | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (id: string, data: Partial<Payslip>) => Promise<void>;
}

export function EditPayslipDialog({ payslip, open, onOpenChange, onSave }: EditPayslipDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        overtime: 0,
        bonus: 0,
        tax_deduction: 0,
        loan_deduction: 0,
    });

    useEffect(() => {
        if (payslip) {
            setFormData({
                overtime: Number(payslip.overtime) || 0,
                bonus: Number(payslip.bonus) || 0,
                tax_deduction: Number(payslip.tax_deduction) || 0,
                loan_deduction: Number(payslip.loan_deduction) || 0,
            });
        }
    }, [payslip]);

    const handleSave = async () => {
        if (!payslip) return;
        setIsLoading(true);
        try {
            // Calculate new totals logic could be here or backend. 
            // For now, we trust the backend/frontend triggers to recalculate, 
            // but here we just send the manual overrides.

            // Re-calculate local totals for display or data integrity if needed:
            // But simplest is to just send the edited fields.
            const updates = {
                overtime: formData.overtime,
                bonus: formData.bonus,
                tax_deduction: formData.tax_deduction,
                loan_deduction: formData.loan_deduction,

                // Recalculate totals just in case the backend relies on them being passed
                allowances:
                    (Number(payslip.position_allowance) || 0) +
                    (Number(payslip.transport_allowance) || 0) +
                    (Number(payslip.meal_allowance) || 0) +
                    (Number(payslip.bpjs_health_allowance) || 0) +
                    (Number(payslip.bpjs_labor_allowance) || 0) +
                    formData.overtime +
                    formData.bonus,

                deductions:
                    (Number(payslip.bpjs_health_deduction) || 0) +
                    (Number(payslip.bpjs_labor_deduction) || 0) +
                    formData.tax_deduction +
                    formData.loan_deduction
            };

            // Recalculate net
            const net_salary = (Number(payslip.basic_salary) || 0) + updates.allowances - updates.deductions;

            await onSave(payslip.id, {
                ...updates,
                net_salary
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    if (!payslip) return null;

    // Live calculation for preview
    const totalAllowances =
        (Number(payslip.position_allowance) || 0) +
        (Number(payslip.transport_allowance) || 0) +
        (Number(payslip.meal_allowance) || 0) +
        (Number(payslip.bpjs_health_allowance) || 0) +
        (Number(payslip.bpjs_labor_allowance) || 0) +
        formData.overtime +
        formData.bonus;

    const totalDeductions =
        (Number(payslip.bpjs_health_deduction) || 0) +
        (Number(payslip.bpjs_labor_deduction) || 0) +
        formData.tax_deduction +
        formData.loan_deduction;

    const netSalary = (Number(payslip.basic_salary) || 0) + totalAllowances - totalDeductions;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Payslip: {payslip.employees?.name}</DialogTitle>
                    <DialogDescription>
                        Adjust manual components for this period. Base salary and fixed allowances remain unchanged.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Lembur (Overtime)</Label>
                            <Input
                                type="number"
                                value={formData.overtime}
                                onChange={(e) => setFormData({ ...formData, overtime: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bonus</Label>
                            <Input
                                type="number"
                                value={formData.bonus}
                                onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Potongan PPh 21</Label>
                            <Input
                                type="number"
                                value={formData.tax_deduction}
                                onChange={(e) => setFormData({ ...formData, tax_deduction: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Potongan Pinjaman</Label>
                            <Input
                                type="number"
                                value={formData.loan_deduction}
                                onChange={(e) => setFormData({ ...formData, loan_deduction: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Gaji Pokok:</span>
                            <span>{formatCurrency(payslip.basic_salary)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Tunjangan:</span>
                            <span className="text-green-600">+{formatCurrency(totalAllowances)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Potongan:</span>
                            <span className="text-red-600">-{formatCurrency(totalDeductions)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
                            <span>Gaji Bersih:</span>
                            <span>{formatCurrency(netSalary)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
