// src/components/dashboard/LeaveBalanceCards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarOff, HeartPulse } from "lucide-react";

interface LeaveBalanceCardsProps {
  balances: {
    casual: number;
    sick: number;
  } | undefined;
}

export function LeaveBalanceCards({ balances }: LeaveBalanceCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Casual Leave</CardTitle>
          <CalendarOff className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balances?.casual ?? '...'}</div>
          <p className="text-xs text-muted-foreground">days remaining</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
          <HeartPulse className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balances?.sick ?? '...'}</div>
          <p className="text-xs text-muted-foreground">days remaining</p>
        </CardContent>
      </Card>
    </div>
  );
}