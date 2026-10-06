"use client";

import { useTransition } from "react";

/** Knop die eerst bevestiging vraagt en daarna een server action uitvoert. */
export function ConfirmButton({ action, vraag, children, className = "btn btn-outline btn-sm", style }: {
  action: () => Promise<unknown>;
  vraag: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [pending, start] = useTransition();
  return (
    <button type="button" className={className} style={style} disabled={pending}
      onClick={() => { if (confirm(vraag)) start(async () => { await action(); }); }}>
      {pending ? "Even geduld" : children}
    </button>
  );
}
