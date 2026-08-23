import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, Clock, Languages, ArrowLeft } from "lucide-react";
import { getZiyaratPackageById } from "@/lib/data";
import { getVehicles } from "@/lib/data";
import { BookingForm } from "@/components/booking/booking-form";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { packageId } = await params;
  const pkg = await getZiyaratPackageById(packageId);
  if (!pkg) return {};
  return {
    title: `${pkg.title} | Al-Khair Tours`,
    description: pkg.summary,
    openGraph: {
      title: `${pkg.title} | Al-Khair Tours`,
      description: pkg.summary,
      images: [pkg.hero],
    },
  };
}

export default async function ZiyaratDetail({ params }) {
  const { packageId } = await params;
  const [pkg, vehicles] = await Promise.all([getZiyaratPackageById(packageId), getVehicles()]);
  if (!pkg) notFound();

  return (
    <>
      <div className="relative">
        <div className="aspect-[21/9] w-full overflow-hidden bg-muted">
          <img src={pkg.hero} alt={pkg.title} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="mx-auto -mt-24 max-w-7xl px-4">
          <div className="relative rounded-xl bg-background/95 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <MapPin className="h-3 w-3" /> {pkg.city}
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{pkg.title}</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">{pkg.summary}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {pkg.duration}</span>
              <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4" /> {pkg.guide_languages.join(", ")}</span>
              {pkg.price_sar ? (
                <span className="font-medium text-foreground">SAR {pkg.price_sar}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <div className="font-display text-lg font-semibold">Visit place</div>
              <ol className="mt-3 space-y-2 text-sm">
                {pkg.stops.map((s, i) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="font-display text-lg font-semibold">Includes</div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {pkg.includes.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="font-display text-lg font-semibold">Not included</div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {pkg.excludes.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 text-destructive" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/ziyarat"><ArrowLeft className="h-4 w-4" /> Back to packages</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="font-display text-xl font-semibold">Book this Ziyarat</div>
              <div className="text-sm text-muted-foreground">Tell us your dates — we confirm on WhatsApp.</div>
            </div>
            <BookingForm vehicles={vehicles} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}