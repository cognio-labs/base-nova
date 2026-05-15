import { create } from 'zustand';

interface GeneratedFile {
  path: string;
  content: string;
}

interface GenerationState {
  isGenerating: boolean;
  generatedFiles: GeneratedFile[];
  projectTitle: string;
  error: string | null;
  generateProject: (prompt: string) => Promise<void>;
  reset: () => void;
}

export const useGeneratorStore = create<GenerationState>((set) => ({
  isGenerating: false,
  generatedFiles: [],
  projectTitle: '',
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
        projectTitle: data.projectTitle,
        isGenerating: false 
      });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
    }
  },

  reset: () => set({ generatedFiles: [], projectTitle: '', error: null, isGenerating: false }),
}));
