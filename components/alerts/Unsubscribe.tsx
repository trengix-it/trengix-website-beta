"use client";

import Link from "next/link";
import { unsubscribeAlert } from "@/lib/actions/public";
import { useFormAction } from "@/lib/useFormAction";

export function Unsubscribe({ token }: { token: string }) {
  const { state, pending, onSubmit } = useFormAction(unsubscribeAlert);
  if (state?.ok) {
    return (
      <div role="status" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: 22, color: "#0A0A0B" }}>Je bent afgemeld. Je krijgt geen vacature-mails meer.</p>
        <Link href="/vacatures">Bekijk de vacatures</Link>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <input type="hidden" name="token" value={token} />
      <p style={{ margin: 0 }}>Wil je geen mails meer ontvangen wanneer er een nieuwe vacature online komt?</p>
      {state && !state.ok && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending || !token} className="btn btn-blue">{pending ? "Even geduld" : "Afmelden"}</button>
    </form>
  );
}
