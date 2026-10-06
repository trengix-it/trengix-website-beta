import "server-only";
import { randomUUID } from "node:crypto";
import { DEMO } from "./supabase/config";
import { createServiceClient } from "./supabase/server";

export const MEDIA_BUCKET = "media";
const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};
const MAX = 3 * 1024 * 1024;

/** Controleert en uploadt een afbeelding naar de publieke media-bucket. Geeft de publieke URL terug. */
export async function uploadImage(file: File, folder: "team" | "logos" | "inhoud"): Promise<{ url: string } | { error: string }> {
  const ext = TYPES[file.type];
  if (!ext) return { error: "Gebruik een PNG, JPG, WebP, SVG of GIF." };
  if (file.size > MAX) return { error: "De afbeelding is groter dan 3 MB." };
  if (DEMO) {
    // Demomodus: afbeelding als data-URL in het geheugen.
    const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    return { url: `data:${file.type};base64,${b64}` };
  }
  const path = `${folder}/${randomUUID()}.${ext}`;
  const db = createServiceClient();
  const { error } = await db.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) return { error: "Uploaden mislukt: " + error.message };
  return { url: db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl };
}

/** Verwijdert een eerder geüploade afbeelding (stil als het geen media-URL is). */
export async function removeImage(url: string | null | undefined) {
  if (!url || DEMO) return;
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  await createServiceClient().storage.from(MEDIA_BUCKET).remove([url.slice(i + marker.length)]);
}
