import { ZiyaratForm } from "@/components/admin/ziyarat-form";
import { createZiyarat, getAdminToken } from "@/lib/admin-actions";

export default async function NewZiyaratPage() {
  const token = await getAdminToken();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Add Ziyarat package</h1>
      <div className="mt-6">
        <ZiyaratForm action={createZiyarat} token={token} />
      </div>
    </div>
  );
}