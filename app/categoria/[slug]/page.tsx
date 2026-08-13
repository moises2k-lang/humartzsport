import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategoryBySlug, getProducts } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  const search = typeof query.q === "string" ? query.q : undefined;
  const sort =
    typeof query.sort === "string"
      ? (query.sort as "newest" | "price_asc" | "price_desc" | "popular")
      : "newest";

  const products = await getProducts({
    categoryId: category.id,
    search,
    sort,
    take: 48,
  });

  return (
    <div className="container py-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <p className="text-sm text-muted-foreground">
          {products.length} producto{products.length !== 1 && "s"}
        </p>
      </div>
      <ProductGrid products={products} title="" showToggle />
    </div>
  );
}
