"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutGrid, List, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/lib/actions";

export function ProductGrid({
  products,
  title,
  showToggle = true,
  viewAllHref,
}: {
  products: ProductListItem[];
  title?: string;
  showToggle?: boolean;
  viewAllHref?: string;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section className="py-8 bg-white">
      <div className="container">
        <div className="mb-4 flex items-center justify-between">
          {title ? (
            <h2 className="text-xl font-bold uppercase tracking-wide text-foreground md:text-2xl">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-1 rounded-sm bg-primary px-3 py-1.5 text-xs font-bold uppercase text-primary-foreground hover:bg-primary/90"
              >
                Ver Más <ChevronRight className="h-3 w-3" />
              </Link>
            )}
            {showToggle && (
              <div className="flex items-center rounded-sm border border-border">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setView("grid")}
                  aria-label="Vista de cuadrícula"
                  className={cn("h-8 w-8 rounded-none", view === "grid" && "bg-primary text-primary-foreground hover:bg-primary/90")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setView("list")}
                  aria-label="Vista de lista"
                  className={cn("h-8 w-8 rounded-none", view === "list" && "bg-primary text-primary-foreground hover:bg-primary/90")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
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
