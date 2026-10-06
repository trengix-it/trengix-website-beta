import { notFound } from "next/navigation";
import { VacatureEditor } from "@/components/beheer/VacatureEditor";
import { adminTeam, adminVacature } from "@/lib/admin";

export default async function EditVacature({ params }: PageProps<"/beheer/vacatures/[id]">) {
  const { id } = await params;
  const team = await adminTeam();
  if (id === "nieuw") return <VacatureEditor initial={null} team={team} />;
  const v = await adminVacature(id);
  if (!v) notFound();
  return <VacatureEditor key={v.id} initial={v} team={team} />;
}
