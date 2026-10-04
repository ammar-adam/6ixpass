"use client";

import { useEffect } from "react";

export function GoToApp() {
  useEffect(() => {
    window.location.replace("/app");
  }, []);
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-[#0a1424] p-6 text-center text-[#f3f6fb]">
      <p>
        The demo has moved. <a href="/app" className="underline underline-offset-4">Open the app</a>.
      </p>
    </main>
  );
}
