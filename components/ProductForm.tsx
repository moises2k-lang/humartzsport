"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { ProductFormData } from "@/lib/admin-actions";

type CategoryOption = { id: string; name: string };

export function ProductForm({
  product,
  categories,
  onSubmit,
}: {
  product?: Partial<ProductFormData> & { id?: string; variants?: any[] };
  categories: CategoryOption[];
  onSubmit: (data: ProductFormData) => Promise<{ error?: string } | undefined>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [comparePrice, setComparePrice] = useState(String(product?.comparePrice ?? ""));
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isFree, setIsFree] = useState(product?.isFree ?? false);
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? true);
  const [image, setImage] = useState(product?.image ?? "");

  const [variants, setVariants] = useState<
    { size?: string; color?: string; sku?: string; stock: number; priceAdjustment: number }[]
  >(
    (product?.variants as any[])?.map((v) => ({
      size: v.size ?? "",
      color: v.color ?? "",
      sku: v.sku ?? "",
      stock: v.stock ?? 0,
      priceAdjustment: v.priceAdjustment?.toNumber?.() ?? v.priceAdjustment ?? 0,
    })) ?? []
  );

  const addVariant = () =>
    setVariants([...variants, { size: "", color: "", sku: "", stock: 0, priceAdjustment: 0 }]);

  const updateVariant = (idx: number, field: string, value: any) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data: ProductFormData = {
      name,
      slug,
      sku,
      description,
      price: parseFloat(price) || 0,
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      categoryId,
      isNew,
      isFree,
      isPublished,
      image,
      variants,
    };
    const res = await onSubmit(data).catch((err) => ({ error: err.message }));
    setLoading(false);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Producto guardado");
      router.push("/admin/productos");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug (dejar vacío para generar)</Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="price">Precio</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="comparePrice">Precio comparación</Label>
          <Input id="comparePrice" type="number" step="0.01" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="image">URL imagen</Label>
          <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Checkbox id="isNew" checked={isNew} onCheckedChange={(v) => setIsNew(Boolean(v))} />
          <Label htmlFor="isNew">Nuevo</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="isFree" checked={isFree} onCheckedChange={(v) => setIsFree(Boolean(v))} />
          <Label htmlFor="isFree">Gratis</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="isPublished" checked={isPublished} onCheckedChange={(v) => setIsPublished(Boolean(v))} />
          <Label htmlFor="isPublished">Publicado</Label>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Variantes (talla / color / stock)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="mr-1 h-3 w-3" /> Agregar variante
          </Button>
        </div>
        <div className="space-y-2">
          {variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-2">
              <Input placeholder="Talla" value={v.size ?? ""} onChange={(e) => updateVariant(idx, "size", e.target.value)} />
              <Input placeholder="Color" value={v.color ?? ""} onChange={(e) => updateVariant(idx, "color", e.target.value)} />
              <Input placeholder="SKU variante" value={v.sku ?? ""} onChange={(e) => updateVariant(idx, "sku", e.target.value)} />
              <Input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariant(idx, "stock", parseInt(e.target.value || "0", 10))} />
              <Input type="number" step="0.01" placeholder="Ajuste precio" value={v.priceAdjustment} onChange={(e) => updateVariant(idx, "priceAdjustment", parseFloat(e.target.value || "0"))} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(idx)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar producto"}
      </Button>
    </form>
  );
}
