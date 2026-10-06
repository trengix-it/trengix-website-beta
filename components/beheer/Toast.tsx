"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Toont een bevestiging (uit ?melding=) en verwijdert die daarna uit de URL. */
export function Toast({ text }: { text: string | null }) {
  const [shown, setShown] = useState<string | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!text) return;
    setShown(text);
    router.replace(path, { scroll: false });
  }, [text, path, router]);

  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(null), 3600);
    return () => clearTimeout(t);
  }, [shown]);

  if (!shown) return null;
  return (
    <div className="toast a-pop" role="status">
      <span className="dot a-pulse" style={{ width: 22, height: 22 }} />
      {shown}
    </div>
  );
}
