"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/format";
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

  const uniqueSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter((s): s is string => Boolean(s)))
  );
  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => Boolean(c)))
  );

  return (
    <div className="container py-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-auto">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(url)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border ${
                    mainImage === url ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link
            href={`/categoria/${product.category.slug}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            {product.isNew && <Badge className="bg-blue-600">NUEVO</Badge>}
            {product.isFree && <Badge className="bg-green-600">GRATIS</Badge>}
            {product.comparePrice && Number(product.comparePrice) > finalPrice && (
              <Badge variant="secondary">OFERTA</Badge>
            )}
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-bold">{formatPrice(finalPrice)}</span>
            {product.comparePrice && Number(product.comparePrice) > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description || "Sin descripción."}
          </p>

          {uniqueSizes.length > 0 && (
            <div className="mt-6">
              <Label className="mb-2 block">Talla</Label>
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
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {uniqueColors.length > 0 && (
            <div className="mt-4">
              <Label className="mb-2 block">Color</Label>
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
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {variant && (
            <p className="mt-4 text-sm text-muted-foreground">
              SKU: {variant.sku || product.sku || "N/A"} · Stock: {variant.stock}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>
            <Button onClick={handleAdd} className="flex-1" size="lg">
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
