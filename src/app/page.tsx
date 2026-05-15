"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Settings2, ArrowRight, Loader2, FileCode, CheckCircle2, Eye, Code2 } from "lucide-react";
import { useState } from "react";
import { useGeneratorStore } from "@/lib/store";
import PreviewFrame from "@/components/PreviewFrame";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const { generateProject, isGenerating, generatedFiles, projectTitle, error, view, setView } = useGeneratorStore();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    await generateProject(prompt);
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                LokoAI Engine is Online
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
                          <span className="text-sm font-bold">Building...</span>
                        </>
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Result Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-left"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{projectTitle || "Generated Project"}</h2>
                <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully generated {generatedFiles.length} files
                </div>
              </div>
              
              <div className="flex items-center gap-3">
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
