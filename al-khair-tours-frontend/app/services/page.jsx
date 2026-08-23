import Link from "next/link";
import { Plane, MapPin, Building2, Clock, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Services | Al-Khair Tours",
  description: "Airport transfers, Ziyarat packages, group bookings, and hourly rides across Makkah and Madinah.",
  openGraph: {
    title: "Services | Al-Khair Tours",
    description: "Airport transfers, Ziyarat packages, group bookings, and hourly rides across Makkah and Madinah.",
  },
};

const services = [
  {
    icon: Plane,
    id: "airport",
    title: "Airport transfers",
    desc: "Meet-and-greet at Jeddah (JED) and Madinah (MED) airports. Your driver tracks the flight and waits inside arrivals with a name-card and cold water.",
    features: ["Live flight tracking", "Free waiting time", "Meet & greet at arrivals", "Child seats on request"],
    href: "/rides",
  },
  {
    icon: MapPin,
    id: "ziyarat",
    title: "Ziyarat packages",
    desc: "Guided Ziyarat tours in Makkah and Madinah — historical stops, comfortable A/C vehicles, and knowledgeable guides who speak English, Urdu, and Arabic.",
    features: ["Small group tours", "English · Urdu · Arabic guides", "All-inclusive pricing", "Half-day & full-day options"],
    href: "/ziyarat",
  },
  {
    icon: Building2,
    id: "group",
    title: "Group & family bookings",
    desc: "Dedicated vehicles for families and groups traveling together — from small sedans to large VIP vans, all with fixed, transparent pricing.",
    features: ["Multiple vehicle sizes", "Fixed group pricing", "Luggage space guaranteed", "One point of contact"],
    href: "/rides",
  },
  {
    icon: Clock,
    id: "hourly",
    title: "Hourly & full-day rides",
    desc: "A car and driver at your disposal — by the hour, half-day, or full-day. Perfect for city rides between the two holy cities or a flexible itinerary.",
    features: ["Flexible durations", "Wait time included", "Multi-stop itineraries", "Fixed prices — no surge"],
    href: "/rides",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Every ride, tailored to the reason for the journey."
        desc="Airport transfers, Ziyarat tours, group bookings, and hourly rides — all at fixed, transparent prices."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6">
          {services.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className="grid gap-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:grid-cols-[1fr_1.5fr] md:p-10"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">0{i + 1}</div>
                </div>
                <h2 className="mt-5 font-display text-3xl md:text-4xl">{s.title}</h2>
              </div>
              <div>
                <p className="leading-relaxed text-muted-foreground">{s.desc}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 gap-2">
                  <Link href={s.href}>
                    Book this service <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}