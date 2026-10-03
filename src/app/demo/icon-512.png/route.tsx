import { appIcon } from "@/demo/appIcon";

export const dynamic = "force-static";

export function GET() {
  return appIcon(512);
}
