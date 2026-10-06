"use client";

import { useState } from "react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(-1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((f, i) => {
        const isOpen = i === open;
        return (
          <div key={f.q} className="bg-soft" style={{ borderRadius: 22 }}>
            <h3 style={{ margin: 0 }}>
              <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "26px 28px", border: 0, background: "transparent", textAlign: "left", fontSize: 21, fontWeight: 500, color: "#0A0A0B", cursor: "pointer", minHeight: 44 }}>
                <span>{f.q}</span>
                {isOpen ? (
                  <span className="dot a-pop" aria-hidden="true" style={{ width: 22, height: 22 }} />
                ) : (
                  <span aria-hidden="true" style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 999, border: "2px solid #0A0A0B" }} />
                )}
              </button>
            </h3>
            {isOpen && (
              <p id={`faq-${i}`} className="a-in" style={{ margin: 0, padding: "0 28px 28px", fontSize: 17, lineHeight: 1.6, color: "#3D3D46", maxWidth: "60ch" }}>{f.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
