// src/components/dashboard/LeaveHistoryTable.tsx
"use client";

import { LeaveRequest } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LeaveHistoryTableProps {
  history: LeaveRequest[];
}

const StatusBadge = ({ status }: { status: LeaveRequest['status'] }) => {
  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    APPROVED: "bg-green-100 text-green-800 hover:bg-green-100",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  };
  return <Badge variant="outline" className={statusStyles[status]}>{status}</Badge>;
};

export function LeaveHistoryTable({ history }: LeaveHistoryTableProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Leave Request History</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Dates</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-center">Days</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.length > 0 ? history.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell>{req.startDate} to {req.endDate}</TableCell>
                            <TableCell className="capitalize">{req.leaveType}</TableCell>
                            <TableCell className="text-center">{req.leaveDays}</TableCell>
                            <TableCell><StatusBadge status={req.status} /></TableCell>
                            <TableCell>{req.reason}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No leave history found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}

// We need to add Card components to this file as well
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";