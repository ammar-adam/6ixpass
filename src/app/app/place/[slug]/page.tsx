import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTNERS } from "@/demo/data";
import { PlaceScreen } from "@/mock/screens/PlaceScreen";

export function generateStaticParams() {
  return PARTNERS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: PARTNERS.find((p) => p.id === slug)?.name ?? "Place" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!PARTNERS.some((p) => p.id === slug)) notFound();
  return <PlaceScreen slug={slug} />;
}
