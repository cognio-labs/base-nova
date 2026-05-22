export const BUILDER_PENDING_PROMPT_KEY = "lokoai.builder.pending-prompt";

export function readPendingBuilderPrompt() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(BUILDER_PENDING_PROMPT_KEY);
}

export function writePendingBuilderPrompt(prompt: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(BUILDER_PENDING_PROMPT_KEY, prompt);
}

export function clearPendingBuilderPrompt() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(BUILDER_PENDING_PROMPT_KEY);
}

export function readProjectPendingPrompt(projectId: string) {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(`lokoai.pending.${projectId}`);
}

export function clearProjectPendingPrompt(projectId: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(`lokoai.pending.${projectId}`);
}
