"use client";

import { useGeneratorStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

export default function PreviewFrame() {
  const { previewHtml, isGenerating } = useGeneratorStore();

  if (isGenerating) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center glass rounded-2xl border-white/5">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-400 font-medium">Preparing Live Sandbox...</p>
      </div>
    );
  }

  if (!previewHtml) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center glass rounded-2xl border-white/5 text-center p-8">
        <p className="text-gray-500">Preview is not available for this project yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] glass rounded-2xl border-white/5 overflow-hidden bg-white shadow-2xl">
      <iframe
        title="LokoAI Sandbox"
        srcDoc={previewHtml}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
}
