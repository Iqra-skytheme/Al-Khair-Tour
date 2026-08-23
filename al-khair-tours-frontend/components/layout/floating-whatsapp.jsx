import { whatsappHref } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function FloatingWhatsApp() {
  return (
    <a href={whatsappHref()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 grid h-16 w-16 place-items-center rounded-full bg-[#25D366] text-white shadow-md shadow-black/30 transition hover:scale-105">
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}