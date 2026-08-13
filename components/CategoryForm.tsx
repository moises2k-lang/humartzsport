"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Category = { id: string; name: string; slug: string };

export function CategoryForm({
  categories,
  action,
  defaultValues,
}: {
  categories: Category[];
  action: (formData: FormData) => Promise<{ error?: string; [key: string]: any } | undefined>;
  defaultValues?: { name: string; slug: string; description?: string | null; parentId?: string | null; image?: string | null };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await action(formData).catch((err) => ({ error: err.message }));
    setLoading(false);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Categoría guardada");
      router.refresh();
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug (dejar vacío para generar)</Label>
          <Input id="slug" name="slug" defaultValue={defaultValues?.slug} />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" defaultValue={defaultValues?.description ?? ""} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="image">URL imagen</Label>
          <Input id="image" name="image" defaultValue={defaultValues?.image ?? ""} />
        </div>
        <div>
          <Label htmlFor="parentId">Categoría padre</Label>
          <Select name="parentId" defaultValue={defaultValues?.parentId ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Ninguna" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Ninguna</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar categoría"}
      </Button>
    </form>
  );
}
