import Link from "next/link";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { BRAND, whatsappHref } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-semibold text-foreground">
            {BRAND.name}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{BRAND.tagline}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {BRAND.license}
          </p>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-foreground">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/rides" className="hover:text-foreground">Rides</Link></li>
            <li><Link href="/ziyarat" className="hover:text-foreground">Ziyarat packages</Link></li>
            <li><Link href="/booking" className="hover:text-foreground">Book a ride</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-foreground">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> SA {BRAND.phoneSA}</li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> PK {BRAND.phonePK}</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {BRAND.email}</li>
            <li>
              <a href={whatsappHref()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
                <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold text-foreground">Trust</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Fixed prices — no surge</li>
            <li>Verified & licensed drivers</li>
            <li>24/7 pilgrim support</li>
            <li>Free cancellation (12h)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  );
}