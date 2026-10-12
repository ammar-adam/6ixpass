import { appIcon } from "@/mock/appIcon";

export const dynamic = "force-static";

// The iPhone app's icon (App Store size). Copied into ios/App/App/Assets.xcassets.
export function GET() {
  return appIcon(1024, false);
}
