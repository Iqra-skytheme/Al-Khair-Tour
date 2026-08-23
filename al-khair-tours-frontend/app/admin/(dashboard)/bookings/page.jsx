import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { BookingStatusSelect } from "@/components/admin/booking-status-select";
import { apiFetch, adminHeaders } from "@/lib/api";
import { getAdminToken, deleteBooking } from "@/lib/admin-actions";

export default async function AdminBookingsPage() {
  const token = await getAdminToken();
  const bookings = await apiFetch("/api/admin/bookings", { headers: adminHeaders(token) });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Latest 100 booking requests.</p>

      <div className="mt-6 grid gap-3">
        {(bookings ?? []).map((b) => (
          <Card key={b.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-medium">
                  {b.customer_name}
                  <span className="text-xs font-normal text-muted-foreground">{b.customer_phone}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {b.service_type === "ride"
                    ? `${b.pickup ?? "?"} → ${b.dropoff ?? "?"}`
                    : `Ziyarat: ${b.package_id ?? "—"}`}
                  {b.scheduled_at && (
                    <> · {new Date(b.scheduled_at).toLocaleString()}</>
                  )}
                </div>
                {b.notes && <div className="mt-1 text-xs text-muted-foreground">Notes: {b.notes}</div>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <BookingStatusSelect id={b.id} status={b.status} />
                <DeleteButton
                  action={deleteBooking.bind(null, b.id)}
                  confirmText={`Delete booking from "${b.customer_name}"?`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {(!bookings || bookings.length === 0) && (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}
