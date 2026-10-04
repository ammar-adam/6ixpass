export const dynamic = "force-static";

// Lets Chrome and Edge install /app as its own window ("Install app").
export function GET() {
  return new Response(
    JSON.stringify({
      id: "/app",
      name: "The 6 Pass",
      short_name: "6 Pass",
      description: "A clickable mock of The 6 Pass app. Places shown are examples.",
      start_url: "/app",
      scope: "/app",
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
