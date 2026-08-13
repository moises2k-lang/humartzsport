"use client";

import { useState } from "react";
import { Grid3X3, List } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { ProductListItem } from "@/lib/actions";

export function ProductGrid({
  products,
  title,
  showToggle = true,
}: {
  products: ProductListItem[];
  title?: string;
  showToggle?: boolean;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-4 flex items-center justify-between">
          {title ? <h2 className="text-2xl font-bold">{title}</h2> : <div />}
          {showToggle && (
            <div className="flex items-center gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("grid")}
                aria-label="Vista de cuadrícula"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("list")}
                aria-label="Vista de lista"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {products.length === 0 ? (
          <p className="text-muted-foreground">No se encontraron productos.</p>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "flex flex-col gap-4"
            }
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} view={view} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
