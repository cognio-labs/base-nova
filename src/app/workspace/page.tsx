import Home from "../page";
import { getCurrentUser } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/workspace");

  return <Home />;
}
