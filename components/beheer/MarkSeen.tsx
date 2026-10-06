"use client";

import { useEffect, useRef } from "react";
import { setSollicitatieStatus } from "@/lib/actions/admin";

/** Zet een nieuwe sollicitatie op 'bekeken' zodra ze geopend wordt. */
export function MarkSeen({ id, status }: { id: string; status: string }) {
  const done = useRef(false);
  useEffect(() => {
    if (status !== "nieuw" || done.current) return;
    done.current = true;
    setSollicitatieStatus(id, "bekeken");
  }, [id, status]);
  return null;
}
