"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  Boxes,
  ChevronDown,
  Code,
  ExternalLink,
  FileText,
  Folder,
  LayoutPanelTop,
  Play,
  Save,
  Settings,
  Share2,
  Terminal as TerminalIcon,
  User,
  Wand2,
  X,
} from "lucide-react";

import PreviewFrame from "@/components/PreviewFrame";
import { useGeneratorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type TreeNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
};

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "root", path: "", type: "folder", children: [] };

  for (const fullPath of paths) {
    const parts = fullPath.split("/").filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      const nextPath = parts.slice(0, i + 1).join("/");
      const isLast = i === parts.length - 1;

      current.children ??= [];
      let child = current.children.find((c) => c.name === part);

      if (!child) {
        child = {
          name: part,
          path: nextPath,
          type: isLast ? "file" : "folder",
          children: isLast ? undefined : [],
        };
        current.children.push(child);
      }

      current = child;
    }
  }

  const sortNode = (node: TreeNode) => {
    if (!node.children) return;
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortNode);
  };

  sortNode(root);
  return root;
}

function languageFromPath(path: string) {
  if (path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".md")) return "markdown";
  return "plaintext";
}

function FileTree({
  node,
  depth,
  onOpen,
}: {
  node: TreeNode;
  depth: number;
  onOpen: (path: string) => void;
}) {
  const [open, setOpen] = useState(true);

  if (node.type === "file") {
    return (
      <button
        type="button"
        onClick={() => onOpen(node.path)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-200/90 hover:bg-white/10"
        style={{ paddingLeft: 10 + depth * 12 }}
      >
        <FileText className="h-3.5 w-3.5 text-slate-300/80" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  if (!node.children?.length) return null;

  if (node.path === "") {
    return (
      <div className="space-y-0.5">
        {node.children.map((child) => (
          <FileTree key={child.path} node={child} depth={depth} onOpen={onOpen} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-extrabold uppercase tracking-widest text-slate-300/70 hover:bg-white/10"
        style={{ paddingLeft: 10 + depth * 12 }}
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open ? "rotate-0" : "-rotate-90")} />
        <Folder className="h-3.5 w-3.5" />
        <span className="truncate">{node.name}</span>
      </button>
      {open && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <FileTree key={child.path} node={child} depth={depth + 1} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

function ThinkingOverlay() {
  const { isGenerating, workflowLogs, activeAgentIndex } = useGeneratorStore();

  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b0b0b]/80 p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-sky-500/15 text-sky-300 flex items-center justify-center">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">AI Builder</p>
                <p className="text-sm font-extrabold text-white">Creating your app workspace…</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {workflowLogs.map((log, i) => {
                const active = activeAgentIndex === i;
                const done = activeAgentIndex > i;
                return (
                  <div
                    key={log.agent}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3",
                      done
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : active
                          ? "border-sky-500/40 bg-sky-500/10"
                          : "border-white/10 bg-white/5"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-white">{log.agent}</p>
                      <p className="truncate text-[11px] text-slate-300/80">{log.action}</p>
                    </div>
                    <div className={cn("h-2 w-2 rounded-full", done ? "bg-emerald-400" : active ? "bg-sky-400 animate-pulse" : "bg-slate-600")} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BuilderWorkspace() {
  const {
    projectTitle,
    generatedFiles,
    openTabs,
    activeFilePath,
    openFile,
    closeTab,
    getFileContent,
    updateFileContent,
    isSaving,
    saveToWorkspace,
    saveMessage,
    error,
  } = useGeneratorStore();

  const filePaths = useMemo(() => generatedFiles.map((f) => f.path), [generatedFiles]);
  const tree = useMemo(() => buildTree(filePaths.length ? filePaths : ["preview.html"]), [filePaths]);

  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    if (activeFilePath) {
      setEditorValue(getFileContent(activeFilePath));
    }
  }, [activeFilePath, getFileContent]);

  const activeLanguage = activeFilePath ? languageFromPath(activeFilePath) : "plaintext";

  const onChange = (value: string | undefined) => {
    const next = value ?? "";
    setEditorValue(next);
    if (activeFilePath) updateFileContent(activeFilePath, next);
  };

  return (
    <div className="relative h-[calc(100vh-0px)] w-full bg-[#050505] text-white">
      <ThinkingOverlay />

      {/* Top bar */}
      <div className="flex h-14 items-center justify-between border-b border-white/10 bg-white/5 px-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-200">
            <Boxes className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">{projectTitle || "Builder Workspace"}</p>
            <p className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Base44-style IDE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-slate-200 hover:bg-white/10"
          >
            <Play className="h-4 w-4" />
            Deploy
          </button>
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-slate-200 hover:bg-white/10"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-slate-200 hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
            aria-label="User"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="grid h-[calc(100vh-56px)] grid-cols-[260px_1fr_420px]">
        {/* Left sidebar */}
        <aside className="border-r border-white/10 bg-white/5 p-3 overflow-auto">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Explorer</p>
            <LayoutPanelTop className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
              <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Project</p>
              <div className="mt-1">
                <FileTree node={tree} depth={0} onOpen={openFile} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
              <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Shortcuts</p>
              <div className="mt-1 space-y-1">
                {[
                  { label: "Components", icon: Code, path: "components" },
                  { label: "Pages", icon: LayoutPanelTop, path: "app" },
                  { label: "APIs", icon: ExternalLink, path: "app/api" },
                  { label: "Database", icon: Boxes, path: "supabase" },
                  { label: "Assets", icon: Folder, path: "public" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-slate-300/80 hover:bg-white/10">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    <span className="ml-auto text-[10px] text-slate-500">{item.path}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center editor */}
        <section className="flex flex-col border-r border-white/10 bg-[#060606]">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-white/10 bg-white/5 px-2 py-2 overflow-auto">
            {openTabs.length ? (
              openTabs.map((tab) => {
                const active = tab.path === activeFilePath;
                return (
                  <button
                    key={tab.path}
                    type="button"
                    onClick={() => openFile(tab.path)}
                    className={cn(
                      "group flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold",
                      active
                        ? "border-sky-500/40 bg-sky-500/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span className="truncate max-w-[160px]">{tab.title}</span>
                    <span
                      role="button"
                      aria-label="Close tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.path);
                      }}
                      className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-xs font-semibold text-slate-400">Open a file to start editing.</div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => saveToWorkspace()}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-slate-200 hover:bg-white/10 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              theme="vs-dark"
              language={activeLanguage}
              value={editorValue}
              onChange={onChange}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Terminal */}
          <div className="h-44 border-t border-white/10 bg-black/30">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4 w-4 text-slate-300" />
                <p className="text-xs font-extrabold text-slate-200">Terminal</p>
              </div>
              {saveMessage && <p className="text-[11px] font-semibold text-emerald-300">{saveMessage}</p>}
            </div>
            <div className="px-4 py-3 font-mono text-[11px] text-slate-300/80 space-y-1">
              <div>$ lokoai builder ready</div>
              <div>$ open file to edit • preview auto-refreshes when you edit <span className="text-sky-300">preview.html</span></div>
              {error ? <div className="text-red-300">error: {error}</div> : <div className="text-emerald-300">status: ok</div>}
            </div>
          </div>
        </section>

        {/* Right preview */}
        <aside className="flex flex-col bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <LayoutPanelTop className="h-4 w-4 text-slate-300" />
              <p className="text-xs font-extrabold text-slate-200">Live Preview</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-slate-200 hover:bg-white/10"
                onClick={() => openFile("preview.html")}
              >
                Edit Preview
              </button>
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="h-full rounded-3xl border border-white/10 bg-black/20 overflow-hidden">
              <PreviewFrame />
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Responsive</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {["Mobile", "Tablet", "Desktop"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-slate-200 hover:bg-white/10"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
