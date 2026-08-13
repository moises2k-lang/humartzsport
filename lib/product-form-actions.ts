"use server";

import { createProduct, updateProduct, type ProductFormData } from "@/lib/admin-actions";

export async function createProductAction(data: ProductFormData) {
  try {
    await createProduct(data);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateProductAction(id: string, data: ProductFormData) {
  try {
    await updateProduct(id, data);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
