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
      <ProductGrid products={featured} title="Artículos Nuevos" />
      {free.length > 0 && (
        <ProductGrid products={free} title="Artículos Gratuitos" />
      )}
      {mostViewed.length > 0 && (
        <ProductGrid products={mostViewed} title="Artículos Más Vistos" />
      )}
      <section className="container py-12">
        <div className="rounded-xl bg-muted p-8 text-center">
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
