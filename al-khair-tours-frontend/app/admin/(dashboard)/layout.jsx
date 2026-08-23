import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiFetch, adminHeaders } from "@/lib/api";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin | Al-Khair Tours",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }) {
  const jar = await cookies();
  const token = jar.get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  try {
    await apiFetch("/api/admin/me", { headers: adminHeaders(token) });
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-x-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
