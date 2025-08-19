// src/components/common/AnnouncementsList.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  employeeId: string | null;
}

export function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/announcements');
      const sorted = response.data.sort((a: Announcement, b: Announcement) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAnnouncements(sorted);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Updates and messages from the HR department.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length > 0 ? (
          announcements.map(ann => (
            <Dialog key={ann.id}>
              <DialogTrigger asChild>
                <div className="border p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold truncate pr-4">{ann.title}</h4>
                    {!ann.employeeId && <Badge variant="secondary">PUBLIC</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {ann.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(ann.createdAt).toLocaleDateString()}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle>{ann.title}</DialogTitle>
                    {!ann.employeeId && <Badge variant="secondary">PUBLIC</Badge>}
                  </div>
                  <DialogDescription>
                    Posted on {new Date(ann.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 whitespace-pre-wrap">
                  {ann.message}
                </div>
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <p>No announcements found.</p>
        )}
      </CardContent>
    </Card>
  );
}