import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./config";

/** Client met de sessie van de ingelogde gebruiker (beheer). Respecteert RLS. */
export async function createSessionClient() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Aangeroepen vanuit een Server Component: cookies kunnen daar niet gezet worden.
        }
      },
    },
  });
}

/** Anonieme client voor publieke data. Respecteert RLS (enkel online vacatures, team). */
export function createPublicClient() {
  return createPlainClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/** Service-role client. Alleen server-side, voor formulier-inzendingen en cv-uploads. */
export function createServiceClient() {
  return createPlainClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
