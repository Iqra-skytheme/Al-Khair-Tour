import Link from "next/link";
import { Plus, Pencil, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { apiFetch, adminHeaders } from "@/lib/api";
import { getAdminToken, deleteVehicle } from "@/lib/admin-actions";

export default async function AdminVehiclesPage() {
  const token = await getAdminToken();
  const vehicles = await apiFetch("/api/admin/vehicles", { headers: adminHeaders(token) });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Vehicles</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage rides shown on the website.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/vehicles/new"><Plus className="h-4 w-4" /> Add vehicle</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(vehicles ?? []).map((v) => (
          <Card key={v.id} className="overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              {v.image ? (
                <img src={v.image} alt={v.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-lg font-semibold">{v.name}</div>
                  <div className="text-sm text-muted-foreground">{v.category}</div>
                </div>
                {!v.available && (
                  <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Hidden
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {v.seats} seats</span>
                <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {v.luggage} bags</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href={`/admin/vehicles/${v.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                </Button>
                <DeleteButton action={deleteVehicle.bind(null, v.id)} confirmText={`Delete "${v.name}"?`} />
              </div>
            </CardContent>
          </Card>
        ))}
        {(!vehicles || vehicles.length === 0) && (
          <p className="text-sm text-muted-foreground">No vehicles yet.</p>
        )}
      </div>
    </div>
  );
}