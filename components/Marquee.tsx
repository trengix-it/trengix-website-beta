import { rollen } from "@/lib/site";

export function RolesMarquee({ large = false }: { large?: boolean }) {
  const items = [...rollen, ...rollen];
  return (
    <section aria-label="Profielen die we invullen" className="marq-sec marq-wrap" style={large ? { padding: "44px 0" } : undefined}>
      <div className="marq">
        {items.map((r, i) => (
          <span key={i} className="marq-item" aria-hidden={i >= rollen.length ? true : undefined}
            style={large ? { fontSize: "clamp(40px, 5vw, 76px)" } : undefined}>
            <span className={i % 2 === 1 ? "outline-text" : undefined}>{r}</span>
            <span aria-hidden="true" className="dot" style={large ? { width: 18, height: 18 } : undefined} />
          </span>
        ))}
      </div>
    </section>
  );
}
