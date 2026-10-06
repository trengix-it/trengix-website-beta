import { HeroBackdrop } from "./HeroBackdrop";

/** Eenvoudige tekstpagina voor juridische teksten. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="bg-hero inv">
        <HeroBackdrop />
        <div className="wrap hero-inner" style={{ paddingBottom: 88 }}>
          <h1 className="display" style={{ fontSize: "clamp(52px, 7vw, 112px)" }}>
            <span className="mask-line"><span className="a-line">{title}</span></span>
          </h1>
        </div>
      </header>
      <main className="bg-fade">
        <div className="wrap" style={{ paddingTop: 80, paddingBottom: 120 }}>
          <div style={{ maxWidth: "68ch", fontSize: 18, lineHeight: 1.65, color: "#3D3D46" }}>{children}</div>
        </div>
      </main>
    </>
  );
}
