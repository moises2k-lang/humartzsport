"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { items, count, total, updateQuantity, removeItem } = useCart();

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "relative flex items-center gap-2 rounded-sm bg-yellow-400 px-3 py-1 text-black hover:bg-yellow-300"
        )}
        aria-label="Carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        <div className="hidden flex-col items-start text-xs leading-tight sm:flex">
          <span className="font-bold uppercase">{`Tu Cesta ${count}`}</span>
          <span>MXN {new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(total)}</span>
        </div>
        {count > 0 && (
          <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 bg-black text-white">
            {count}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu Cesta</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Tu cesta está vacía.</p>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
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
                      <div className="text-sm text-muted-foreground">
                        {[
                          item.size ? `Talla: ${item.size}` : "",
                          item.color ? `Color: ${item.color}` : "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
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
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
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
                    <div className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "mt-4 w-full font-bold uppercase"
                  )}
                >
                  Finalizar pedido
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
