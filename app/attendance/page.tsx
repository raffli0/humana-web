"use client"

import { useState } from "react";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { attendance } from "../utils/mockData";
import AttendanceMap from "../attendance/AttendanceMap";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState("2024-11-24");
  const [selectedAttendance, setSelectedAttendance] = useState(attendance[0]);

  const filteredAttendance = attendance.filter(a => a.date === selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Late":
        return "bg-orange-100 text-orange-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Attendance</h2>
          <p className="text-gray-600">Track employee attendance and locations</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  onClick={() => setSelectedAttendance(record)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAttendance?.id === record.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      <div>
                        <p className="text-gray-900">{record.employeeName}</p>
                        <p className="text-gray-600">{record.employeeId}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Check In</p>
                        <p className="text-gray-900">{record.checkIn || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Check Out</p>
                        <p className="text-gray-900">{record.checkOut || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {record.location && (
                    <div className="flex items-center gap-2 mt-3 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{record.location.address}</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map View */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Map</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceMap
                attendance={filteredAttendance}
                selectedAttendance={selectedAttendance}
                onSelectAttendance={setSelectedAttendance}
              />
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700">Present</p>
                  <p className="text-green-900 mt-1">
                    {filteredAttendance.filter(a => a.status === "Present").length}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-orange-700">Late</p>
                  <p className="text-orange-900 mt-1">
                    {filteredAttendance.filter(a => a.status === "Late").length}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-700">Absent</p>
                  <p className="text-red-900 mt-1">
                    {filteredAttendance.filter(a => a.status === "Absent").length}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700">Total</p>
                  <p className="text-blue-900 mt-1">{filteredAttendance.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
