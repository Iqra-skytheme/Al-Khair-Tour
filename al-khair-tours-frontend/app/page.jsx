import Link from "next/link";
import { ShieldCheck, Clock, BadgeCheck, MapPin, ArrowRight, Star, Plane, Building2, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingForm } from "@/components/booking/booking-form";
import { BRAND } from "@/lib/constants";
import { getVehicles, getZiyaratPackages } from "@/lib/data";

export const revalidate = 0;

const trustPoints = [
  { icon: BadgeCheck, title: "Fixed prices", desc: "No surge, no haggling" },
  { icon: ShieldCheck, title: "Verified drivers", desc: "Licensed & insured" },
  { icon: Clock, title: "24/7 support", desc: "WhatsApp any time" },
  { icon: Star, title: "Trusted by pilgrims", desc: "English · Urdu · Arabic" },
];

const services = [
  {
    icon: Plane,
    id: "airport",
    title: "Airport transfers",
    desc: "Meet-and-greet at Jeddah (JED) and Madinah (MED). Flight tracked, fixed fares.",
  },
  {
    icon: MapPin,
    id: "ziyarat",
    title: "Ziyarat journeys",
    desc: "Jeddah → Makkah → Madinah with hospitality suited to your pilgrimage.",
  },
  {
    icon: Building2,
    id: "group",
    title: "Group & family",
    desc: "Families and groups traveling together. Discreet, fixed-price bookings.",
  },
  {
    icon: Clock,
    id: "hourly",
    title: "Hourly chauffeur",
    desc: "By the hour, at your disposal. Meetings, dining, family days out.",
  },
];

export default async function Home() {
  const [VEHICLES, ZIYARAT] = await Promise.all([getVehicles(), getZiyaratPackages()]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(20,40,32,0.75) 0%, rgba(20,40,32,0.85) 100%), url('https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div className="text-cream">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              Licensed · Verified drivers · Fixed prices
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              Makkah & Madinah Ziyarat
              <br />+ reliable rides
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              {BRAND.name} arranges airport transfers, city rides, and guided Ziyarat tours for
              pilgrims — at fixed, transparent prices.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/booking">
                  Book a ride <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/ziyarat">View Ziyarat packages</Link>
              </Button>
            </div>
          </div>

          <Card className="border-border/60 shadow-xl">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="font-display text-xl font-semibold">Quick booking</div>
                <div className="text-sm text-muted-foreground">Get a WhatsApp confirmation in minutes.</div>
              </div>
              <BookingForm vehicles={VEHICLES} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicles */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="Rides"
          title="Choose your vehicle"
          desc="Fixed-price transfers between Jeddah, Makkah, and Madinah — plus half & full-day Ziyarat rides."
          to="/rides"
          toLabel="See all rides"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {VEHICLES.slice(0, 3).map((v) => {
            const validPrices = v.routes?.filter((r) => r.priceSAR > 0).map((r) => r.priceSAR) ?? [];
            return (
              <Card
                key={v.id}
                className="group flex h-full flex-col overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <Link href={`/rides/${v.id}`} className="relative block">
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-muted to-muted/60">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="h-full w-full scale-125 object-contain object-center transition-transform duration-500 group-hover:scale-[1.35]"
                    />
                    <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
                      {v.category}
                    </div>
                  </div>
                </Link>
                <CardContent className="flex flex-1 flex-col p-5">
                  <Link href={`/rides/${v.id}`} className="block flex-1">
                    <div className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
                      {v.name}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {v.seats} seats
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" /> {v.luggage} luggage
                      </span>
                    </div>
                    {v.features?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {v.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="rounded-full bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                    {validPrices.length > 0 ? (
                      <div className="text-sm text-muted-foreground">
                        From{" "}
                        <span className="font-display text-lg font-semibold text-primary">
                          SAR {Math.min(...validPrices)}
                        </span>
                      </div>
                    ) : (
                      <span />
                    )}
                    <Button asChild size="sm" className="shrink-0 gap-1.5">
                      <Link href={`/rides/${v.id}`}>
                        Book Now <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {VEHICLES.length === 0 && (
            <p className="text-sm text-muted-foreground">No vehicles available yet.</p>
          )}
        </div>
      </section>

      {/* Ziyarat */}
      <section className="bg-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeader
            eyebrow="Ziyarat"
            title="Guided tours in Makkah & Madinah"
            desc="Small groups, historical guides, and comfortable A/C vehicles. Prices are all-inclusive."
            to="/ziyarat"
            toLabel="View all packages"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {ZIYARAT.slice(0, 4).map((p) => (
              <Card key={p.id} className="h-full overflow-hidden border-border/60 transition hover:shadow-lg">
                <Link href={`/ziyarat/${p.id}`} className="group block">
                  <div className="grid sm:grid-cols-[40%_1fr]">
                    <div className="relative aspect-video overflow-hidden bg-muted sm:aspect-auto sm:h-48 lg:h-52">
                      <img
                        src={p.hero}
                        alt={p.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="flex flex-col p-5">
                      <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        <MapPin className="h-3 w-3" /> {p.city}
                      </div>
                      <div className="mt-2.5 font-display text-lg font-semibold leading-snug">{p.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {p.duration}
                        {p.duration && p.guide_languages?.length ? " · " : ""}
                        {p.guide_languages?.length ? `Guide: ${p.guide_languages.join(", ")}` : ""}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>

                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                        {p.price_sar > 0 ? (
                          <div className="text-sm text-muted-foreground">
                            From{" "}
                            <span className="font-display text-base font-semibold text-primary">
                              SAR {p.price_sar}
                            </span>
                          </div>
                        ) : (
                          <span />
                        )}
                        <Button asChild size="sm" className="shrink-0 gap-1.5">
                          <span>
                            Book Now <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Link>
              </Card>
            ))}
            {ZIYARAT.length === 0 && (
              <p className="text-sm text-muted-foreground">No packages available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
          <span className="h-px w-6 bg-primary" /> Our services
        </div>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          Every ride, tailored to the reason for the journey.
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Whether you are arriving for Ziyarat or moving between the two holy cities, every ride is
          arranged with the same fixed-price reliability.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Card key={s.id} className="flex h-full flex-col border-border/60 transition hover:shadow-lg">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <Link
                    href={`/services#${s.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Learn more
                  </Link>
                  <Button asChild size="sm" className="shrink-0 gap-1.5">
                    <Link href="/booking">
                      Book Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to book?</h2>
          <p className="mx-auto mt-2 max-w-xl text-primary-foreground/80">
            Message us on WhatsApp and receive a fixed-price quote within minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Booking form</Link>
            </Button>
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ eyebrow, title, desc, to, toLabel }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary">{eyebrow}</div>
        <h2 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>
      </div>
      <Link
        href={to}
        className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
      >
        {toLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}