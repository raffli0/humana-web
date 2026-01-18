"use client";

import { useState, useEffect } from "react";
import { Search, Upload, UserPlus, Mail, Phone, Loader2, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Label } from "../../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
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

import { authService } from "@/src/infrastructure/auth/authService";
import { useEmployeeViewModel } from "@/src/presentation/hooks/useEmployeeViewModel";
import { Employee } from "@/src/domain/employee/employee";

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  name: string;
  department_id: string | null;
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export default function Employees() {
  const {
    employees,
    departments,
    positions,
    loading,
    isSubmitting: viewModelSubmitting,
    updateEmployee: vmUpdateEmployee,
    inviteEmployee: vmInviteEmployee,
    setEmployees
  } = useEmployeeViewModel();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);

  // Invite form state
  const [inviteDeptId, setInviteDeptId] = useState<string>("");
  const [invitePosId, setInvitePosId] = useState<string>("");

  // View detail state
  const [viewEmployee, setViewEmployee] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleInviteEmployee(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const profile = await authService.getCurrentProfile();
      if (!profile?.company_id) throw new Error("No company associated with your account");

      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      await vmInviteEmployee({
        email: email,
        full_name: fullName,
        company_id: profile.company_id,
        role: "employee",
        token: token,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
        department_id: inviteDeptId || null,
        position_id: invitePosId || null,
      });

      const link = `${window.location.origin}/activate-account?token=${token}`;
      setInvitationLink(link);
      console.log("📧 Employee Invitation Link:", link);

      form.reset();
      setInviteDeptId("");
      setInvitePosId("");
    } catch (err: any) {
      alert(err.message || "Failed to send invitation");
    }

    setIsSubmitting(false);
  }

  async function handleUpdateEmployee(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    if (!viewEmployee) return;

    try {
      await vmUpdateEmployee({
        id: viewEmployee.id,
        name: viewEmployee.name,
        phone: viewEmployee.phone,
        department: viewEmployee.department,
        position: viewEmployee.position,
        status: viewEmployee.status
      });

      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to update employee");
    }

    setIsSubmitting(false);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  // Filter positions by selected department
  const filteredPositions = inviteDeptId
    ? positions.filter((p: any) => p.department_id === inviteDeptId)
    : positions;

  const departmentFilters = ["All", ...new Set(employees.map((e: any) => e.department).filter(Boolean) as string[])];

  const filteredEmployees = employees.filter((emp: Employee) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Dialog open={isInviteOpen} onOpenChange={(open) => { setIsInviteOpen(open); if (!open) { setInvitationLink(null); setInviteDeptId(""); setInvitePosId(""); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <UserPlus className="h-4 w-4" /> Invite Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite New Employee</DialogTitle>
                <DialogDescription>
                  Send an activation link to onboard a new team member.
                </DialogDescription>
              </DialogHeader>
              {invitationLink ? (
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 text-sm font-medium">Invitation created!</span>
                  </div>
                  <div className="space-y-2">
                    <Label>Activation Link</Label>
                    <div className="flex gap-2">
                      <Input value={invitationLink} readOnly className="text-xs" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(invitationLink)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share this link with the employee. Valid for 48 hours.
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => { setIsInviteOpen(false); setInvitationLink(null) }}>
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleInviteEmployee} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="john@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={inviteDeptId} onValueChange={(val: string) => { setInviteDeptId(val); setInvitePosId(""); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {departments.length === 0 && (
                      <p className="text-xs text-muted-foreground">No departments yet. Add them in Settings.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select value={invitePosId} onValueChange={setInvitePosId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPositions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {positions.length === 0 && (
                      <p className="text-xs text-muted-foreground">No positions yet. Add them in Settings.</p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full bg-indigo-600" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* View Employee Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Employee" : "Employee Profile"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update employee information." : "Detailed information about the employee."}
            </DialogDescription>
          </DialogHeader>

          {viewEmployee && (
            isEditing ? (
              <form onSubmit={handleUpdateEmployee} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={viewEmployee.name}
                      onChange={(e) => setViewEmployee({ ...viewEmployee, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={viewEmployee.status || "Active"}
                      onValueChange={(val) => setViewEmployee({ ...viewEmployee, status: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={viewEmployee.phone || ""}
                      onChange={(e) => setViewEmployee({ ...viewEmployee, phone: e.target.value })}
                      placeholder="+1 234..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={viewEmployee.email} disabled className="bg-slate-50 text-slate-500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={departments.find(d => d.name === viewEmployee.department)?.id || "custom"}
                      onValueChange={(val) => {
                        const deptName = departments.find(d => d.id === val)?.name || viewEmployee.department;
                        setViewEmployee({ ...viewEmployee, department: deptName });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={viewEmployee.department || "Select..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={viewEmployee.position || ""}
                      onChange={(e) => setViewEmployee({ ...viewEmployee, position: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>Cancel</Button>
                  <Button type="submit" className="bg-indigo-600" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-6 pt-4">
                {/* Header Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 ring-4 ring-slate-50">
                    <AvatarImage src={viewEmployee.avatar} alt={viewEmployee.name} />
                    <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700 font-medium">
                      {viewEmployee.name?.split(" ").map((n: any) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">{viewEmployee.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700">
                        {viewEmployee.position || "No Position"}
                      </Badge>
                      <Badge className={viewEmployee.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {viewEmployee.status || "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">ID: <span className="font-mono text-xs">{viewEmployee.id}</span></p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Email Address</Label>
                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium p-2 bg-slate-50 rounded-md">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {viewEmployee.email}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium p-2 bg-slate-50 rounded-md">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {viewEmployee.phone || "Not provided"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Department</Label>
                    <p className="text-sm font-medium pl-1">{viewEmployee.department || "Unassigned"}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Date Joined</Label>
                    <p className="text-sm font-medium pl-1">{viewEmployee.join_date ? new Date(viewEmployee.join_date).toLocaleDateString('en-US', { dateStyle: 'long' }) : "-"}</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                  <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
                  <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsEditing(true)}>Edit Details</Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Filters & Search */}
          <Card className="border-none shadow-sm ring-1 ring-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  {departmentFilters.map((dept) => (
                    <Button
                      key={dept}
                      variant={selectedDepartment === dept ? "default" : "outline"}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`whitespace-nowrap ${selectedDepartment === dept
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "text-slate-600 border-slate-200"
                        }`}
                      size="sm"
                    >
                      {dept}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee: Employee) => (
              <Card key={employee.id} className="group hover:shadow-md transition-all duration-200 border-none shadow-sm ring-1 ring-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 ring-4 ring-slate-50 mb-4">
                      <AvatarImage src={employee.avatar || undefined} alt={employee.name} />
                      <AvatarFallback className="text-lg bg-indigo-100 text-indigo-700 font-medium">
                        {employee.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 truncate max-w-[200px]">{employee.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{employee.position}</p>
                    </div>

                    {employee.department && (
                      <Badge variant="secondary" className="mt-3 bg-slate-100 text-slate-700 hover:bg-slate-200">
                        {employee.department}
                      </Badge>
                    )}

                    <div className="w-full mt-6 space-y-3 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" /> Email
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 truncate text-left bg-slate-50 p-2 rounded-md">
                        {employee.email}
                      </div>

                      {employee.phone && (
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" /> Phone
                          </span>
                          <span className="text-gray-900">{employee.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full mt-6">
                      <Button
                        variant="outline"
                        className="w-full border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        onClick={() => {
                          setViewEmployee(employee);
                          setIsEditing(false); // Reset edit mode
                          setIsViewOpen(true);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <Card className="border-dashed shadow-none bg-transparent">
              <CardContent className="p-12 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
                <p className="text-gray-600">Try adjusting your filters or invite new employees.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </main>
  );
}
