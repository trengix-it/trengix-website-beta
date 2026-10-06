import { notFound } from "next/navigation";
import { TeamEditor } from "@/components/beheer/TeamEditor";
import { adminTeamLid } from "@/lib/admin";

export default async function EditTeamLid({ params }: PageProps<"/beheer/team/[id]">) {
  const { id } = await params;
  if (id === "nieuw") return <TeamEditor initial={null} />;
  const t = await adminTeamLid(id);
  if (!t) notFound();
  return <TeamEditor key={t.id} initial={t} />;
}
