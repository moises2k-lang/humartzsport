import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  return (
    <div className="container flex flex-col gap-6 py-6 md:flex-row">
      <AdminNav email={user.email} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
