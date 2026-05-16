"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const nextPath = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
    }
  }, [isLoading, nextPath, router, user]);

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7dd3fc22,transparent_35%),radial-gradient(circle_at_bottom,#ffffff14,transparent_35%)]" />
      <div className="relative max-w-2xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-sky-500">
          Secure Workspace Access
        </p>
        <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
          Login to build with LokoAI
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-6 text-slate-600 dark:text-gray-400">
          Authenticate with Google, GitHub, phone OTP, or email to open your AI workspace and save generated apps.
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="brand-btn rounded-full px-6 py-3 text-sm shadow-lg shadow-sky-500/20"
        >
          Open Login
        </button>
      </div>
      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
