import { siteFonts } from "../fonts";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className={siteFonts}>{children}</div>;
}
