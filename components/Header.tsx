"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, ChevronDown, User } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1.5 text-center text-xs">
        Envío gratis en compras mayores a $1,500 MXN · Atención WhatsApp 55 1234 5678
      </div>

      <div className="container flex h-16 items-center gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <div className="flex flex-col gap-4 pt-4">
              <Link href="/" className="text-xl font-bold" onClick={() => setMobileOpen(false)}>
                HUMARTZ SPORT
              </Link>
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/admin" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          HUMARTZ <span className="text-primary">SPORT</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "ghost" }), "hidden lg:flex gap-1")}
          >
            Categorías <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {topCategories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                onSelect={() => router.push(`/categoria/${cat.slug}`)}
              >
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <form onSubmit={onSearch} className="hidden flex-1 items-center gap-2 md:flex">
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit" size="icon" variant="ghost">
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

      {/* Sub categories bar */}
      <nav className="hidden lg:block border-t bg-muted/40">
        <div className="container flex h-10 items-center gap-6 text-sm">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="font-medium hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
