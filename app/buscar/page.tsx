import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const search = typeof query.q === "string" ? query.q : "";

  const products = await getProducts({ search, sort: "popular", take: 48 });

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold">
        {search ? `Resultados para "${search}"` : "Buscar productos"}
      </h1>
      <ProductGrid products={products} title="" />
    </div>
  );
}
