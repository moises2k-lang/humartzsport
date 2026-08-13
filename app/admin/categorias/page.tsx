import { CategoryForm } from "@/components/CategoryForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/admin-actions";
import { createCategoryAction, deleteCategoryAction } from "@/lib/category-form-actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold">Categorías</h1>
      <div className="mt-6 rounded-xl border p-6">
        <CategoryForm categories={categories} action={createCategoryAction} />
      </div>
      <div className="mt-6 rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Padre</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.parent?.name || "—"}</TableCell>
                <TableCell className="text-right">
                  <form action={deleteCategoryAction.bind(null, cat.id)} className="inline">
                    <Button variant="ghost" size="sm" className="text-destructive" type="submit">
                      Eliminar
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
