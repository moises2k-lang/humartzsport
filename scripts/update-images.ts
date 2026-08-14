import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";

const categoryImageMap: Record<string, string> = {
  hombre: "/images/samples/hombre.png",
  mujer: "/images/samples/mujer.png",
  ninos: "/images/samples/ninos.png",
  accesorios: "/images/samples/accesorios.png",
  running: "/images/samples/running.png",
  futbol: "/images/samples/futbol.png",
};

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true },
  });

  for (const product of products) {
    const image = categoryImageMap[product.category.slug] || product.image || "/images/samples/hombre.png";

    // Update main product image
    await prisma.product.update({
      where: { id: product.id },
      data: { image },
    });

    // Replace product gallery with a single sample image
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    await prisma.productImage.create({
      data: {
        id: uuidv4(),
        productId: product.id,
        url: image,
        alt: product.name,
        sortOrder: 0,
      },
    });

    console.log(`Updated ${product.name} -> ${image}`);
  }

  console.log("Done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
