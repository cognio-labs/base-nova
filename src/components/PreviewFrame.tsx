"use client";

import { useGeneratorStore } from "@/lib/store";
import { HelpCircle, Loader2, MessageCircle } from "lucide-react";

type PreviewFrameProps = {
  iframeKey?: string | number;
  className?: string;
  iframeClassName?: string;
};

function PreviewSkeleton() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-[inherit] bg-gradient-to-br from-sky-50 via-white to-slate-50 p-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
          <div className="h-3 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="space-y-3">
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-5 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-28 rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function PreviewFrame({ iframeKey, className, iframeClassName }: PreviewFrameProps) {
  const { previewHtml, isGenerating } = useGeneratorStore();

  if (isGenerating && !previewHtml) {
    return (
      <div className={"h-full min-h-0 rounded-[inherit] overflow-hidden " + (className ?? "")}>
        <PreviewSkeleton />
      </div>
    );
  }

  if (!previewHtml) {
    return (
      <div className={"relative flex h-full min-h-0 items-center justify-center rounded-[inherit] bg-[#1f1f22] p-8 text-center text-zinc-400 " + (className ?? "") }>
        <div>
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center text-6xl font-black italic tracking-tighter text-zinc-400/80">
            b
          </div>
          <p className="text-base font-medium text-zinc-400">Your preview will appear here</p>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-8 text-sm font-medium text-sky-500">
          <a className="inline-flex items-center gap-1.5 transition hover:text-sky-400" href="#" onClick={(event) => event.preventDefault()}>
            <HelpCircle className="h-4 w-4" />
            Help Center
          </a>
          <a className="inline-flex items-center gap-1.5 transition hover:text-sky-400" href="#" onClick={(event) => event.preventDefault()}>
            <MessageCircle className="h-4 w-4" />
            Join our Community
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={"h-full min-h-0 overflow-hidden rounded-[inherit] bg-white shadow-2xl " + (className ?? "") }>
      <iframe
        title="LokoAI Sandbox"
        key={iframeKey}
        srcDoc={previewHtml}
        className={"h-full w-full border-none " + (iframeClassName ?? "")}
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
}
