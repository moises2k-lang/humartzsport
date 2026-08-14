"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/lib/actions";

export function ProductDetail({ product }: { product: ProductDetail }) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants[0]?.id
  );
  const [quantity, setQuantity] = useState(1);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId) || product.variants[0],
    [selectedVariantId, product.variants]
  );

  const finalPrice = product.isFree ? 0 : product.price + (variant?.priceAdjustment ?? 0);

  const images =
    product.images.length > 0
      ? product.images.map((i) => i.url)
      : [product.image || "https://placehold.co/600x600/e2e8f0/1e293b.png?text=Sin+imagen"];

  const [mainImage, setMainImage] = useState(images[0]);

  const uniqueSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter((s): s is string => Boolean(s)))
  );
  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => Boolean(c)))
  );

  const handleAdd = () => {
    if (!variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      size: variant.size || undefined,
      color: variant.color || undefined,
      sku: variant.sku || product.sku || undefined,
      price: finalPrice,
      image: images[0],
      quantity,
    });
  };

  const stockLabel = variant
    ? variant.stock > 10
      ? { text: "En stock", className: "text-green-600" }
      : variant.stock > 0
        ? { text: `Solo ${variant.stock} disponibles`, className: "text-amber-600" }
        : { text: "Agotado", className: "text-destructive" }
    : { text: "Sin stock", className: "text-destructive" };

  return (
    <div className="container py-6">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/categoria/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-card p-2 shadow-sm">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-auto pb-1">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(url)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted p-1 transition-all",
                    mainImage === url
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:ring-offset-background"
                  )}
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="rounded-lg object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm lg:p-8">
          <div>
            <Link
              href={`/categoria/${product.category.slug}`}
              className="text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-primary"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-1 text-3xl font-bold uppercase leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.isNew && (
                <Badge className="bg-amber-400 text-black hover:bg-amber-400 uppercase">
                  Nuevo
                </Badge>
              )}
              {product.isFree && (
                <Badge className="bg-lime-400 text-black hover:bg-lime-400 uppercase">
                  Gratis
                </Badge>
              )}
              {!product.isFree && product.comparePrice && Number(product.comparePrice) > finalPrice && (
                <Badge
                  variant="secondary"
                  className="bg-rose-500 text-white hover:bg-rose-500 uppercase"
                >
                  Oferta
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <span className="text-4xl font-bold">{formatPrice(finalPrice)}</span>
            {product.comparePrice && Number(product.comparePrice) > 0 && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description || "Sin descripción."}
          </p>

          {variant && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className={cn("font-semibold", stockLabel.className)}>
                {stockLabel.text}
              </span>
              <span className="text-muted-foreground">
                · SKU: {variant.sku || product.sku || "N/A"}
              </span>
            </div>
          )}

          {uniqueSizes.length > 0 && (
            <div>
              <Label className="mb-2 block text-sm font-medium">Talla</Label>
              <div className="flex flex-wrap gap-2">
                {uniqueSizes.map((size) => (
                  <Button
                    key={size}
                    variant={variant?.size === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const match = product.variants.find((v) => v.size === size);
                      if (match) setSelectedVariantId(match.id);
                    }}
                    className={cn(
                      "h-10 min-w-[2.5rem] rounded-lg px-4 font-medium",
                      variant?.size === size
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:border-primary hover:text-primary"
                    )}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {uniqueColors.length > 0 && (
            <div>
              <Label className="mb-2 block text-sm font-medium">Color</Label>
              <div className="flex flex-wrap gap-2">
                {uniqueColors.map((color) => (
                  <Button
                    key={color}
                    variant={variant?.color === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const match = product.variants.find((v) => v.color === color);
                      if (match) setSelectedVariantId(match.id);
                    }}
                    className={cn(
                      "rounded-full px-4 font-medium",
                      variant?.color === color
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:border-primary hover:text-primary"
                    )}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-full border bg-background p-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleAdd}
              size="lg"
              disabled={!variant || variant.stock <= 0}
              className="flex-1 gap-2 rounded-lg bg-primary font-bold uppercase text-primary-foreground hover:bg-primary/90"
            >
              <ShoppingCart className="h-5 w-5" />
              {product.isFree ? "Agregar gratis" : "Agregar al carrito"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t pt-6 text-center">
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              <span>Envío gratis</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span>Devoluciones</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Pago seguro</span>
            </div>
          </div>
        </div>
      </div>

      {product.description && (
        <div className="mt-10 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold uppercase">Descripción</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
