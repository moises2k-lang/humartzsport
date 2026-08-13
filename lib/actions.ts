"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ProductListItem, ProductDetail } from "@/lib/types";

function toNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number(value.toString?.() ?? value);
}

function mapProduct(product: any): ProductListItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    price: toNumber(product.price),
    comparePrice: product.comparePrice ? toNumber(product.comparePrice) : null,
    image: product.image,
    isNew: product.isNew,
    isFree: product.isFree,
    isPublished: product.isPublished,
    views: product.views,
    category: product.category,
    variants: (product.variants || []).map((v: any) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stock,
      priceAdjustment: toNumber(v.priceAdjustment),
    })),
    images: (product.images || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
    })),
  };
}

export type { ProductListItem, ProductDetail };

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { children: { orderBy: { name: "asc" } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { children: true },
  });
}

export async function getProducts({
  categoryId,
  search,
  sort = "newest",
  take = 24,
  skip = 0,
}: {
  categoryId?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  take?: number;
  skip?: number;
}): Promise<ProductListItem[]> {
  const where: any = { isPublished: true };
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "popular") orderBy = { views: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      category: true,
      variants: { orderBy: { createdAt: "asc" } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      variants: { orderBy: { createdAt: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  return product ? mapProduct(product) : null;
}

export async function incrementViews(slug: string) {
  await prisma.product.updateMany({
    where: { slug },
    data: { views: { increment: 1 } },
  });
}

export async function getFeaturedProducts(limit = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: true,
      variants: { orderBy: { createdAt: "asc" } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });
  return products.map(mapProduct);
}

export async function getFreeProducts(limit = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { isPublished: true, isFree: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true, variants: true, images: { take: 1 } },
  });
  return products.map(mapProduct);
}

export async function getMostViewedProducts(limit = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { views: "desc" },
    take: limit,
    include: { category: true, variants: true, images: { take: 1 } },
  });
  return products.map(mapProduct);
}

export type CreateOrderInput = {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress?: string;
  notes?: string;
  items: {
    productId: string;
    variantId?: string;
    name: string;
    size?: string;
    color?: string;
    sku?: string;
    price: number;
    quantity: number;
  }[];
};

export async function createOrder(input: CreateOrderInput) {
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      total: total,
      items: {
        create: input.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          size: item.size,
          color: item.color,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  revalidatePath("/admin/pedidos");
  return order;
}
