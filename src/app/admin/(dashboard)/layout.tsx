import { requireAdminSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell adminEmail={session.email}>{children}</AdminShell>;
}
