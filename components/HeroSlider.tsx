"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "LOREM IPSUM",
    subtitle: "LOREM IPSUM DOLOR SIT",
    subtext: "LOREM IPSUM DOLOR SIT",
    image: "https://images.unsplash.com/photo-1578876705807-e01cbf4f14bd?auto=format&fit=crop&w=800&q=80",
    cta: "VER PRODUCTO",
    href: "/categoria/hombre",
  },
  {
    id: 2,
    title: "NUEVA COLECCIÓN",
    subtitle: "CALZADO PARA TODA LA FAMILIA",
    subtext: "DESCUBRE LOS MEJORES MODELOS",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    cta: "VER PRODUCTO",
    href: "/categoria/mujer",
  },
  {
    id: 3,
    title: "PROMOCIONES",
    subtitle: "ARTÍCULOS GRATUITOS Y MÁS",
    subtext: "APROVECHA NUESTRAS OFERTAS",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    cta: "VER PRODUCTO",
    href: "/categoria/ninos",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative bg-[#e5e5e5] overflow-hidden">
      <div className="container relative flex min-h-[340px] items-center md:min-h-[420px]">
        <div className="grid w-full grid-cols-1 items-center gap-6 py-8 px-2 md:grid-cols-2 md:py-0 md:px-10">
          <div className="z-10 order-2 md:order-1">
            <h2 className="text-3xl font-bold uppercase tracking-wide text-foreground md:text-5xl">
              {slide.title}
            </h2>
            <p className="mt-2 text-lg font-medium text-muted-foreground uppercase md:text-xl">
              {slide.subtitle}
            </p>
            <p className="mt-1 text-base text-muted-foreground uppercase">
              {slide.subtext}
            </p>
            <Link href={slide.href}>
              <Button className="mt-6 rounded-sm bg-primary px-6 py-2 font-bold uppercase text-primary-foreground hover:bg-primary/90">
                {slide.cta}
              </Button>
            </Link>
          </div>
          <div className="relative order-1 h-48 md:order-2 md:h-80">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-contain drop-shadow-lg transition-opacity duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 z-20 hidden h-10 w-8 -translate-y-1/2 items-center justify-center bg-black/40 text-white hover:bg-black/60 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-2 top-1/2 z-20 hidden h-10 w-8 -translate-y-1/2 items-center justify-center bg-black/40 text-white hover:bg-black/60 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={cn(
              "h-3 w-3 rounded-full border border-black/30 transition-colors",
              i === current ? "bg-primary border-primary" : "bg-white hover:bg-primary/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
