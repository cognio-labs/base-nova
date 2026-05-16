import Link from "next/link";
import { FolderKanban, Sparkles, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-sky-500">
            AI Workspace Dashboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            Welcome back to LokoAI
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-gray-400">
            Manage your profile, projects, and generated client dashboards.
          </p>
        </div>
        <Link href="/workspace">
          <Button size="lg">
            <Sparkles className="h-4 w-4" />
            Generate New App
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-sky-500" />
              Profile
            </CardTitle>
            <CardDescription>{user.email || user.phone}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Session is saved through Supabase Auth cookies.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-sky-500" />
              Projects
            </CardTitle>
            <CardDescription>{count || 0} saved generated apps</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/projects">
              <Button variant="outline">Open Projects</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protected Routes</CardTitle>
            <CardDescription>/workspace, /dashboard, /projects, /generate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Middleware redirects logged-out users to `/login`.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
