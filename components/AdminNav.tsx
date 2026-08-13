"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="rounded-xl border p-4">
        <p className="text-sm font-medium">{email}</p>
        <p className="text-xs text-muted-foreground">Administrador</p>
        <nav className="mt-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="mt-4">
          <Button variant="outline" className="w-full" type="submit">
            Cerrar sesión
          </Button>
        </form>
      </div>
    </aside>
  );
}
