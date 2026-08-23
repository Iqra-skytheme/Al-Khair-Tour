import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getVehicles } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";

export const revalidate = 0;

export const metadata = {
  title: "Rides & Transfers | Al-Khair Tours",
  description: "Fixed-price airport transfers and city rides between Jeddah, Makkah, and Madinah. Choose Economy, Family, or VIP vehicles.",
  openGraph: {
    title: "Rides & Transfers | Al-Khair Tours",
    description: "Fixed-price rides between Jeddah, Makkah, and Madinah.",
  },
};

export default async function RidesPage() {
  const VEHICLES = await getVehicles();
  return (
    <>
      <PageHeader
        eyebrow="Rides"
        title="Comfortable rides at fixed prices"
        desc="Airport transfers, city rides, and Ziyarat vehicles across Jeddah, Makkah, and Madinah."
      />
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {VEHICLES.map((v) => (
            <Card key={v.id} className="flex h-full flex-col overflow-hidden transition hover:shadow-lg">
              <Link href={`/rides/${v.id}`} className="group block">
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img src={v.image} alt={v.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
              </Link>
              <CardContent className="flex flex-1 flex-col p-5">
                <Link href={`/rides/${v.id}`} className="block flex-1">
                  <div className="text-xs uppercase tracking-widest text-primary">{v.category}</div>
                  <div className="mt-1 font-display text-xl font-semibold">{v.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{v.seats} seats · {v.luggage} luggage</div>
                  {v.routes?.length > 0 ? (
                    <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                      {v.routes.slice(0, 3).map((r) => (
                        <li key={r.label} className="flex justify-between gap-3">
                          <span className="truncate">{r.label}</span>
                          <span className="shrink-0 font-medium text-foreground">SAR {r.priceSAR}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">Contact us for pricing</p>
                  )}
                </Link>

                <div className="mt-4 flex justify-end border-t border-border/60 pt-4">
                  <Button asChild size="sm" className="gap-1.5">
                    <Link href={`/rides/${v.id}`}>
                      Book Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}