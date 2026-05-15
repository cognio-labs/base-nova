"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Settings2, ArrowRight, Loader2, FileCode, CheckCircle2, Eye, Code2, Save, Wrench, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useGeneratorStore } from "@/lib/store";
import PreviewFrame from "@/components/PreviewFrame";
import SuperagentDashboard from "@/components/SuperagentDashboard";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorInput, setErrorInput] = useState("");

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
    await generateProject(prompt);
  };

  const handleDebug = async () => {
    if (!errorInput.trim() || isDebugging) return;
    await debugProject(errorInput);
    setIsErrorVisible(false);
    setErrorInput("");
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-20">
      {/* Cinematic Background Layer */}
      <div className="cinematic-bg" />
      
      {/* Pulsating Neon Orbs */}
      <div className="pulsating-orb w-[500px] h-[500px] bg-blue-500/10 -top-40 -left-40" />
      <div className="pulsating-orb w-[400px] h-[400px] bg-magenta-500/10 bottom-20 -right-20" style={{ animationDelay: '2s' }} />
      <div className="pulsating-orb w-[300px] h-[300px] bg-teal-500/10 top-1/2 left-1/3" style={{ animationDelay: '4s' }} />

      <div className="max-w-7xl w-full text-center z-10">
        {!generatedFiles.length ? (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 text-xs font-bold text-blue-400 mb-8 tracking-widest uppercase shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                <div className="relative w-5 h-5">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>
                LokoAI Superagents Active
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
                Code the <span className="brand-text-gradient">Future.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group mt-10"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-magenta-500 to-teal-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative glass-frosted p-6 md:p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl border-white/20">
                <div className="flex items-start gap-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision (e.g., 'A neural-interface dashboard for IoT devices')"
                    className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-white placeholder-gray-500 resize-none min-h-[140px] font-medium"
                  />
                </div>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="flex gap-4">
                    <button className="p-3 rounded-xl glass hover:bg-white/10 text-blue-400 transition-all">
                      <Plus className="w-6 h-6" />
                    </button>
                    <button className="p-3 rounded-xl glass hover:bg-white/10 text-magenta-400 transition-all">
                      <Settings2 className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {error && <span className="text-xs text-red-400 font-bold uppercase tracking-widest">{error}</span>}
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="p-5 rounded-2xl brand-btn shadow-[0_0_30px_rgba(0,210,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="text-sm font-black uppercase tracking-widest">Orchestrating Agents...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-black uppercase tracking-widest px-2">Initiate Build</span>
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <SuperagentDashboard />
          </div>
        ) : (
          /* Result Section with Futuristic Layout */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-left"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div className="flex-1">
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{projectTitle || "Project Zero"}</h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-teal-400 font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5" />
                    {debugMessage ? debugMessage : `System integrity: 100% • ${generatedFiles.length} files`}
                  </div>
                  {saveMessage && (
                    <div className="text-xs text-blue-400 font-black bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                      {saveMessage}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsErrorVisible(!isErrorVisible)}
                  disabled={isDebugging}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl glass hover:bg-white/10 text-sm font-black uppercase tracking-widest transition-all border ${
                    isErrorVisible ? "border-magenta-500 text-magenta-500 shadow-[0_0_15px_rgba(255,0,255,0.2)]" : "border-white/10 text-gray-400"
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                  Self-Heal
                </button>
                <button 
                  onClick={saveToWorkspace}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl glass hover:bg-white/10 text-sm font-black uppercase tracking-widest text-white transition-all border border-white/20 shadow-xl"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-blue-400" />}
                  Deploy Local
                </button>
                <div className="glass p-1 rounded-2xl flex border border-white/10">
                  <button 
                    onClick={() => setView('preview')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      view === 'preview' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button 
                    onClick={() => setView('code')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      view === 'code' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    Code
                  </button>
                </div>
              </div>
            </div>

            {/* Debugging Console */}
            <AnimatePresence>
              {isErrorVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-10"
                >
                  <div className="glass-frosted p-8 rounded-[2rem] border-magenta-500/30 flex flex-col gap-6 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
                    <div className="flex items-center gap-3 text-magenta-400 mb-2">
                      <AlertCircle className="w-6 h-6" />
                      <h4 className="font-black uppercase tracking-widest">Diagnostic Report Needed</h4>
                    </div>
                    <textarea 
                      value={errorInput}
                      onChange={(e) => setErrorInput(e.target.value)}
                      placeholder="Paste anomalies or error logs here..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder-gray-500 min-h-[120px] focus:ring-1 focus:ring-magenta-500/50 transition-all font-mono"
                    />
                    <div className="flex justify-end gap-6">
                      <button 
                        onClick={() => setIsErrorVisible(false)}
                        className="px-6 py-3 text-xs font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                      >
                        Abort
                      </button>
                      <button 
                        onClick={handleDebug}
                        disabled={isDebugging || !errorInput.trim()}
                        className="px-8 py-3 brand-btn rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50 uppercase tracking-widest shadow-xl"
                      >
                        {isDebugging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wrench className="w-5 h-5" />}
                        Apply Neural Fix
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* File List */}
              <div className="lg:col-span-1 glass rounded-[2rem] p-8 border-white/5 h-fit shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Structural Nodes</h3>
                <div className="flex flex-col gap-3">
                  {generatedFiles.map((file) => (
                    <div key={file.path} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group">
                      <FileCode className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] text-gray-400 font-mono truncate">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Panel */}
              <div className="lg:col-span-3 min-h-[700px] flex flex-col">
                {view === 'preview' ? (
                  <div className="flex-1 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                    <PreviewFrame />
                  </div>
                ) : (
                  <div className="glass-frosted rounded-[2.5rem] p-8 border-white/10 bg-[#020617]/80 flex-1 overflow-auto shadow-2xl">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-6">
                        <span className="text-xs font-mono text-blue-400 tracking-wider uppercase">{generatedFiles[0].path}</span>
                        <button className="text-[10px] uppercase font-black tracking-widest text-magenta-400 hover:text-magenta-300 transition-colors">Clone Buffer</button>
                    </div>
                    <pre className="text-sm font-mono text-gray-400 leading-relaxed">
                        <code>{generatedFiles[0].content}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
