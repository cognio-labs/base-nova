import { create } from 'zustand';

interface GeneratedFile {
  path: string;
  content: string;
}

interface GenerationState {
  isGenerating: boolean;
  generatedFiles: GeneratedFile[];
  previewHtml: string | null;
  projectTitle: string;
  view: 'code' | 'preview';
  error: string | null;
  generateProject: (prompt: string) => Promise<void>;
  setView: (view: 'code' | 'preview') => void;
  reset: () => void;
}

export const useGeneratorStore = create<GenerationState>((set) => ({
  isGenerating: false,
  generatedFiles: [],
  previewHtml: null,
  projectTitle: '',
  view: 'code',
  error: null,
  
  generateProject: async (prompt: string) => {
    set({ isGenerating: true, error: null });
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

  setView: (view) => set({ view }),
  reset: () => set({ generatedFiles: [], previewHtml: null, projectTitle: '', error: null, isGenerating: false, view: 'code' }),
}));
