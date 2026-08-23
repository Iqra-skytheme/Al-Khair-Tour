import { notFound } from "next/navigation";
import { ZiyaratForm } from "@/components/admin/ziyarat-form";
import { apiFetch, adminHeaders } from "@/lib/api";
import { getAdminToken, updateZiyarat } from "@/lib/admin-actions";

export default async function EditZiyaratPage({ params }) {
  const { id } = await params;
  const token = await getAdminToken();

  let pkg = null;
  try {
    pkg = await apiFetch(`/api/admin/ziyarat/${id}`, { headers: adminHeaders(token) });
  } catch {
    pkg = null;
  }
  if (!pkg) notFound();

  const boundUpdate = updateZiyarat.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit package</h1>
      <div className="mt-6">
        <ZiyaratForm pkg={pkg} action={boundUpdate} token={token} />
      </div>
    </div>
  );
}