export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: "The 6 Pass (demo)",
    short_name: "6 Pass demo",
    description: "A clickable demo of The 6 Pass app. Places shown are examples.",
    start_url: "/demo",
    scope: "/demo",
    display: "standalone",
    background_color: "#e3eceb",
    theme_color: "#0f2e33",
    icons: [
      { src: "/demo/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/demo/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  });
}
