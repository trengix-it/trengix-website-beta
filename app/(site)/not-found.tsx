import Link from "next/link";
import { HeroBackdrop } from "@/components/HeroBackdrop";

export default function NotFound() {
  return (
    <header className="bg-hero inv" style={{ minHeight: "80vh" }}>
      <HeroBackdrop />
      <div className="wrap hero-inner" style={{ paddingTop: 200 }}>
        <div className="hero-copy">
          <div className="eyebrow">404</div>
          <h1 className="display" style={{ fontSize: "clamp(56px, 8vw, 140px)" }}>
            <span className="mask-line"><span className="a-line">Deze pagina</span></span>
            <span className="mask-line"><span className="a-line a-line-2">vinden we niet.</span></span>
          </h1>
          <p className="lead">Misschien is de vacature al ingevuld. Bekijk wat er nu open staat.</p>
          <div className="btn-row">
            <Link href="/vacatures" className="btn btn-white">Bekijk vacatures</Link>
            <Link href="/" className="btn btn-outline-white">Naar de startpagina</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
