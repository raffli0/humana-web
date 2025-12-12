"use client"

import { useState } from "react";
import { Search, Plus, Calendar, FileText, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { leaveRequests } from "../utils/mockData";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { rejects } from "assert";


export default function LeaveRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const statuses = ["All", "Pending", "Approved", "Rejected"];

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Annual Leave":
        return "bg-blue-100 text-blue-700";
      case "Sick Leave":
        return "bg-purple-100 text-purple-700";
      case "Personal Leave":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const pendingCount = leaveRequests.filter(r => r.status === "Pending").length;
  const approvedCount = leaveRequests.filter(r => r.status === "Approved").length;

  return (
    <main className="min-h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Leave Requests</h2>
          <p className="mt-1 text-sm text-gray-600">Manage employee leave applications</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Requests</p>
                <p className="text-gray-900 mt-1">{leaveRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending</p>
                <p className="text-gray-900 mt-1">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Approved</p>
                <p className="text-gray-900 mt-1">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Rejected</p>
                <p className="text-gray-900 mt-1">
                  {leaveRequests.filter(r => r.status === "Rejected").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by employee name or leave type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map(status => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? "bg-blue-600" : ""}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-gray-900">{request.employeeName}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge className={getTypeColor(request.type)}>
                        {request.type}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{request.reason}</p>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {request.startDate} - {request.endDate}
                        </span>
                      </div>
                      <span>Duration: {request.days} days</span>
                      <span>Requested: {request.requestDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {request.status === "Pending" && (
                    <>
                      {/* <Button variant="outline" className="text-red-600 hover:bg-red-50">
                        Reject
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button> */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-red-600 hover:bg-red-50">
                            Reject
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reject this request?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone. The employee will be notified of this rejection.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              // onClick={}
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Approve Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Approve this request?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              Once approved, this request will be marked as completed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              className="bg-green-600 hover:bg-green-700 text-white"
                              // onClick={ }
                            >
                              Approve
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">No leave requests found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
