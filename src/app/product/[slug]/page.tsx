import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailExperience } from "@/components/ProductDetailExperience";
import { PERFUMES } from "@/data/perfumes";

export const dynamicParams = false;

export function generateStaticParams() {
  return PERFUMES.map((perfume) => ({ slug: perfume.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const perfume = PERFUMES.find((item) => item.slug === slug);
  if (!perfume) return { title: "العطر غير متاح | SÈN Parfums" };
  return {
    title: `${perfume.nameAr} | SÈN Parfums`,
    description: `${perfume.descriptionAr} عينة 2 مل مع كل زجاجة، والدفع عند الاستلام.`,
    openGraph: {
      title: `${perfume.nameAr} | SÈN Parfums`,
      description: perfume.taglineAr,
      images: [perfume.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const perfume = PERFUMES.find((item) => item.slug === slug);
  if (!perfume) notFound();
  return <ProductDetailExperience perfume={perfume} />;
}
