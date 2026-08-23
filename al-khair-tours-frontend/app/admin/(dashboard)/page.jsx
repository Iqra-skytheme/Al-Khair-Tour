import Link from "next/link";
import { Car, MapPin, CalendarCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch, adminHeaders } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-actions";

export default async function AdminOverviewPage() {
  const token = await getAdminToken();
  const overview = await apiFetch("/api/admin/overview", { headers: adminHeaders(token) });

  const cards = [
    { label: "Vehicles", value: overview.vehicleCount, icon: Car, href: "/admin/vehicles" },
    { label: "Ziyarat packages", value: overview.ziyaratCount, icon: MapPin, href: "/admin/ziyarat" },
    { label: "Pending bookings", value: overview.pendingCount, icon: Clock, href: "/admin/bookings" },
    { label: "Total bookings", value: overview.totalBookings, icon: CalendarCheck, href: "/admin/bookings" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">A quick look at your site content and bookings.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{c.value}</div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
