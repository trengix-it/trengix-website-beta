import { NextResponse, type NextRequest } from "next/server";
import { adminAlerts, adminSollicitaties } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin";
import { PIPELINE_LABEL } from "@/lib/types";

const csv = (rows: (string | null | undefined)[][]) =>
  "﻿" + rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");

/** CSV-export (puntkomma, opent rechtstreeks in Excel). */
export async function GET(request: NextRequest) {
  await requireAdmin();
  const wat = request.nextUrl.searchParams.get("wat");
  const stamp = new Date().toISOString().slice(0, 10);
  let body: string;
  if (wat === "sollicitaties") {
    const rows = await adminSollicitaties();
    body = csv([
      ["Datum", "Voornaam", "Achternaam", "E-mail", "Telefoon", "Vacature", "Status", "Notities"],
      ...rows.map((r) => [r.created_at.slice(0, 10), r.voornaam, r.achternaam, r.email, r.telefoon, r.vacature, PIPELINE_LABEL[r.status], r.notities]),
    ]);
  } else if (wat === "alerts") {
    const rows = await adminAlerts();
    body = csv([["E-mail", "Domein", "Ingeschreven op"], ...rows.map((r) => [r.email, r.domein ?? "Alle", r.created_at.slice(0, 10)])]);
  } else return new NextResponse("Onbekende export.", { status: 400 });
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="trengix-${wat}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
