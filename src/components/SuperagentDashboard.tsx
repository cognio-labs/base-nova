"use client";

import { useGeneratorStore } from "@/lib/store";
import { motion } from "framer-motion";
import { UserCheck, Palette, Code, ShieldCheck, CheckCircle2 } from "lucide-react";

const agentIcons = [UserCheck, Palette, Code, ShieldCheck];

export default function SuperagentDashboard() {
  const { workflowLogs, activeAgentIndex, isGenerating } = useGeneratorStore();

  if (!isGenerating && activeAgentIndex === -1) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 glass p-8 rounded-3xl border-orange-500/20 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Collaboration in Progress</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {workflowLogs.map((log, index) => {
          const Icon = agentIcons[index];
          const isActive = activeAgentIndex === index;
          const isDone = activeAgentIndex > index || (!isGenerating && activeAgentIndex === -1);

          return (
            <motion.div
              key={log.agent}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-5 rounded-2xl border transition-all duration-500 ${
                isActive 
                  ? "bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/10 scale-105" 
                  : isDone 
                    ? "bg-green-500/5 border-green-500/20 opacity-60" 
                    : "bg-white/5 border-white/5 opacity-40"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive ? "bg-orange-500 text-white" : isDone ? "bg-green-500 text-white" : "bg-white/10 text-gray-500"
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-tight mb-1 ${
                    isActive ? "text-orange-500" : isDone ? "text-green-500" : "text-gray-500"
                  }`}>
                    {log.agent}
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {log.action}
                  </p>
                </div>
              </div>
              
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
