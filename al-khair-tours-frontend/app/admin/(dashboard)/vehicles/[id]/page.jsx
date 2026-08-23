// import { notFound } from "next/navigation";
// import { VehicleForm } from "@/components/admin/vehicle-form";
// import { apiFetch, adminHeaders } from "@/lib/api";
// import { getAdminToken, updateVehicle } from "@/lib/admin-actions";

// export default async function EditVehiclePage({ params }) {
//   const { id } = await params;
//   const token = await getAdminToken();

//   let vehicle = null;
//   try {
//     vehicle = await apiFetch(`/api/admin/vehicles/${id}`, { headers: adminHeaders(token) });
//   } catch {
//     vehicle = null;
//   }
//   if (!vehicle) notFound();

//   const boundUpdate = updateVehicle.bind(null, id);

//   return (
//     <div>
//       <h1 className="font-display text-2xl font-semibold">Edit vehicle</h1>
//       <div className="mt-6">
//         <VehicleForm vehicle={vehicle} action={boundUpdate} />
//       </div>
//     </div>
//   );
// }
import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { apiFetch, adminHeaders } from "@/lib/api";
import { getAdminToken, updateVehicle } from "@/lib/admin-actions";

export default async function EditVehiclePage({ params }) {
  const { id } = await params;
  const token = await getAdminToken();

  let vehicle = null;
  try {
    vehicle = await apiFetch(`/api/admin/vehicles/${id}`, { headers: adminHeaders(token) });
  } catch {
    vehicle = null;
  }
  if (!vehicle) notFound();

  const boundUpdate = updateVehicle.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit vehicle</h1>
      <div className="mt-6">
        <VehicleForm vehicle={vehicle} action={boundUpdate} token={token} />
      </div>
    </div>
  );
}