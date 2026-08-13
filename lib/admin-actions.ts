"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export type ProductFormData = {
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  isNew: boolean;
  isFree: boolean;
  isPublished: boolean;
  image?: string;
  variants: {
    id?: string;
    size?: string;
    color?: string;
    sku?: string;
    stock: number;
    priceAdjustment: number;
  }[];
};

function toDecimal(value: number | undefined | null) {
  if (value === undefined || value === null) return undefined;
  return new Prisma.Decimal(String(value));
}

export async function getAllProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true },
  });
}

export async function getProductAdmin(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true, images: true },
  });
}

export async function createProduct(data: ProductFormData) {
  await requireAdmin();
  const slug = data.slug.trim() || slugify(data.name);
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      sku: data.sku?.trim() || undefined,
      description: data.description,
      price: toDecimal(data.price) ?? new Prisma.Decimal(0),
      comparePrice: toDecimal(data.comparePrice),
      categoryId: data.categoryId,
      isNew: data.isNew,
      isFree: data.isFree,
      isPublished: data.isPublished,
      image: data.image?.trim() || undefined,
      variants: {
        create: data.variants.map((v) => ({
          size: v.size?.trim() || undefined,
          color: v.color?.trim() || undefined,
          sku: v.sku?.trim() || undefined,
          stock: Number(v.stock) || 0,
          priceAdjustment: toDecimal(v.priceAdjustment) ?? new Prisma.Decimal(0),
        })),
      },
    },
  });
  revalidatePath("/");
  revalidatePath("/categoria/[slug]");
  revalidatePath("/producto/[slug]");
  return product;
}

export async function updateProduct(id: string, data: ProductFormData) {
  await requireAdmin();
  const slug = data.slug.trim() || slugify(data.name);
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      sku: data.sku?.trim() || undefined,
      description: data.description,
      price: toDecimal(data.price) ?? new Prisma.Decimal(0),
      comparePrice: toDecimal(data.comparePrice),
      categoryId: data.categoryId,
      isNew: data.isNew,
      isFree: data.isFree,
      isPublished: data.isPublished,
      image: data.image?.trim() || undefined,
    },
  });

  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.productVariant.createMany({
    data: data.variants.map((v) => ({
      productId: id,
      size: v.size?.trim() || undefined,
      color: v.color?.trim() || undefined,
      sku: v.sku?.trim() || undefined,
      stock: Number(v.stock) || 0,
      priceAdjustment: toDecimal(v.priceAdjustment)?.toNumber() ?? 0,
    })),
  });

  revalidatePath("/");
  revalidatePath("/categoria/[slug]");
  revalidatePath("/producto/[slug]");
  return prisma.product.findUnique({ where: { id } });
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function getAllCategories() {
  await requireAdmin();
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { parent: true },
  });
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  image?: string;
}) {
  await requireAdmin();
  const slug = data.slug?.trim() || slugify(data.name);
  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      parentId: data.parentId || undefined,
      image: data.image?.trim() || undefined,
    },
  });
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug?: string;
    description?: string;
    parentId?: string;
    image?: string;
  }
) {
  await requireAdmin();
  const slug = data.slug?.trim() || slugify(data.name);
  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
      parentId: data.parentId || undefined,
      image: data.image?.trim() || undefined,
    },
  });
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
}

export async function getOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  return prisma.order.update({
    where: { id },
    data: { status: status as any },
  });
}

export async function getAdminStats() {
  await requireAdmin();
  const [products, categories, orders, totalSales] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ]);
  return {
    products,
    categories,
    orders,
    totalSales: totalSales._sum.total?.toNumber() ?? 0,
  };
}

export async function bulkImportProducts(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File;
  if (!file) throw new Error("No se envió archivo");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = file.name.split(".").pop()?.toLowerCase();

  let rows: any[] = [];
  if (extension === "csv") {
    const text = buffer.toString("utf-8");
    rows = parse(text, { columns: true, skip_empty_lines: true }) as any[];
  } else if (["xlsx", "xls"].includes(extension ?? "")) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet) as any[];
  } else {
    throw new Error("Formato no soportado. Usa CSV o Excel.");
  }

  const categories = await prisma.category.findMany();
  const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));

  const created: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = String(row.nombre || row.name || "").trim();
    const categoryName = String(row.categoria || row.category || "").trim();
    if (!name || !categoryName) {
      errors.push(`Fila ${i + 1}: falta nombre o categoría`);
      continue;
    }

    const categoryId = categoryByName.get(categoryName.toLowerCase());
    if (!categoryId) {
      errors.push(`Fila ${i + 1}: categoría '${categoryName}' no existe`);
      continue;
    }

    const slug = slugify(name);
    const price = parseFloat(row.precio || row.price || 0);
    const comparePrice = row.comparePrice || row["precio comparación"]
      ? parseFloat(row.comparePrice || row["precio comparación"])
      : undefined;

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      errors.push(`Fila ${i + 1}: producto '${name}' ya existe`);
      continue;
    }

    const variants: ProductFormData["variants"] = [];
    const size = String(row.talla || row.size || "").trim();
    const color = String(row.color || "").trim();
    const stock = parseInt(String(row.stock || 0), 10) || 0;
    if (size || color || stock) {
      variants.push({ size, color, stock, priceAdjustment: 0 });
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        sku: row.sku ? String(row.sku).trim() : undefined,
        description: row.descripcion || row.description
          ? String(row.descripcion || row.description)
          : undefined,
        price: toDecimal(price) ?? new Prisma.Decimal(0),
        comparePrice: toDecimal(comparePrice),
        categoryId,
        isNew: String(row.nuevo || row.new || "").toLowerCase() === "si",
        isFree: String(row.gratis || row.free || "").toLowerCase() === "si",
        isPublished: true,
        image: row.imagen || row.image ? String(row.imagen || row.image) : undefined,
        variants: { create: variants },
      },
    });
    created.push(name);
  }

  revalidatePath("/");
  revalidatePath("/admin/productos");
  return { created: created.length, errors };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
