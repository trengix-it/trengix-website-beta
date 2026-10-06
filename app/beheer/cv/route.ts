import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { CV_BUCKET, DEMO } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

/** Opent het cv van een sollicitatie of bericht via een kortlevende, ondertekende link. Alleen voor beheerders. */
export async function GET(request: NextRequest) {
  await requireAdmin();
  const tabel = request.nextUrl.searchParams.get("tabel");
  const id = request.nextUrl.searchParams.get("id");
  if (DEMO) return new NextResponse("In de demomodus worden geen cv's bewaard.", { status: 404 });
  if ((tabel !== "sollicitaties" && tabel !== "berichten") || !id) return new NextResponse("Ongeldige aanvraag.", { status: 400 });
  const supabase = await createSessionClient();
  const { data: row } = await supabase.from(tabel).select("cv_path").eq("id", id).maybeSingle();
  if (!row?.cv_path) return new NextResponse("Geen cv gevonden.", { status: 404 });
  const { data, error } = await supabase.storage.from(CV_BUCKET).createSignedUrl(row.cv_path, 120);
  if (error || !data) return new NextResponse("Cv niet gevonden.", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
