import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { RichText } from "@/components/RichText";
import { getContent } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Gebruiksvoorwaarden" };

export default async function Page() {
  const c = await getContent();
  return (
    <LegalPage title="Gebruiksvoorwaarden">
      <RichText text={c.juridisch.voorwaarden} />
    </LegalPage>
  );
}
