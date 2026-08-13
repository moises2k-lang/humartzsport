export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
};

export type ProductVariant = {
  id: string;
  size: string | null;
  color: string | null;
  sku: string | null;
  stock: number;
  priceAdjustment: number;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  price: number;
  comparePrice: number | null;
  image: string | null;
  isNew: boolean;
  isFree: boolean;
  isPublished: boolean;
  views: number;
  category: Category;
  variants: ProductVariant[];
  images: ProductImage[];
};

export type ProductDetail = ProductListItem;
