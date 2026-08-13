import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllProducts, deleteProduct } from "@/lib/admin-actions";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/productos/importar"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Importar
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Nuevo producto
          </Link>
        </div>
      </div>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {product.isNew && <Badge className="bg-blue-600">NUEVO</Badge>}
                    {product.isFree && <Badge className="bg-green-600">GRATIS</Badge>}
                    {!product.isPublished && <Badge variant="secondary">BORRADOR</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    Editar
                  </Link>
                  <form action={deleteProduct.bind(null, product.id)} className="inline">
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
