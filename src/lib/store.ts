import { create } from 'zustand';

interface GeneratedFile {
  path: string;
  content: string;
}

interface AgentLog {
  agent: string;
  action: string;
}

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
  view: 'code' | 'preview';
  error: string | null;
  saveMessage: string | null;
  debugMessage: string | null;
  
  generateProject: (prompt: string) => Promise<void>;
  saveToWorkspace: () => Promise<void>;
  debugProject: (errorMessage: string) => Promise<void>;
  setView: (view: 'code' | 'preview') => void;
  reset: () => void;
}

export const useGeneratorStore = create<GenerationState>((set, get) => ({
  isGenerating: false,
  isSaving: false,
  isDebugging: false,
  generatedFiles: [],
  previewHtml: null,
  projectTitle: '',
  currentPrompt: '',
  workflowLogs: [],
  activeAgentIndex: -1,
  view: 'code',
  error: null,
  saveMessage: null,
  debugMessage: null,
  
  generateProject: async (prompt: string) => {
    set({ 
      isGenerating: true, 
      error: null, 
      saveMessage: null, 
      currentPrompt: prompt,
      workflowLogs: [
        { agent: "Product Manager", action: "Analyzing requirements..." },
        { agent: "UI/UX Designer", action: "Waiting..." },
        { agent: "Lead Developer", action: "Waiting..." },
        { agent: "QA Tester", action: "Waiting..." }
      ],
      activeAgentIndex: 0
    });

    // Simulate agent progression for better UX
    const simulateAgents = () => {
      setTimeout(() => set({ activeAgentIndex: 1, workflowLogs: get().workflowLogs.map((l, i) => i === 1 ? { ...l, action: "Designing visual theme..." } : l) }), 2000);
      setTimeout(() => set({ activeAgentIndex: 2, workflowLogs: get().workflowLogs.map((l, i) => i === 2 ? { ...l, action: "Coding the components..." } : l) }), 5000);
      setTimeout(() => set({ activeAgentIndex: 3, workflowLogs: get().workflowLogs.map((l, i) => i === 3 ? { ...l, action: "Auditing code quality..." } : l) }), 9000);
    };
    
    simulateAgents();

    try {
      const response = await fetch('/api/superagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      set({ 
        generatedFiles: data.files, 
        previewHtml: data.previewHtml,
        projectTitle: data.projectTitle,
        isGenerating: false,
        activeAgentIndex: -1,
        view: 'preview'
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({ error: message, isGenerating: false, activeAgentIndex: -1 });
    }
  },

  saveToWorkspace: async () => {
    const { generatedFiles, projectTitle } = get();
    if (!generatedFiles.length) return;

    set({ isSaving: true, error: null });
    try {
      const response = await fetch('/api/save-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: generatedFiles, projectTitle }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      set({ isSaving: false, saveMessage: data.message });
      setTimeout(() => set({ saveMessage: null }), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({ error: message, isSaving: false });
    }
  },

  debugProject: async (errorMessage: string) => {
    const { currentPrompt, generatedFiles } = get();
    set({ isDebugging: true, error: null, debugMessage: 'LokoAI Debugger is analyzing...' });
    
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, files: generatedFiles, errorMessage }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      set({ 
        generatedFiles: data.files, 
        previewHtml: data.previewHtml,
        isDebugging: false,
        debugMessage: `Fixed: ${data.fixDescription}`
      });

      await get().saveToWorkspace();
      setTimeout(() => set({ debugMessage: null }), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({ error: message, isDebugging: false, debugMessage: null });
    }
  },

  setView: (view) => set({ view }),
  reset: () => set({ 
    generatedFiles: [], 
    previewHtml: null, 
    projectTitle: '', 
    currentPrompt: '', 
    workflowLogs: [],
    activeAgentIndex: -1,
    error: null, 
    isGenerating: false, 
    view: 'code', 
    saveMessage: null, 
    debugMessage: null 
  }),
}));
