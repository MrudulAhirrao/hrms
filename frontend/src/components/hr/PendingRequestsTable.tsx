// src/components/hr/PendingRequestsTable.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Employee, LeaveRequest } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function PendingRequestsTable() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [reqsResponse, empsResponse] = await Promise.all([
        api.get('/leaves/pending'),
        api.get('/employees')
      ]);
      setRequests(reqsResponse.data);
      setEmployees(empsResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getEmployeeName = (employeeId: string) => {
    return employees.find(e => e.id === employeeId)?.name || 'Unknown';
  };

  const handleAction = async (requestId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    try {
      await api.patch(`/leaves/${requestId}/action`, {
        status,
        rejectionReason: reason,
      });
      fetchData(); // Refetch data to update the list
      if (status === 'REJECTED') {
        setSelectedRequest(null); // Close dialog
        setRejectionReason("");
      }
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} request:`, error);
      alert(`Error: Could not process the request.`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Leave Requests</CardTitle>
        <CardDescription>Review and take action on new leave applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : requests.length > 0 ? requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{getEmployeeName(req.employeeId)}</TableCell>
                <TableCell>{req.startDate} to {req.endDate}</TableCell>
                <TableCell className="capitalize">{req.leaveType}</TableCell>
                <TableCell>{req.reason}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" className="bg-green-100 hover:bg-green-200" onClick={() => handleAction(req.id, 'APPROVED')}>
                    <Check className="h-4 w-4 text-green-700" />
                  </Button>
                  
                  <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-red-100 hover:bg-red-200" onClick={() => setSelectedRequest(req)}>
                        <X className="h-4 w-4 text-red-700" />
                      </Button>
                    </DialogTrigger>
                    {selectedRequest?.id === req.id && (
                       <DialogContent>
                         <DialogHeader>
                           <DialogTitle>Reject Leave Request</DialogTitle>
                           <DialogDescription>
                             Please provide a reason for rejecting this request. This will be visible to the employee.
                           </DialogDescription>
                         </DialogHeader>
                         <div className="py-4">
                           <Label htmlFor="reason">Rejection Reason</Label>
                           <Textarea id="reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Critical project deadline conflict." />
                         </div>
                         <DialogFooter>
                           <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                           <Button variant="destructive" onClick={() => handleAction(selectedRequest.id, 'REJECTED', rejectionReason)}>Confirm Reject</Button>
                         </DialogFooter>
                       </DialogContent>
                    )}
                  </Dialog>

                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={5} className="text-center">No pending requests.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}