import { redirect } from "next/navigation";
import DashboardWorkspace from "@/components/DashboardWorkspace";
import { getCurrentUser } from "@/lib/supabase";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  return <DashboardWorkspace />;
}
