import { NextResponse, type NextRequest } from "next/server";
import { ruimOudeGegevensOp } from "@/lib/opruimen";

/** Dagelijks aangeroepen door Vercel Cron (zie vercel.json). Beveiligd met CRON_SECRET. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Niet toegestaan.", { status: 401 });
  }
  const r = await ruimOudeGegevensOp();
  return NextResponse.json(r);
}
