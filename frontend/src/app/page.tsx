// src/app/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50">
      <LoginForm />
    </main>
  );
}
