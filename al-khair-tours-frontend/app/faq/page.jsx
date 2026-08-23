import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "FAQ | Al-Khair Tours",
  description: "Answers to common questions about Umrah visas, Ziyarat timing, Ihram, pricing, and cancellations.",
  openGraph: {
    title: "FAQ | Al-Khair Tours",
    description: "Umrah, Ziyarat, and travel questions answered.",
  },
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        desc="Everything you need to know before booking with Al-Khair Tours."
      />
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
