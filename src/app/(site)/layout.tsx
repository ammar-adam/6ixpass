import { siteFonts } from "../fonts";
import { RefCatcher } from "@/components/RefCatcher";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={siteFonts}>
      <RefCatcher />
      {children}
    </div>
  );
}
