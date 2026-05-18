"use client";

import Link from "next/link";
import { useGeneratorStore } from "@/lib/store";
import PreviewFrame from "@/components/PreviewFrame";

export default function CreatePage() {
  const { previewHtml, isGenerating, error, projectTitle } = useGeneratorStore();

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-[#050505] dark:text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Create</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
              {projectTitle || "Generated Website"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100 text-center">
            {error}
          </div>
        )}

        {!isGenerating && !previewHtml ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            No preview yet. Go back and click Send to generate.
          </div>
        ) : (
          <PreviewFrame />
        )}
      </div>
    </div>
  );
}
