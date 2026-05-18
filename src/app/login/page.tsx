"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthPanel from "@/components/AuthPanel";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const nextPath = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
    }
  }, [isLoading, nextPath, router, user]);

  if (isLoading) {
    return <LoginLoadingState />;
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7dd3fc22,transparent_35%),radial-gradient(circle_at_bottom,#ffffff14,transparent_35%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 items-stretch gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Secure sign-in
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Welcome Back!
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
            Sign in with Google or GitHub, or use email/OTP to access your workspace.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white/60 px-3 py-1">OAuth 2.0</span>
            <span className="rounded-full border border-slate-200 bg-white/60 px-3 py-1">Encrypted access</span>
            <span className="rounded-full border border-slate-200 bg-white/60 px-3 py-1">Team ready</span>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <AuthPanel nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}

function LoginShell() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7dd3fc22,transparent_35%),radial-gradient(circle_at_bottom,#ffffff14,transparent_35%)]" />
      <div className="relative max-w-2xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-sky-500">Secure Workspace Access</p>
        <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
          Preparing secure login...
        </h1>
      </div>
    </div>
  );
}

function LoginLoadingState() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7dd3fc22,transparent_35%),radial-gradient(circle_at_bottom,#ffffff14,transparent_35%)]" />
      <div className="relative max-w-2xl text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-sky-500">Secure Workspace Access</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
          Checking your session...
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We are verifying your account before continuing.
        </p>
      </div>
    </div>
  );
}
