import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { getZiyaratPackages } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";

export const revalidate = 0;

export const metadata = {
  title: "Ziyarat Packages | Al-Khair Tours",
  description: "Guided Ziyarat tours in Makkah and Madinah with English, Urdu, and Arabic-speaking guides. Half-day and full-day options.",
  openGraph: {
    title: "Ziyarat Packages | Al-Khair Tours",
    description: "Guided Ziyarat tours in Makkah and Madinah.",
  },
};

export default async function ZiyaratListPage() {
  const ZIYARAT = await getZiyaratPackages();

  const cities = [...new Set(ZIYARAT.map((p) => p.city))];

  return (
    <>
      <PageHeader
        eyebrow="Ziyarat"
        title="Guided tours in the two holy cities"
        desc="Historical stops, comfortable A/C vehicles, and knowledgeable guides."
      />
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {cities.map((city) => (
            <CityBlock key={city} city={city} packages={ZIYARAT.filter((p) => p.city === city)} />
          ))}
        </div>
        {cities.length === 0 && (
          <p className="text-sm text-muted-foreground">No packages yet.</p>
        )}
      </section>
    </>
  );
}

function CityBlock({ city, packages }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">{city} packages</h2>
      <div className="mt-6 grid gap-6">
        {packages.map((p) => (
          <Card key={p.id} className="h-full overflow-hidden transition hover:shadow-lg">
            <Link href={`/ziyarat/${p.id}`} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={p.hero} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <CardContent className="p-5 pb-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                  <MapPin className="h-3 w-3" /> {p.city} · {p.duration}
                </div>
                <div className="mt-1 font-display text-xl font-semibold">{p.title}</div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>
              </CardContent>
            </Link>
            <CardContent className="flex items-center justify-between gap-3 pt-4">
              {p.price_sar ? (
                <div className="text-sm font-medium">
                  SAR <span className="text-primary">{p.price_sar}</span>
                </div>
              ) : (
                <span />
              )}
              <Button asChild size="sm" className="gap-1.5">
                <Link href={`/ziyarat/${p.id}`}>
                  Book Now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}