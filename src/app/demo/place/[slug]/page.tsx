import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { places } from "@/demo/data";
import { PlacePage } from "@/demo/ui/PlacePage";

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: places.find((p) => p.slug === slug)?.name ?? "Place" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!places.some((p) => p.slug === slug)) notFound();
  return <PlacePage slug={slug} />;
}
