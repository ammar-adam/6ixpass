import { notFound } from "next/navigation";
import { DirectionA } from "@/demo/directions/A";
import { DirectionB } from "@/demo/directions/B";
import { DirectionC } from "@/demo/directions/C";
import { SCREENS, type ScreenName } from "@/demo/directions/screens";

const DIRECTIONS = { a: DirectionA, b: DirectionB, c: DirectionC } as const;

export function generateStaticParams() {
  return Object.keys(DIRECTIONS).flatMap((d) => SCREENS.map((s) => ({ d, s })));
}

export default async function Page({ params }: { params: Promise<{ d: string; s: string }> }) {
  const { d, s } = await params;
  const Direction = DIRECTIONS[d as keyof typeof DIRECTIONS];
  if (!Direction || !SCREENS.includes(s as ScreenName)) notFound();
  return <Direction initial={s as ScreenName} />;
}
