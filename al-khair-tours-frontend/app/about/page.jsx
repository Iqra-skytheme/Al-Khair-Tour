import { ShieldCheck, Users, Clock, Heart } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "About Us | Al-Khair Tours",
  description:
    "Al-Khair Tours is a licensed Saudi operator providing fixed-price rides and Ziyarat tours for pilgrims from around the world.",
  openGraph: {
    title: "About Al-Khair Tours",
    description: "Licensed Saudi operator for pilgrim transport and Ziyarat.",
  },
};

export default function AboutPage() {
  const values = [
    { icon: ShieldCheck, title: "Licensed & verified", desc: `${BRAND.license}. Every driver is background-checked and briefed on pilgrim etiquette.` },
    { icon: Users, title: "Built for pilgrims", desc: "Guides fluent in English, Urdu, and Arabic. Vehicles suited to families and groups." },
    { icon: Clock, title: "24/7 availability", desc: "Flights land at all hours — we operate around the clock, especially in Ramadan and Hajj season." },
    { icon: Heart, title: "Fair, fixed prices", desc: "No surge, no haggling. Every route has a clear published price." },
  ];
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Trusted transport for Umrah & Ziyarat"
        desc={`${BRAND.name} was founded to give visiting pilgrims a stress-free, honest, and respectful travel experience across Jeddah, Makkah, and Madinah.`}
      />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border/60 bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-lg font-semibold">{v.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
