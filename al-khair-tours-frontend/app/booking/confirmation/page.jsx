import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, whatsappHref } from "@/lib/constants";

export const metadata = {
  title: "Booking sent | Al-Khair Tours",
  description: "Your booking request has been sent to our team via WhatsApp.",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Booking request sent</h1>
      <p className="mt-3 text-muted-foreground">
        Thank you for choosing {BRAND.name}. Our team will confirm your booking on WhatsApp within minutes.
        If WhatsApp didn&apos;t open automatically, use the button below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="gap-2">
          <a href={whatsappHref()} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" /> Open WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
