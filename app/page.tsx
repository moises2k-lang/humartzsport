import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductGrid } from "@/components/ProductGrid";
import {
  getFeaturedProducts,
  getFreeProducts,
  getMostViewedProducts,
} from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, free, mostViewed] = await Promise.all([
    getFeaturedProducts(10),
    getFreeProducts(6),
    getMostViewedProducts(6),
  ]);

  return (
    <div>
      <HeroSlider />

      <section className="relative h-48 overflow-hidden md:h-64">
        <Image
          src="https://images.unsplash.com/photo-1777307273262-77a3601044ab?auto=format&fit=crop&w=1200&q=80"
          alt="Ofertas especiales"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container flex h-full flex-col items-end justify-center text-right text-white">
          <h2 className="text-3xl font-bold uppercase md:text-5xl">Ofertas Especiales</h2>
          <p className="text-xl font-bold text-primary md:text-3xl">50% off</p>
          <Link
            href="/buscar"
            className="mt-3 inline-block rounded-sm bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground hover:bg-primary/90"
          >
            Ver Ofertas
          </Link>
        </div>
      </section>

      <ProductGrid products={featured} title="Artículos Nuevos" viewAllHref="/buscar" />
      {free.length > 0 && (
        <ProductGrid products={free} title="Artículos Gratuitos" viewAllHref="/categoria/accesorios" />
      )}
      {mostViewed.length > 0 && (
        <ProductGrid products={mostViewed} title="Artículos Más Vistos" viewAllHref="/buscar" />
      )}

      <section className="container py-12">
        <div className="rounded-sm bg-muted p-8 text-center">
          <h2 className="text-2xl font-bold">¿Tienes ~500 productos para subir?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Usa el panel de administración para importar tu catálogo por CSV o Excel.
            También puedo conectar la carga masiva con fotos y descripciones que me envíes.
          </p>
        </div>
      </section>
    </div>
  );
}
