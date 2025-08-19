// src/components/hr/AllEmployeesTable.tsx
"use client";

import { Employee } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AllEmployeesTableProps {
  employees: Employee[];
  loading: boolean;
}

export function AllEmployeesTable({ employees, loading }: AllEmployeesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Directory</CardTitle>
        <CardDescription>A complete list of all employees in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead className="text-right">Casual Leave Balance</TableHead>
              <TableHead className="text-right">Sick Leave Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : employees.length > 0 ? employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.joiningDate}</TableCell>
                <TableCell className="text-right">{emp.leaveBalances.casual}</TableCell>
                <TableCell className="text-right">{emp.leaveBalances.sick}</TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={5} className="text-center">No employees found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}