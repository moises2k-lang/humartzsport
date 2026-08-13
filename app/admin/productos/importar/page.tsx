import { BulkImport } from "@/components/BulkImport";

export const dynamic = "force-dynamic";

export default function ImportProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Importar productos</h1>
      <div className="mt-6 rounded-xl border p-6">
        <BulkImport />
      </div>
    </div>
  );
}
