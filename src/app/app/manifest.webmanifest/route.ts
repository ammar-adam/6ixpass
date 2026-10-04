export const dynamic = "force-static";

// "Add to Home Screen" on iPhone and Android, and "Install app" in Chrome and Edge.
// Opens on the owner demo start screen, with no browser bar.
export function GET() {
  return new Response(
    JSON.stringify({
      id: "/app",
      name: "The 6 Pass",
      short_name: "6 Pass",
      description: "The 6 Pass demo for owners. Places shown are examples.",
      start_url: "/partners-demo",
      scope: "/",
      display: "standalone",
      background_color: "#0a1424",
      theme_color: "#0a1424",
      icons: [
        { src: "/app/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/app/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/app/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
