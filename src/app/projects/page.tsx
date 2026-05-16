import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProjectList from "@/components/ProjectList";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/projects");

  const supabase = await createSupabaseServerClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id,title,description,preview_url,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-sky-500">
            Generated Client Dashboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            Your generated apps
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-gray-400">
            Create, manage, edit, and delete only your own LokoAI projects.
          </p>
        </div>
        <Link href="/workspace">
          <Button>New Project</Button>
        </Link>
      </div>
      <ProjectList initialProjects={projects || []} />
    </div>
  );
}
