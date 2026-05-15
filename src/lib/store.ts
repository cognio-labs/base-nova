import { create } from 'zustand';

interface GeneratedFile {
  path: string;
  content: string;
}

interface GenerationState {
  isGenerating: boolean;
  isSaving: boolean;
  isDebugging: boolean;
  generatedFiles: GeneratedFile[];
  previewHtml: string | null;
  projectTitle: string;
  currentPrompt: string;
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
  view: 'code',
  error: null,
  saveMessage: null,
  debugMessage: null,
  
  generateProject: async (prompt: string) => {
    set({ isGenerating: true, error: null, saveMessage: null, currentPrompt: prompt });
    try {
      const response = await fetch('/api/generate', {
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
        view: 'preview'
      });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
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
    } catch (err: any) {
      set({ error: err.message, isSaving: false });
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

      // Automatically re-save the fixed files
      await get().saveToWorkspace();
      
      setTimeout(() => set({ debugMessage: null }), 5000);
    } catch (err: any) {
      set({ error: err.message, isDebugging: false, debugMessage: null });
    }
  },

  setView: (view) => set({ view }),
  reset: () => set({ generatedFiles: [], previewHtml: null, projectTitle: '', currentPrompt: '', error: null, isGenerating: false, view: 'code', saveMessage: null, debugMessage: null }),
}));
