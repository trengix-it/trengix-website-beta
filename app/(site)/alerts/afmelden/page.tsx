import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { Unsubscribe } from "@/components/alerts/Unsubscribe";

export const metadata: Metadata = { title: "Afmelden voor vacature-mails", robots: { index: false } };

export default async function Afmelden({ searchParams }: PageProps<"/alerts/afmelden">) {
  const sp = await searchParams;
  return (
    <LegalPage title="Afmelden">
      <Unsubscribe token={typeof sp.token === "string" ? sp.token : ""} />
    </LegalPage>
  );
}
