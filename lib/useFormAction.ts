"use client";

import { startTransition, useActionState, useState } from "react";
import type { ActionResult } from "./types";

/** Maximale grootte van een upload. Bewust onder de 6 MB-limiet van serverfuncties (Netlify/AWS). */
export const MAX_UPLOAD_MB = 4;

/**
 * useActionState zonder het automatisch leegmaken van het formulier na een fout,
 * zodat bezoekers hun invoer (en hun cv) niet opnieuw moeten ingeven.
 * Te grote bestanden worden al in de browser tegengehouden.
 */
export function useFormAction(fn: (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>) {
  const [server, dispatch, pending] = useActionState<ActionResult | null, FormData>(fn, null);
  const [local, setLocal] = useState<ActionResult | null>(null);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const groot = [...fd.values()].some((v) => v instanceof File && v.size > MAX_UPLOAD_MB * 1024 * 1024);
    if (groot) {
      setLocal({ ok: false, error: `Je bestand is groter dan ${MAX_UPLOAD_MB} MB. Probeer een kleiner bestand.` });
      return;
    }
    setLocal(null);
    startTransition(() => dispatch(fd));
  };
  return { state: local ?? server, pending, onSubmit };
}
