export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500 dark:border-white/10 dark:border-t-sky-400" />
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-500">LokoAI</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Loading workspace...</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Preparing your session and compiling the current route.
        </p>
      </div>
    </div>
  );
}
