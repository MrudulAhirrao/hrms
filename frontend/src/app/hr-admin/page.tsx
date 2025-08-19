// src/app/hr-admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Employee } from "@/types";
import { PendingRequestsTable } from "@/components/hr/PendingRequestsTable";
import { AddEmployeeForm } from "@/components/hr/AddEmployeeForm";
import { AllEmployeesTable } from "@/components/hr/AllEmployeesTable";
import { PostAnnouncementForm } from "@/components/hr/PostAnnouncementForm"; // Import
import { AnnouncementsList } from "@/components/common/AnnouncementsList"; // Import

export default function HrAdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    // This function will now be used by multiple components to trigger a refresh
    try {
      setLoading(true);
      const empsResponse = await api.get('/employees');
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">HR Dashboard</h2>
        <div className="flex space-x-2">
          <PostAnnouncementForm employees={employees} onSuccess={fetchData} />
          <AddEmployeeForm onSuccess={fetchData} />
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-4">Action Required</h3>
        <PendingRequestsTable />
      </section>
      
      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h3 className="text-xl font-semibold mb-4">Announcements</h3>
          <AnnouncementsList />
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-4">Employee Directory</h3>
          <AllEmployeesTable employees={employees} loading={loading} />
        </section>
      </div>
    </div>
  );
}