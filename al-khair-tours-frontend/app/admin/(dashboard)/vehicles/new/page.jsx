import { VehicleForm } from "@/components/admin/vehicle-form";
import { createVehicle, getAdminToken } from "@/lib/admin-actions";

export default async function NewVehiclePage() {
  const token = await getAdminToken();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Add vehicle</h1>
      <div className="mt-6">
        <VehicleForm action={createVehicle} token={token} />
      </div>
    </div>
  );
}