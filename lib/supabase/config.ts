export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Zonder Supabase-sleutels draait de site in demomodus: vaste voorbeelddata,
 * formulieren worden niet bewaard en /beheer is open (alleen lokaal bedoeld).
 */
export const DEMO = !SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY;

export const CV_BUCKET = "cv";
