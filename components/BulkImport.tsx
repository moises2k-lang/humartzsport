"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { bulkImportProducts } from "@/lib/admin-actions";

export function BulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Selecciona un archivo");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await bulkImportProducts(formData);
    setLoading(false);
    if (res.created > 0) toast.success(`${res.created} productos importados`);
    if (res.errors.length > 0) {
      res.errors.forEach((err) => toast.error(err));
    }
    if (res.created === 0 && res.errors.length === 0) {
      toast.info("No se importaron productos");
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Sube un CSV o Excel con columnas: <code>nombre</code>, <code>categoria</code>,{" "}
        <code>precio</code>, <code>descripcion</code>, <code>sku</code>, <code>imagen</code>,{" "}
        <code>talla</code>, <code>color</code>, <code>stock</code>, <code>nuevo</code>,{" "}
        <code>gratis</code>. Las categorías deben existir primero.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file">Archivo CSV / Excel</Label>
          <Input
            id="file"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Importando..." : "Importar productos"}
        </Button>
      </form>
    </div>
  );
}
