"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Carrito de compras</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">Tu cesta está vacía.</p>
          <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-4")}>
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="font-medium line-clamp-1 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {[
                      item.size ? `Talla: ${item.size}` : "",
                      item.color ? `Color: ${item.color}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="text-sm font-medium">{formatPrice(item.price)} c/u</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center rounded-full border bg-background p-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-full"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-full"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="rounded-full text-destructive"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="text-right font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="h-fit rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Resumen</h2>
            <div className="mt-4 flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Envío calculado en el siguiente paso.
            </p>
            <Link
              href="/checkout"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-6 w-full font-bold uppercase"
              )}
            >
              Proceder al pago
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
