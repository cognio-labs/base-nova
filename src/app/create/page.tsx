"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { readPendingBuilderPrompt, clearPendingBuilderPrompt } from "@/lib/builder-session";

export default function CreatePage() {
  const router = useRouter();
  const didCreate = useRef(false);

  useEffect(() => {
    if (didCreate.current) return;
    didCreate.current = true;

    const pending = readPendingBuilderPrompt();
    clearPendingBuilderPrompt();

    async function createAndRedirect() {
      try {
        // Create a new project in Supabase
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "New Design",
            prompt: pending || "",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const projectId = data.project?.id;
          if (projectId) {
            // Store pending prompt for the new project page
            if (pending) {
              sessionStorage.setItem(`lokoai.pending.${projectId}`, pending);
            }
            router.replace(`/build/${projectId}`);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to create project:", e);
      }

      // Fallback: generate a local ID and go anyway
      const localId = crypto.randomUUID();
      if (pending) {
        sessionStorage.setItem(`lokoai.pending.${localId}`, pending);
      }
      router.replace(`/build/${localId}`);
    }

    void createAndRedirect();
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
        <p className="text-sm font-medium text-slate-400">Setting up your workspace...</p>
      </div>
    </div>
  );
}
