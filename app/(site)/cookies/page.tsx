import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { RichText } from "@/components/RichText";
import { getContent } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Cookiebeleid" };

export default async function Page() {
  const c = await getContent();
  return (
    <LegalPage title="Cookiebeleid">
      <RichText text={c.juridisch.cookies} />
    </LegalPage>
  );
}
