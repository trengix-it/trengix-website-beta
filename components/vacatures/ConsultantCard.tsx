"use client";

import { useEffect, useState } from "react";

export function ConsultantCard({ naam, foto, berichten }: { naam: string; foto: string | null; berichten: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % berichten.length), 4000);
    return () => clearInterval(id);
  }, [berichten.length]);
  return (
    <div className="card-float a-bob" style={{ position: "absolute", top: 0, right: 20, width: 320 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="avatar" style={{ width: 52, height: 52, ...(foto ? { backgroundImage: `url(${foto})` } : {}) }} />
        <span style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 13, color: "#4A4A55" }}>Je consultant</span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>{naam}</span>
        </span>
      </div>
      <div key={i} className="a-in" style={{ padding: "14px 16px", borderRadius: "18px 18px 18px 6px", background: "#EEEEF6", fontSize: 16, lineHeight: 1.4 }}>
        {berichten[i]}
      </div>
    </div>
  );
}
