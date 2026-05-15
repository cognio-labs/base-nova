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
    debugMessage,
    activeAgentIndex
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
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full text-center z-10">
        {!generatedFiles.length ? (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-8">
                <div className="relative w-4 h-4">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>
                LokoAI Superagents Online
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                What will you <span className="brand-text-gradient">build</span> next?
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group mt-10"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass p-4 md:p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
                <div className="flex items-start gap-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the app you want to create (e.g., 'A modern CRM dashboard with dark mode and analytics cards')"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg md:text-xl text-white placeholder-gray-500 resize-none min-h-[120px]"
                  />
                </div>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                      <Settings2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="p-3 rounded-xl brand-btn shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    <div className="text-xs text-orange-500 font-bold bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
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
                    isErrorVisible ? "border-orange-500 text-orange-500" : "border-white/10 text-gray-400"
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  Fix with AI
                </button>
                <button 
                  onClick={saveToWorkspace}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/5 text-sm font-bold text-white transition-all border border-white/10"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-orange-500" />}
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
                  className="px-6 py-3 rounded-xl brand-btn text-sm font-bold transition-all shadow-lg shadow-orange-500/20"
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
                  <div className="glass p-6 rounded-2xl border-orange-500/30 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h4 className="font-bold">What's wrong?</h4>
                    </div>
                    <textarea 
                      value={errorInput}
                      onChange={(e) => setErrorInput(e.target.value)}
                      placeholder="Describe the error or paste the console log here..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 min-h-[100px] focus:ring-1 focus:ring-orange-500/50 transition-all"
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
                        Apply Self-Healing Fix
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
                    <div key={file.path} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                      <FileCode className="w-4 h-4 text-orange-500" />
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
                        <span className="text-xs font-mono text-gray-500">{generatedFiles[0].path}</span>
                        <button className="text-[10px] uppercase font-bold text-orange-500 hover:text-orange-400">Copy Code</button>
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
    </div>
  );
}
