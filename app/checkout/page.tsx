"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/lib/actions";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    try {
      await createOrder({
        customerEmail: formData.get("email") as string,
        customerName: formData.get("name") as string,
        customerPhone: (formData.get("phone") as string) || undefined,
        shippingAddress: (formData.get("address") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          size: item.size,
          color: item.color,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
        })),
      });
      clear();
      setMessage("¡Pedido recibido! Te contactaremos para confirmar envío y pago.");
      setTimeout(() => router.push("/"), 2500);
    } catch (err: any) {
      setMessage(err.message || "Error al crear el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !message) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Tu cesta está vacía.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Finalizar pedido</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono / WhatsApp</Label>
            <Input id="phone" name="phone" />
          </div>
          <div>
            <Label htmlFor="address">Dirección de envío</Label>
            <Textarea id="address" name="address" rows={3} />
          </div>
          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea id="notes" name="notes" rows={2} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : `Confirmar pedido · ${formatPrice(total)}`}
          </Button>
          {message && <p className="text-sm text-green-600">{message}</p>}
        </form>
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Tu pedido</h2>
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-2 font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
