import "dotenv/config";
import { Prisma } from "../lib/generated/prisma/client";
import { prisma } from "../lib/prisma";

const categoryData = [
  { name: "Hombre", slug: "hombre" },
  { name: "Mujer", slug: "mujer" },
  { name: "Niños", slug: "ninos" },
  { name: "Accesorios", slug: "accesorios" },
  { name: "Running", slug: "running" },
  { name: "Fútbol", slug: "futbol" },
];

function placeholder(text: string, bg = "e5e7eb") {
  return `https://placehold.co/600x400/${bg}/374151.png?text=${encodeURIComponent(text)}`;
}

const productTemplates = [
  {
    name: "Tenis Deportivo Air Run",
    basePrice: 1299,
    category: "Hombre",
    isNew: true,
    sizes: ["26", "27", "28", "29"],
    colors: ["Negro", "Blanco"],
  },
  {
    name: "Zapato Casual Comfort",
    basePrice: 899,
    category: "Hombre",
    isNew: false,
    sizes: ["26", "27", "28"],
    colors: ["Café", "Azul"],
  },
  {
    name: "Tenis Running Mujer",
    basePrice: 1199,
    category: "Mujer",
    isNew: true,
    sizes: ["22", "23", "24", "25"],
    colors: ["Rosa", "Gris"],
  },
  {
    name: "Zapato Urban Mujer",
    basePrice: 799,
    category: "Mujer",
    isNew: false,
    sizes: ["22", "23", "24"],
    colors: ["Negro"],
  },
  {
    name: "Tenis Niño Velcro",
    basePrice: 649,
    category: "Niños",
    isNew: true,
    sizes: ["15", "16", "17", "18"],
    colors: ["Azul", "Rojo"],
  },
  {
    name: "Tenis Niña Brillos",
    basePrice: 599,
    category: "Niños",
    isNew: false,
    sizes: ["15", "16", "17"],
    colors: ["Rosa", "Morado"],
  },
  {
    name: "Calcetines Deportivos 3-Pack",
    basePrice: 199,
    category: "Accesorios",
    isNew: false,
    isFree: true,
    sizes: ["UNICA"],
    colors: ["Blanco", "Negro"],
  },
  {
    name: "Gorra Sport Humartz",
    basePrice: 349,
    category: "Accesorios",
    isNew: true,
    sizes: ["UNICA"],
    colors: ["Negro", "Gris", "Azul"],
  },
  {
    name: "Tenis Running Pro",
    basePrice: 1599,
    category: "Running",
    isNew: true,
    sizes: ["26", "27", "28", "29", "30"],
    colors: ["Naranja", "Negro"],
  },
  {
    name: "Tenis Fútbol Sala",
    basePrice: 1099,
    category: "Fútbol",
    isNew: false,
    sizes: ["26", "27", "28"],
    colors: ["Verde", "Negro"],
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categoryMap = new Map<string, string>();
  for (const c of categoryData) {
    const created = await prisma.category.create({ data: c });
    categoryMap.set(c.name, created.id);
  }

  for (const tpl of productTemplates) {
    const slug = tpl.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const variants: any[] = [];
    for (const size of tpl.sizes) {
      for (const color of tpl.colors) {
        variants.push({
          size: size === "UNICA" ? undefined : size,
          color: tpl.colors.length === 1 ? undefined : color,
          sku: `${slug.substring(0, 8)}-${size}-${color}`.toUpperCase(),
          stock: Math.floor(Math.random() * 20) + 5,
          priceAdjustment: new Prisma.Decimal(0),
        });
      }
    }

    await prisma.product.create({
      data: {
        name: tpl.name,
        slug,
        sku: `HUM-${Math.floor(Math.random() * 100000)}`,
        description: `Producto de calidad para la categoría ${tpl.category}. Disponible en varias tallas y colores.`,
        price: new Prisma.Decimal(tpl.basePrice),
        comparePrice: new Prisma.Decimal(Math.round(tpl.basePrice * 1.2)),
        image: placeholder(tpl.name),
        isNew: tpl.isNew,
        isFree: tpl.isFree ?? false,
        isPublished: true,
        categoryId: categoryMap.get(tpl.category)!,
        variants: { create: variants },
      },
    });
  }

  // seed admin user
  await prisma.user.upsert({
    where: { email: "admin@humartzsport.com" },
    update: {},
    create: {
      email: "admin@humartzsport.com",
      name: "Admin",
      passwordHash: "$2a$10$hashedplaceholder",
      role: "ADMIN",
    },
  });

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
