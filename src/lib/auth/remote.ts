// Real accounts. next.config.ts swaps this file for remote-off.ts unless NEXT_PUBLIC_AUTH_MODE=supabase,
// so the demo build never ships supabase-js.
export { supabaseBackend } from "./supabase";
