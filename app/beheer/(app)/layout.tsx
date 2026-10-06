import Image from "next/image";
import { SideNav } from "@/components/beheer/SideNav";
import { logout } from "@/lib/actions/admin";
import { adminCounts, requireAdmin } from "@/lib/admin";
import { DEMO } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin();
  const counts = await adminCounts();
  return (
    <div className="admin">
      <aside className="side bg-night inv">
        <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          <Image src="/brand/logo-wit.png" alt="Trengix" width={124} height={24} style={{ height: 24, width: "auto" }} />
          <span style={{ fontSize: 13, color: "#A9A8D6" }}>Beheer</span>
        </div>
        <SideNav counts={counts} />
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.06)" }}>
            <span aria-hidden="true" className="avatar" style={{ width: 38, height: 38 }} />
            <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{me.naam}</span>
              <span style={{ fontSize: 12, color: "#A9A8D6" }}>{DEMO ? "Geen login nodig" : "Ingelogd met e-mailcode"}</span>
            </span>
          </div>
          <form action={logout}>
            <button type="submit" className="side-link" style={{ fontSize: 14 }}>Uitloggen</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">
        {DEMO && (
          <p className="demo-banner">
            Demomodus: er is nog geen database gekoppeld. Wijzigingen blijven bewaard tot de server herstart. Zie README voor de koppeling met Supabase.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
