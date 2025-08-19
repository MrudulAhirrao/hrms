// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Employee, LeaveRequest } from "@/types";
import { LeaveBalanceCards } from "@/components/dashboard/LeaveBalanceCards";
import { LeaveHistoryTable } from "@/components/dashboard/LeaveHistoryTable";
import { ApplyLeaveForm } from "@/components/dashboard/ApplyLeaveForm";
import { AnnouncementsList } from "@/components/common/AnnouncementsList"; // Import

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const [empResponse, historyResponse] = await Promise.all([
          api.get(`/employees/${user.id}`),
          api.get('/leaves/my-history')
        ]);
        setEmployee(empResponse.data);
        setHistory(historyResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !employee) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <ApplyLeaveForm onSuccess={fetchData} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <LeaveBalanceCards balances={employee?.leaveBalances} />
          <AnnouncementsList />
        </div>
        <div className="md:col-span-1">
           <LeaveHistoryTable history={history} />
        </div>
      </div>
    </div>
  );
}