"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    id: 1,
    title: "Nueva Colección Deportiva",
    subtitle: "Descubre los mejores tenis para entrenar o salir",
    image: "https://placehold.co/1200x400/1d4ed8/ffffff?text=Nueva+Colección",
    cta: "Ver productos",
    href: "/categoria/hombre",
  },
  {
    id: 2,
    title: "Envío Gratis en Compras Mayores",
    subtitle: "Aprovecha nuestras promociones y artículos gratuitos",
    image: "https://placehold.co/1200x400/0f766e/ffffff?text=Envío+Gratis",
    cta: "Ver promociones",
    href: "/categoria/mujer",
  },
  {
    id: 3,
    title: "Calzado para Toda la Familia",
    subtitle: "Niños, jóvenes y adultos. Encuentra tu talla ideal.",
    image: "https://placehold.co/1200x400/b45309/ffffff?text=Para+Toda+la+Familia",
    cta: "Comprar ahora",
    href: "/categoria/ninos",
  },
];

export function HeroSlider() {
  return (
    <section className="container py-4">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[260px] w-full overflow-hidden rounded-xl md:h-[360px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 text-white">
                  <h2 className="max-w-md text-2xl font-bold md:text-4xl">{slide.title}</h2>
                  <p className="mt-2 max-w-md text-sm md:text-base">{slide.subtitle}</p>
                  <Link
                    href={slide.href}
                    className={cn(buttonVariants({ variant: "default" }), "mt-4 w-fit bg-white text-black hover:bg-white/90")}
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 hidden md:flex" />
        <CarouselNext className="right-2 hidden md:flex" />
      </Carousel>
    </section>
  );
}
