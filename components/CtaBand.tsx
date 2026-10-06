import Link from "next/link";
import { telHref } from "@/lib/content";
import { getContent } from "@/lib/data";
import { Mark } from "./Mark";

export async function CtaBand({
  title,
  primary,
  secondary,
}: {
  title: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  const { bedrijf } = await getContent();
  const sec = secondary ?? { href: telHref(bedrijf.telefoon) || "/contact", label: bedrijf.telefoon };
  return (
    <section className="bg-hero inv">
      <div aria-hidden="true" className="blob blob-a" />
      <div aria-hidden="true" className="blob blob-b" />
      <Mark className="cta-mark hide-m" />
      <div className="wrap cta-inner">
        <h2 className="h-cta reveal">{title}</h2>
        <div className="btn-row" style={{ marginTop: 48 }}>
          <Link href={primary.href} className="btn btn-white">{primary.label}</Link>
          <a href={sec.href} className="btn btn-outline-white">{sec.label}</a>
        </div>
      </div>
    </section>
  );
}
