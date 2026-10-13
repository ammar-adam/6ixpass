import { appIcon } from "@/mock/appIcon";

// The iPhone home-screen icon, for the site and the demo. Same as the app icon.
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return appIcon(180);
}
