import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { getVehicleById, getVehicles } from "@/lib/data";
import { BookingForm } from "@/components/booking/booking-form";
import { PageHeader } from "@/components/layout/page-header";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { rideId } = await params;
  const vehicle = await getVehicleById(rideId);
  if (!vehicle) return {};
  return {
    title: `${vehicle.name} — ${vehicle.category} Ride | Al-Khair Tours`,
    description: `Book a ${vehicle.name} (${vehicle.category}) with a verified driver at fixed prices.`,
    openGraph: {
      title: `${vehicle.name} — Al-Khair Tours`,
      description: `Fixed-price ${vehicle.category} ride.`,
      images: [vehicle.image],
    },
  };
}

export default async function RideDetail({ params }) {
  const { rideId } = await params;
  const [vehicle, vehicles] = await Promise.all([getVehicleById(rideId), getVehicles()]);
  if (!vehicle) notFound();

  const priceRoutes = vehicle.routes?.filter((r) => r.priceSAR > 0) ?? [];

  return (
    <>
      <PageHeader
        eyebrow={vehicle.category}
        title={vehicle.name}
        desc={`Seats ${vehicle.seats} passengers with room for ${vehicle.luggage} luggage. All prices include fuel, tolls, and a verified driver.`}
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-muted">
            <img src={vehicle.image} alt={vehicle.name} className="aspect-[16/10] w-full object-cover" />
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="font-display text-lg font-semibold">Fixed prices</div>
                {priceRoutes.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm">
                    {priceRoutes.map((r) => (
                      <li key={r.label} className="flex justify-between gap-3">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-medium">SAR {r.priceSAR}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Contact us for pricing</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="font-display text-lg font-semibold">What&apos;s included</div>
                {vehicle.features?.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {vehicle.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Contact us for details</p>
                )}
              </CardContent>
            </Card>
          </div>
          <Button asChild variant="ghost" className="mt-6 gap-2">
            <Link href="/rides"><ArrowLeft className="h-4 w-4" /> Back to rides</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="font-display text-xl font-semibold">Book this vehicle</div>
              <div className="text-sm text-muted-foreground">We reply on WhatsApp within minutes.</div>
            </div>
            <BookingForm defaultVehicle={vehicle.id} vehicles={vehicles} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}