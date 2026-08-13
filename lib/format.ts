import { Prisma } from "@/lib/generated/prisma/client";

export function formatPrice(
  price: number | string | Prisma.Decimal | { toNumber(): number }
) {
  const num =
    typeof price === "number"
      ? price
      : typeof price === "string"
      ? parseFloat(price)
      : price.toNumber();
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(num);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
