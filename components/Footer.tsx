import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-10">
      <div className="container grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">HUMARTZ SPORT</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tienda en línea de calzado y artículos deportivos. Código propio, flexible y listo para crecer.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Categorías</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link href="/categoria/hombre" className="hover:text-primary">Hombre</Link></li>
            <li><Link href="/categoria/mujer" className="hover:text-primary">Mujer</Link></li>
            <li><Link href="/categoria/ninos" className="hover:text-primary">Niños</Link></li>
            <li><Link href="/categoria/accesorios" className="hover:text-primary">Accesorios</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Ayuda</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary">Envíos</Link></li>
            <li><Link href="#" className="hover:text-primary">Devoluciones</Link></li>
            <li><Link href="#" className="hover:text-primary">Preguntas frecuentes</Link></li>
            <li><Link href="#" className="hover:text-primary">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contacto</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            WhatsApp: 55 1234 5678<br />
            Email: ventas@humartzsport.com<br />
            horario: Lun - Vie 9:00 - 18:00
          </p>
        </div>
      </div>
      <div className="container mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Humartz Sport. Todos los derechos reservados.
      </div>
    </footer>
  );
}
