"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/format";
import type { ProductListItem } from "@/lib/actions";

export function ProductCard({
  product,
  view = "grid",
}: {
  product: ProductListItem;
  view?: "grid" | "list";
}) {
  const { addItem } = useCart();
  const variant = product.variants[0];
  const finalPrice = product.isFree ? 0 : product.price + (variant?.priceAdjustment ?? 0);
  const image = product.images[0]?.url || product.image || "https://placehold.co/400x300/e2e8f0/1e293b?text=Sin+imagen";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      slug: product.slug,
      size: variant?.size || undefined,
      color: variant?.color || undefined,
      sku: variant?.sku || product.sku || undefined,
      price: finalPrice,
      image,
      quantity: 1,
    });
  };

  const content = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.isNew && <Badge className="bg-blue-600">NUEVO</Badge>}
          {product.isFree && <Badge className="bg-green-600">GRATIS</Badge>}
          {product.comparePrice && Number(product.comparePrice) > finalPrice && (
            <Badge variant="secondary">OFERTA</Badge>
          )}
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted-foreground">{product.category.name}</p>
        <h3 className="mt-1 line-clamp-2 font-medium leading-tight">{product.name}</h3>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-lg font-bold">{formatPrice(finalPrice)}</span>
          {product.comparePrice && Number(product.comparePrice) > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        {variant && (variant.size || variant.color) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {variant.size && `Talla: ${variant.size}`} {variant.color && `Color: ${variant.color}`} · Stock: {variant.stock}
          </p>
        )}
        <Button onClick={handleAdd} className="mt-3 w-full" size="sm">
          Agregar
        </Button>
      </CardContent>
    </>
  );

  if (view === "list") {
    return (
      <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md sm:flex-row">
        <Link href={`/producto/${product.slug}`} className="relative block aspect-[4/3] w-full sm:w-48 shrink-0">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <p className="text-xs text-muted-foreground">{product.category.name}</p>
            <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-xl font-bold">{formatPrice(finalPrice)}</span>
              {product.comparePrice && Number(product.comparePrice) > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            {variant && (variant.size || variant.color) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {variant.size && `Talla: ${variant.size}`} {variant.color && `Color: ${variant.color}`} · Stock: {variant.stock}
              </p>
            )}
          </div>
          <Button onClick={handleAdd} className="mt-4 w-fit" size="sm">
            Agregar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/producto/${product.slug}`}>
      <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
        {content}
      </Card>
    </Link>
  );
}
