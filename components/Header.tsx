"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  ChevronDown,
  User,
  Shirt,
  Users,
  Baby,
  Footprints,
  Trophy,
  ShoppingBag,
  Circle,
} from "lucide-react";
import { FacebookIcon, YoutubeIcon, TwitterIcon, InstagramIcon } from "@/components/SocialIcons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/CartSheet";
import { cn } from "@/lib/utils";

type CategoryNav = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: { id: string; name: string; slug: string }[];
};

const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  hombre: Shirt,
  mujer: Users,
  ninos: Baby,
  running: Footprints,
  futbol: Trophy,
  accesorios: ShoppingBag,
};

function CategoryIcon({ slug }: { slug: string }) {
  const Icon = CATEGORY_ICONS[slug.toLowerCase()] || Circle;
  return <Icon className="h-4 w-4 shrink-0" />;
}

export function Header({ categories }: { categories: CategoryNav[] }) {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const topCategories = categories.filter((c) => !c.parentId);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/buscar?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top bar */}
      <div className="bg-black text-white">
        <div className="container flex h-8 items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link href="#" aria-label="Facebook" className="hover:text-primary"><FacebookIcon className="h-4 w-4" /></Link>
            <Link href="#" aria-label="YouTube" className="hover:text-primary"><YoutubeIcon className="h-4 w-4" /></Link>
            <Link href="#" aria-label="Twitter" className="hover:text-primary"><TwitterIcon className="h-4 w-4" /></Link>
            <Link href="#" aria-label="Instagram" className="hover:text-primary"><InstagramIcon className="h-4 w-4" /></Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hover:underline">Ingresar</Link>
            <span>|</span>
            <Link href="/login" className="hover:underline">Crear cuenta</Link>
          </div>
        </div>
      </div>

      <div className="container flex h-20 items-center gap-4 py-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <div className="flex flex-col gap-4 pt-4">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image src="/logo.png" alt="Humartz Sport" width={160} height={60} className="h-12 w-auto" />
              </Link>
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  <CategoryIcon slug={cat.slug} />
                  {cat.name}
                </Link>
              ))}
              <Link href="/admin" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Humartz Sport" width={180} height={70} className="h-14 w-auto" priority />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "default" }), "hidden lg:inline-flex gap-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase font-bold tracking-wide")}
          >
            <Menu className="h-4 w-4" />
            Categorías
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {topCategories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                onSelect={() => router.push(`/categoria/${cat.slug}`)}
              >
                <CategoryIcon slug={cat.slug} />
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <form onSubmit={onSearch} className="hidden flex-1 items-stretch md:flex max-w-xl">
          <Input
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-none rounded-l-md border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button type="submit" className="h-10 rounded-none rounded-r-md bg-primary px-4 text-primary-foreground hover:bg-primary/90">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-1 justify-end items-center gap-2 md:flex-none">
          <form onSubmit={onSearch} className="flex md:hidden flex-1">
            <Input
              type="search"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </form>
          <Link
            href="/admin"
            aria-label="Admin"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <User className="h-5 w-5" />
          </Link>
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
