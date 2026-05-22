import BuilderWorkspace from "@/components/BuilderWorkspace";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuildPage({ params }: Props) {
  const { id } = await params;
  return <BuilderWorkspace projectId={id} />;
}
