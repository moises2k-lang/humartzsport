import { ProductForm } from "@/components/ProductForm";
import { getAllCategories } from "@/lib/admin-actions";
import { createProductAction } from "@/lib/product-form-actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <div className="mt-6 rounded-xl border p-6">
        <ProductForm categories={categories} onSubmit={createProductAction} />
      </div>
    </div>
  );
}
