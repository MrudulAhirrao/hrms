"use client";

import { useState } from "react";
import api from "@/lib/api";
import axios from 'axios'; // Import axios
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

interface AddEmployeeFormProps {
  onSuccess: () => void;
}

export function AddEmployeeForm({ onSuccess }: AddEmployeeFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [emailUsername, setEmailUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const email = `${emailUsername}@companyemployee.com`;

    try {
      await api.post('/employees', { name, email, password, department, joiningDate });
      onSuccess();
      setOpen(false);
      setName('');
      setEmailUsername('');
      setPassword('');
      setDepartment('');
      setJoiningDate('');
    } catch (err) { // Changed from catch (err: any)
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to add employee.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter the details for the new employee. An account will be created for them to log in.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <div className="col-span-3 flex items-center">
              <Input id="email" value={emailUsername} onChange={(e) => setEmailUsername(e.target.value)} className="rounded-r-none" placeholder="jane.doe" required />
              <span className="bg-muted text-muted-foreground px-3 py-2 text-sm rounded-r-md border border-l-0">
                @companyemployee.com
              </span>
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" required />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="col-span-3" required />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="joiningDate" className="text-right">Joining Date</Label>
            <Input id="joiningDate" type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="col-span-3" required />
          </div>
          {error && <p className="col-span-4 text-sm text-red-500 text-center">{error}</p>}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Employee'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}