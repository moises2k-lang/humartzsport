import { notFound } from "next/navigation";
import { getProductBySlug, incrementViews } from "@/lib/actions";
import { ProductDetail } from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  await incrementViews(slug);

  return <ProductDetail product={product} />;
}
