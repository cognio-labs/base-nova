"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Settings2, ArrowRight, Loader2, FileCode, CheckCircle2, Eye, Code2, Save, Wrench, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useGeneratorStore } from "@/lib/store";
import PreviewFrame from "@/components/PreviewFrame";
import SuperagentDashboard from "@/components/SuperagentDashboard";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const creationPrompts = {
  primary: [
    {
      label: "Tasks & Workflows",
      prompt:
        "Create a polished tasks and workflows web app with a dashboard, task board, priority filters, automation status, team assignments, due dates, and a clean productivity-focused interface.",
    },
    {
      label: "CRM & Sales",
      prompt:
        "Create a modern CRM and sales web app with leads, deal pipeline, customer profiles, revenue metrics, follow-up tasks, and a professional sales dashboard.",
    },
    {
      label: "Content & Sites",
      prompt:
        "Create a content and websites management web app with site pages, content calendar, SEO checklist, publishing workflow, analytics cards, and an elegant editorial interface.",
    },
    {
      label: "Finance",
      prompt:
        "Create a finance web app with expense tracking, income overview, budget categories, cash-flow charts, recent transactions, and a secure financial dashboard style.",
    },
    {
      label: "Booking",
      prompt:
        "Create a booking web app with service listings, availability calendar, appointment scheduling, customer details, booking status, and a smooth reservation flow.",
    },
  ],
  more: [
    {
      label: "E-Commerce",
      prompt:
        "Create an e-commerce website with product grid, featured product section, cart summary, category filters, checkout call to action, and a premium shopping experience.",
    },
    {
      label: "Projects",
      prompt:
        "Create a project management web app with project overview, milestones, task progress, team members, timeline, status reporting, and a focused operations dashboard.",
    },
    {
      label: "Events & Community",
      prompt:
        "Create an events and community website with upcoming events, member highlights, RSVP flow, discussion sections, event categories, and a friendly community design.",
    },
    {
      label: "Wellness",
      prompt:
        "Create a wellness website with habit tracking, daily plans, meditation sessions, progress cards, coach recommendations, and a calm health-focused interface.",
    },
    {
      label: "Operations",
      prompt:
        "Create an operations dashboard web app with process tracking, inventory or resource status, alerts, team workload, performance metrics, and a clear command-center layout.",
    },
  ],
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorInput, setErrorInput] = useState("");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();

  const { 
    generateProject, 
    isGenerating, 
    generatedFiles, 
    projectTitle, 
    error, 
    view, 
    setView,
    saveToWorkspace,
    isSaving,
    saveMessage,
    debugProject,
    isDebugging,
    debugMessage
  } = useGeneratorStore();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    await generateProject(prompt);
  };

  const handleCategoryGenerate = async (categoryPrompt: string) => {
    if (isGenerating) return;
    setPrompt(categoryPrompt);
    setIsMoreOpen(false);
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    await generateProject(categoryPrompt);
  };

  const handleDebug = async () => {
    if (!errorInput.trim() || isDebugging) return;
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    await debugProject(errorInput);
    setIsErrorVisible(false);
    setErrorInput("");
  };

  const handleSaveToWorkspace = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    await saveToWorkspace();
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Orbs with Asmani & White Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-sky-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full text-center z-10">
        {!generatedFiles.length ? (
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-sky-200/70 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-gray-400 mb-8 shadow-sm">
                <span className="text-sky-600 dark:text-sky-300 font-semibold">LokoAI Superagents Online</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 dark:text-white mb-6">
                What will you <span className="brand-text-gradient">build</span> next?
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group mt-10"
            >
              {/* Outer Glow in Asmani/White */}
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-sky-400/30 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative glass p-4 md:p-6 rounded-2xl flex flex-col gap-4 shadow-2xl border-sky-100/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.02]">
                <div className="flex items-start gap-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the app you want to create (e.g., 'A modern CRM dashboard with dark mode and analytics cards')"
                    className="w-full bg-transparent !border-none focus:ring-0 focus:!outline-none text-lg md:text-xl text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-gray-500 resize-none min-h-[72px]"
                  />
                </div>
                
                <div className="flex items-center justify-between border-t border-sky-100 dark:border-white/10 pt-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-sky-500/10 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-sky-500/10 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors">
                      <Settings2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="p-3 rounded-xl brand-btn shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-bold">Scaling Agents...</span>
                        </>
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative mt-4 text-left">
                <p className="mb-2 text-xs font-medium text-slate-600 dark:text-gray-400">
                  What would you like to create?
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {creationPrompts.primary.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleCategoryGenerate(item.prompt)}
                      disabled={isGenerating}
                      className="rounded-lg bg-white/85 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/8 dark:text-gray-200 dark:ring-white/10 dark:hover:bg-white/12"
                    >
                      {item.label}
                    </button>
                  ))}

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsMoreOpen((open) => !open)}
                      disabled={isGenerating}
                      className="rounded-lg bg-white/85 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/8 dark:text-gray-200 dark:ring-white/10 dark:hover:bg-white/12"
                      aria-expanded={isMoreOpen}
                      aria-haspopup="menu"
                    >
                      ... More
                    </button>

                    <AnimatePresence>
                      {isMoreOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-left shadow-xl dark:border-white/10 dark:bg-slate-950"
                          role="menu"
                        >
                          {creationPrompts.more.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => handleCategoryGenerate(item.prompt)}
                              className="block w-full px-3 py-2 text-left text-xs font-medium text-slate-800 transition hover:bg-sky-50 hover:text-sky-700 dark:text-gray-200 dark:hover:bg-white/10"
                              role="menuitem"
                            >
                              {item.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <SuperagentDashboard />
          </div>
        ) : (
          /* Result Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-left"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{projectTitle || "Generated Project"}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {debugMessage ? debugMessage : `Successfully generated ${generatedFiles.length} files`}
                  </div>
                  {saveMessage && (
                    <div className="text-xs text-sky-400 font-bold bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 uppercase tracking-widest">
                      {saveMessage}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsErrorVisible(!isErrorVisible)}
                  disabled={isDebugging}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-white/5 text-sm font-bold transition-all border ${
                    isErrorVisible ? "border-sky-500 text-sky-500" : "border-white/10 text-gray-400"
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  Fix with AI
                </button>
                <button 
                  onClick={handleSaveToWorkspace}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/5 text-sm font-bold text-white transition-all border border-white/10"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-sky-400" />}
                  Save to Workspace
                </button>
                <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex">
                  <button 
                    onClick={() => setView('preview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      view === 'preview' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button 
                    onClick={() => setView('code')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      view === 'code' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    Code
                  </button>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 rounded-xl brand-btn text-sm font-bold transition-all shadow-lg shadow-sky-500/20"
                >
                  Create New
                </button>
              </div>
            </div>

            {/* Debugging Console */}
            <AnimatePresence>
              {isErrorVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="glass p-6 rounded-2xl border-sky-500/30 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sky-400 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h4 className="font-bold uppercase tracking-widest">Diagnostic Mode</h4>
                    </div>
                    <textarea 
                      value={errorInput}
                      onChange={(e) => setErrorInput(e.target.value)}
                      placeholder="Describe the error or paste the console log here..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 min-h-[100px] focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setIsErrorVisible(false)}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDebug}
                        disabled={isDebugging || !errorInput.trim()}
                        className="px-6 py-2 brand-btn rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                      >
                        {isDebugging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                        Apply Neural Fix
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* File List */}
              <div className="lg:col-span-1 glass rounded-2xl p-6 border-white/5 h-fit">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Generated Files</h3>
                <div className="flex flex-col gap-2">
                  {generatedFiles.map((file) => (
                    <div key={file.path} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                      <FileCode className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-300 truncate">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Panel */}
              <div className="lg:col-span-3 min-h-[600px] flex flex-col">
                {view === 'preview' ? (
                  <PreviewFrame />
                ) : (
                  <div className="glass rounded-2xl p-6 border-white/5 bg-[#0d0d0d] flex-1 overflow-auto">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                        <span className="text-xs font-mono text-sky-400">{generatedFiles[0].path}</span>
                        <button className="text-[10px] uppercase font-bold text-sky-400 hover:text-sky-300">Copy Code</button>
                    </div>
                    <pre className="text-sm font-mono text-gray-400">
                        <code>{generatedFiles[0].content}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
