"use client";

import { useEffect } from "react";
import { rememberRef } from "@/lib/rpc";

// Keeps ?ref=CODE from the first page, so a friend's invite still counts
// after they look around before joining.
export function RefCatcher() {
  useEffect(() => rememberRef(), []);
  return null;
}
