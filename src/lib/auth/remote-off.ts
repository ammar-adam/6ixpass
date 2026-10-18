// Stand-in for remote.ts in builds without real accounts (see next.config.ts).
import type { AuthBackend } from "./types";
export const supabaseBackend: AuthBackend | null = null;
