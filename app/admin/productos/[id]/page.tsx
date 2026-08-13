import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { getProductAdmin, getAllCategories } from "@/lib/admin-actions";
import { updateProductAction } from "@/lib/product-form-actions";

function toNum(v: any): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "number" ? v : Number(v.toString?.() ?? v);
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductAdmin(id),
    getAllCategories(),
  ]);
  if (!product) return notFound();

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? undefined,
    description: product.description ?? undefined,
    price: toNum(product.price),
    comparePrice: product.comparePrice ? toNum(product.comparePrice) : undefined,
    categoryId: product.categoryId,
    isNew: product.isNew,
    isFree: product.isFree,
    isPublished: product.isPublished,
    image: product.image ?? undefined,
    variants: product.variants.map((v: any) => ({
      id: v.id,
      size: v.size ?? undefined,
      color: v.color ?? undefined,
      sku: v.sku ?? undefined,
      stock: toNum(v.stock),
      priceAdjustment: toNum(v.priceAdjustment),
    })),
  } as any;

  return (
    <div>
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <div className="mt-6 rounded-xl border p-6">
        <ProductForm
          product={initial}
          categories={categories}
          onSubmit={updateProductAction.bind(null, product.id)}
        />
      </div>
    </div>
  );
}
