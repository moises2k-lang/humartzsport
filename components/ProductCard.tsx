"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const image = product.images[0]?.url || product.image || "https://placehold.co/400x300/e2e8f0/1e293b.png?text=Sin+imagen";

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

  const priceDisplay = product.isFree ? "GRATIS" : formatPrice(finalPrice);

  const cardContent = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.isNew && (
            <span className="rounded-sm bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase text-black">
              Nuevo
            </span>
          )}
          {product.isFree && (
            <span className="rounded-sm bg-lime-400 px-2 py-0.5 text-[10px] font-bold uppercase text-black">
              Gratis
            </span>
          )}
          {!product.isFree && product.comparePrice && Number(product.comparePrice) > finalPrice && (
            <span className="rounded-sm bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Oferta
            </span>
          )}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1 rounded-sm bg-white/90 p-1 shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
          <button aria-label="Favorito" className="p-1 hover:text-primary">
            <Heart className="h-4 w-4" />
          </button>
          <button aria-label="Vista rápida" className="p-1 hover:text-primary">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-white p-3">
        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold uppercase leading-tight text-foreground">
          {product.name}
        </h3>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-lg font-bold text-foreground">{priceDisplay}</span>
          {product.comparePrice && Number(product.comparePrice) > 0 && !product.isFree && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        {variant && (variant.size || variant.color) && (
          <p className="mt-1 text-[10px] text-muted-foreground uppercase">
            {variant.size && `Talla: ${variant.size}`} {variant.color && `Color: ${variant.color}`} · Stock: {variant.stock}
          </p>
        )}
        <Button onClick={handleAdd} className="mt-3 w-full rounded-sm bg-primary text-xs font-bold uppercase text-primary-foreground hover:bg-primary/90" size="sm">
          Agregar
        </Button>
      </div>
    </>
  );

  if (view === "list") {
    return (
      <div className="group flex flex-col overflow-hidden rounded-sm border border-border bg-white transition-shadow hover:shadow-md sm:flex-row">
        <Link href={`/producto/${product.slug}`} className="relative block aspect-[4/3] w-full sm:w-48 shrink-0 bg-muted">
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
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide">{product.category.name}</p>
            <h3 className="mt-1 text-lg font-bold uppercase">{product.name}</h3>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-xl font-bold">{priceDisplay}</span>
              {product.comparePrice && Number(product.comparePrice) > 0 && !product.isFree && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            {variant && (variant.size || variant.color) && (
              <p className="mt-1 text-xs text-muted-foreground uppercase">
                {variant.size && `Talla: ${variant.size}`} {variant.color && `Color: ${variant.color}`} · Stock: {variant.stock}
              </p>
            )}
          </div>
          <Button onClick={handleAdd} className="mt-4 w-fit rounded-sm bg-primary text-xs font-bold uppercase text-primary-foreground hover:bg-primary/90" size="sm">
            Agregar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/producto/${product.slug}`}>
      <div className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-white transition-shadow hover:shadow-md">
        {cardContent}
      </div>
    </Link>
  );
}
