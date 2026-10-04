import { appIcon } from "@/mock/appIcon";

export const dynamic = "force-static";

export function GET() {
  return appIcon(512, false);
}
