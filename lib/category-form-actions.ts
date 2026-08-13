"use server";

import { createCategory, updateCategory, deleteCategory } from "@/lib/admin-actions";

export async function createCategoryAction(formData: FormData) {
  try {
    await createCategory({
      name: formData.get("name") as string,
      slug: (formData.get("slug") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      parentId: (formData.get("parentId") as string) || undefined,
      image: (formData.get("image") as string) || undefined,
    });
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  try {
    await updateCategory(id, {
      name: formData.get("name") as string,
      slug: (formData.get("slug") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      parentId: (formData.get("parentId") as string) || undefined,
      image: (formData.get("image") as string) || undefined,
    });
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
}
