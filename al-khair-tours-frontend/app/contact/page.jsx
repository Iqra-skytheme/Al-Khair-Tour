import { Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, whatsappHref } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Contact | Al-Khair Tours",
  description: "Contact Al-Khair Tours on WhatsApp, phone, or email. 24/7 pilgrim support in Saudi Arabia and Pakistan.",
  openGraph: {
    title: "Contact Al-Khair Tours",
    description: "WhatsApp, phone, and email — 24/7 pilgrim support.",
  },
};

export default function ContactPage() {
  const items = [
    { icon: MessageCircle, title: "WhatsApp", value: `+${BRAND.whatsapp}`, href: whatsappHref() },
    { icon: Phone, title: "Saudi Arabia", value: BRAND.phoneSA, href: `tel:${BRAND.phoneSA.replace(/\s/g, "")}` },
    { icon: Phone, title: "Pakistan", value: BRAND.phonePK, href: `tel:${BRAND.phonePK.replace(/\s/g, "")}` },
    { icon: Mail, title: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: Clock, title: "Hours", value: BRAND.hours },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We reply on WhatsApp within minutes"
        desc="Reach us any time — before, during, or after your journey. Our team is on call 24/7."
      />
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((i) => (
            <a
              key={i.title}
              href={i.href}
              target={i.href?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-start gap-4 rounded-xl border border-border/60 bg-card p-5 transition hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                <i.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{i.title}</div>
                <div className="mt-1 font-medium text-foreground group-hover:text-primary">{i.value}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 rounded-xl bg-primary p-8 text-center text-primary-foreground">
          <div className="font-display text-2xl font-semibold">Prefer to chat?</div>
          <p className="mt-1 text-primary-foreground/80">Tap below to open WhatsApp with our team.</p>
          <Button asChild size="lg" variant="secondary" className="mt-4 gap-2">
            <a href={whatsappHref()} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
