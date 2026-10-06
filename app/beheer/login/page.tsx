import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/beheer/LoginForm";
import { Mark } from "@/components/Mark";
import { DEMO } from "@/lib/supabase/config";

export default async function Login({ searchParams }: PageProps<"/beheer/login">) {
  if (DEMO) redirect("/beheer");
  const sp = await searchParams;
  return (
    <div className="bg-hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div aria-hidden="true" className="blob blob-a" />
      <Mark className="hide-m" style={{ position: "absolute", right: -200, top: 40, height: 760, width: "auto", opacity: 0.12 }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 440, background: "#fff", color: "#0A0A0B", borderRadius: 32, padding: "clamp(24px, 5vw, 44px)", boxShadow: "0 40px 100px rgba(5,3,60,0.35)", display: "flex", flexDirection: "column", gap: 28 }}>
        <Image src="/brand/logo.png" alt="Trengix" width={124} height={24} style={{ height: 24, width: "auto" }} />
        <LoginForm fout={typeof sp.fout === "string" ? sp.fout : null} />
      </div>
    </div>
  );
}
