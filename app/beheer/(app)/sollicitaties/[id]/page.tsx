import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/beheer/ConfirmButton";
import { MarkSeen } from "@/components/beheer/MarkSeen";
import { Notities } from "@/components/beheer/Notities";
import { StatusSelect } from "@/components/beheer/StatusSelect";
import { deleteInzending } from "@/lib/actions/admin";
import { adminSollicitatie, adminSollicitaties, datum, relatief } from "@/lib/admin";

export default async function SollicitatieDetail({ params }: PageProps<"/beheer/sollicitaties/[id]">) {
  const { id } = await params;
  const a = await adminSollicitatie(id);
  if (!a) notFound();
  const andere = (await adminSollicitaties()).filter((x) => x.email.toLowerCase() === a.email.toLowerCase() && x.id !== a.id);
  const tel = a.telefoon.replace(/[^\d+]/g, "");

  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1080 }}>
      <MarkSeen id={a.id} status={a.status} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Link href="/beheer/sollicitaties" style={{ fontSize: 15, fontWeight: 500, textUnderlineOffset: 4 }}>Alle sollicitaties</Link>
          <h1 className="admin-h1" style={{ fontSize: 44 }}>{a.voornaam} {a.achternaam}</h1>
          <p className="admin-sub" style={{ margin: 0 }}>Solliciteerde {relatief(a.created_at)} op {a.vacature}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <a className="btn btn-outline btn-sm" style={{ minHeight: 48, fontSize: 15 }} href={`mailto:${a.email}`}>Mailen</a>
          <a className="btn btn-outline btn-sm" style={{ minHeight: 48, fontSize: 15 }} href={`tel:${tel}`}>Bellen</a>
          {a.cv_path && <a className="btn btn-blue btn-sm" style={{ minHeight: 48, fontSize: 15 }} href={`/beheer/cv?tabel=sollicitaties&id=${a.id}`} target="_blank" rel="noopener">Cv openen</a>}
        </div>
      </div>

      <div className="stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)", gap: 20, alignItems: "start" }}>
        <section className="admin-card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>Gegevens</h2>
          <dl className="dl-grid">
            <dt>E-mail</dt><dd><a href={`mailto:${a.email}`}>{a.email}</a></dd>
            <dt>Telefoon</dt><dd><a href={`tel:${tel}`}>{a.telefoon}</a></dd>
            <dt>Vacature</dt><dd>{a.vacature_slug ? <a href={`/vacatures/${a.vacature_slug}`} target="_blank" rel="noopener">{a.vacature}</a> : a.vacature}</dd>
            <dt>Ontvangen</dt><dd>{datum(a.created_at)}</dd>
            <dt>Cv</dt><dd>{a.cv_path ? <a href={`/beheer/cv?tabel=sollicitaties&id=${a.id}`} target="_blank" rel="noopener">{a.cv_path.split("/").pop()}</a> : "Geen cv"}</dd>
          </dl>
          {andere.length > 0 && (
            <div style={{ paddingTop: 16, borderTop: "1px solid #ECECF3", display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 14, color: "#4A4A55" }}>Solliciteerde ook op</span>
              {andere.map((x) => <Link key={x.id} href={`/beheer/sollicitaties/${x.id}`} style={{ fontSize: 15 }}>{x.vacature} ({relatief(x.created_at)})</Link>)}
            </div>
          )}
        </section>
        <section className="admin-card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="a-field">
            <span>Status</span>
            <div><StatusSelect tabel="sollicitaties" id={a.id} status={a.status === "nieuw" ? "bekeken" : a.status} /></div>
            <span className="hint">Nieuw, bekeken, in gesprek, voorgesteld aan de klant, geplaatst of afgewezen.</span>
          </div>
          <Notities tabel="sollicitaties" id={a.id} initial={a.notities} />
        </section>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center", paddingTop: 8 }}>
        <span style={{ fontSize: 14, color: "#4A4A55" }}>Verwijderen wist ook het cv. Doe dit wanneer de kandidaat erom vraagt (GDPR).</span>
        <ConfirmButton action={deleteInzending.bind(null, "sollicitaties", a.id)} vraag={`Sollicitatie van ${a.voornaam} ${a.achternaam} en het cv definitief verwijderen?`} style={{ minHeight: 48, fontSize: 15 }}>
          Sollicitatie verwijderen
        </ConfirmButton>
      </div>
    </div>
  );
}
