import { getAdminStats } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Productos", value: stats.products },
          { label: "Categorías", value: stats.categories },
          { label: "Pedidos", value: stats.orders },
          { label: "Ventas totales", value: new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(stats.totalSales) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
