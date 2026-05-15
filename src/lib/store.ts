import { create } from 'zustand';

interface GeneratedFile {
  path: string;
  content: string;
}

interface GenerationState {
  isGenerating: boolean;
  isSaving: boolean;
  generatedFiles: GeneratedFile[];
  previewHtml: string | null;
  projectTitle: string;
  view: 'code' | 'preview';
  error: string | null;
  saveMessage: string | null;
  generateProject: (prompt: string) => Promise<void>;
  saveToWorkspace: () => Promise<void>;
  setView: (view: 'code' | 'preview') => void;
  reset: () => void;
}

export const useGeneratorStore = create<GenerationState>((set, get) => ({
  isGenerating: false,
  isSaving: false,
  generatedFiles: [],
  previewHtml: null,
  projectTitle: '',
  view: 'code',
  error: null,
  saveMessage: null,
  
  generateProject: async (prompt: string) => {
    set({ isGenerating: true, error: null, saveMessage: null });
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

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
      
      // Auto-clear message after 3 seconds
      setTimeout(() => set({ saveMessage: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, isSaving: false });
    }
  },

  setView: (view) => set({ view }),
  reset: () => set({ generatedFiles: [], previewHtml: null, projectTitle: '', error: null, isGenerating: false, view: 'code', saveMessage: null }),
}));
