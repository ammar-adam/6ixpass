import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTNERS } from "@/demo/data";
import { OWNER_ID } from "@/mock/owner";
import { PlaceScreen } from "@/mock/screens/PlaceScreen";

export function generateStaticParams() {
  // The owner's place has a fixed id, so its pages exist in the static export too.
  return [OWNER_ID, ...PARTNERS.map((p) => p.id)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: (slug === OWNER_ID ? "Your place" : PARTNERS.find((p) => p.id === slug)?.name) ?? "Place" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== OWNER_ID && !PARTNERS.some((p) => p.id === slug)) notFound();
  return <PlaceScreen slug={slug} />;
}
