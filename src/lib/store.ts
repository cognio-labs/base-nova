import { create } from "zustand";

interface GeneratedFile {
  path: string;
  content: string;
}

interface AgentLog {
  agent: string;
  action: string;
}

type EditorTab = {
  path: string;
  title: string;
};

interface GenerationState {
  isGenerating: boolean;
  isSaving: boolean;
  isDebugging: boolean;

  generatedFiles: GeneratedFile[];
  previewHtml: string | null;
  projectTitle: string;
  currentPrompt: string;

  workflowLogs: AgentLog[];
  activeAgentIndex: number;

  view: "code" | "preview";
  error: string | null;
  saveMessage: string | null;
  debugMessage: string | null;

  openTabs: EditorTab[];
  activeFilePath: string | null;

  generateProject: (prompt: string) => Promise<void>;
  saveToWorkspace: () => Promise<void>;
  debugProject: (errorMessage: string) => Promise<void>;

  setView: (view: "code" | "preview") => void;
  reset: () => void;

  openFile: (path: string) => void;
  closeTab: (path: string) => void;
  setActiveFile: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  getFileContent: (path: string) => string;
}

const VIRTUAL_PREVIEW_PATH = "preview.html";

function tabTitle(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

function normalizeFiles(files: GeneratedFile[], previewHtml: string | null): GeneratedFile[] {
  const next = [...files];

  if (previewHtml != null) {
    const existingIndex = next.findIndex((f) => f.path === VIRTUAL_PREVIEW_PATH);
    const virtual: GeneratedFile = { path: VIRTUAL_PREVIEW_PATH, content: previewHtml };
    if (existingIndex >= 0) next[existingIndex] = virtual;
    else next.unshift(virtual);
  }

  return next;
}

export const useGeneratorStore = create<GenerationState>((set, get) => ({
  isGenerating: false,
  isSaving: false,
  isDebugging: false,

  generatedFiles: [],
  previewHtml: null,
  projectTitle: "",
  currentPrompt: "",

  workflowLogs: [],
  activeAgentIndex: -1,

  view: "code",
  error: null,
  saveMessage: null,
  debugMessage: null,

  openTabs: [],
  activeFilePath: null,

  generateProject: async (prompt: string) => {
    set({
      isGenerating: true,
      error: null,
      saveMessage: null,
      currentPrompt: prompt,
      workflowLogs: [
        { agent: "Designing UI", action: "Analyzing requirements..." },
        { agent: "Generating components", action: "Waiting..." },
        { agent: "Creating backend", action: "Waiting..." },
        { agent: "Optimizing app", action: "Waiting..." },
      ],
      activeAgentIndex: 0,
    });

    const simulateAgents = () => {
      setTimeout(
        () =>
          set({
            activeAgentIndex: 1,
            workflowLogs: get().workflowLogs.map((l, i) =>
              i === 1 ? { ...l, action: "Scaffolding pages & layout..." } : l
            ),
          }),
        1200
      );
      setTimeout(
        () =>
          set({
            activeAgentIndex: 2,
            workflowLogs: get().workflowLogs.map((l, i) =>
              i === 2 ? { ...l, action: "Drafting API routes & data layer..." } : l
            ),
          }),
        2600
      );
      setTimeout(
        () =>
          set({
            activeAgentIndex: 3,
            workflowLogs: get().workflowLogs.map((l, i) =>
              i === 3 ? { ...l, action: "Final checks & preview build..." } : l
            ),
          }),
        4200
      );
    };

    simulateAgents();

    try {
      const response = await fetch("/api/superagents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const files = Array.isArray(data.files) ? (data.files as GeneratedFile[]) : [];
      const previewHtml = typeof data.previewHtml === "string" ? data.previewHtml : null;

      const normalized = normalizeFiles(files, previewHtml);
      const initialTabs: EditorTab[] = [];

      for (const candidate of [
        "app/page.tsx",
        "app/layout.tsx",
        "app/dashboard/page.tsx",
        "components/navbar.tsx",
        "components/sidebar.tsx",
        VIRTUAL_PREVIEW_PATH,
      ]) {
        if (normalized.some((f) => f.path === candidate)) {
          initialTabs.push({ path: candidate, title: tabTitle(candidate) });
        }
      }

      const fallbackFirst = normalized[0]?.path ?? null;
      const activeFilePath = initialTabs[0]?.path ?? fallbackFirst;

      set({
        generatedFiles: normalized,
        previewHtml,
        projectTitle: typeof data.projectTitle === "string" ? data.projectTitle : "",
        isGenerating: false,
        activeAgentIndex: -1,
        view: "preview",
        openTabs: initialTabs.length ? initialTabs : activeFilePath ? [{ path: activeFilePath, title: tabTitle(activeFilePath) }] : [],
        activeFilePath,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ error: message, isGenerating: false, activeAgentIndex: -1 });
    }
  },

  saveToWorkspace: async () => {
    const { generatedFiles, projectTitle, previewHtml, currentPrompt } = get();
    const filesOnly = generatedFiles.filter((f) => f.path !== VIRTUAL_PREVIEW_PATH);
    if (!filesOnly.length) return;

    set({ isSaving: true, error: null });
    try {
      const response = await fetch("/api/save-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: filesOnly,
          projectTitle,
          description: currentPrompt,
          previewHtml,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      set({ isSaving: false, saveMessage: data.message });
      setTimeout(() => set({ saveMessage: null }), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ error: message, isSaving: false });
    }
  },

  debugProject: async (errorMessage: string) => {
    const { currentPrompt, generatedFiles } = get();
    set({ isDebugging: true, error: null, debugMessage: "LokoAI Debugger is analyzing..." });

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt, files: generatedFiles, errorMessage }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const nextFiles = Array.isArray(data.files) ? (data.files as GeneratedFile[]) : [];
      const previewHtml = typeof data.previewHtml === "string" ? data.previewHtml : null;
      const normalized = normalizeFiles(nextFiles, previewHtml);

      set({
        generatedFiles: normalized,
        previewHtml,
        isDebugging: false,
        debugMessage: `Fixed: ${data.fixDescription}`,
      });

      await get().saveToWorkspace();
      setTimeout(() => set({ debugMessage: null }), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ error: message, isDebugging: false, debugMessage: null });
    }
  },

  setView: (view) => set({ view }),

  reset: () =>
    set({
      generatedFiles: [],
      previewHtml: null,
      projectTitle: "",
      currentPrompt: "",
      workflowLogs: [],
      activeAgentIndex: -1,
      error: null,
      isGenerating: false,
      view: "code",
      saveMessage: null,
      debugMessage: null,
      openTabs: [],
      activeFilePath: null,
    }),

  openFile: (path) => {
    const { openTabs } = get();
    if (!openTabs.some((t) => t.path === path)) {
      set({ openTabs: [...openTabs, { path, title: tabTitle(path) }] });
    }
    set({ activeFilePath: path });
  },

  closeTab: (path) => {
    const { openTabs, activeFilePath } = get();
    const nextTabs = openTabs.filter((t) => t.path !== path);
    const nextActive = activeFilePath === path ? nextTabs[nextTabs.length - 1]?.path ?? null : activeFilePath;
    set({ openTabs: nextTabs, activeFilePath: nextActive });
  },

  setActiveFile: (path) => set({ activeFilePath: path }),

  updateFileContent: (path, content) => {
    const { generatedFiles } = get();
    const nextFiles = generatedFiles.map((f) => (f.path === path ? { ...f, content } : f));
    const isPreview = path === VIRTUAL_PREVIEW_PATH;

    set({
      generatedFiles: nextFiles,
      previewHtml: isPreview ? content : get().previewHtml,
    });
  },

  getFileContent: (path) => {
    const file = get().generatedFiles.find((f) => f.path === path);
    return file?.content ?? "";
  },
}));
