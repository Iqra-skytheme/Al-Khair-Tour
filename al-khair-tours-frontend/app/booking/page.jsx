import { Card, CardContent } from "@/components/ui/card";
import { BookingForm } from "@/components/booking/booking-form";
import { PageHeader } from "@/components/layout/page-header";
import { getVehicles } from "@/lib/data";

export const revalidate = 0;

export const metadata = {
  title: "Book a Ride | Al-Khair Tours",
  description: "Book an airport transfer, city ride, or Ziyarat tour. Fixed prices, verified drivers, and WhatsApp confirmation in minutes.",
  openGraph: {
    title: "Book a Ride | Al-Khair Tours",
    description: "Fixed-price rides & Ziyarat, confirmed on WhatsApp.",
  },
};

export default async function BookingPage() {
  const vehicles = await getVehicles();
  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Book your ride or Ziyarat"
        desc="Fill in your details — we'll open WhatsApp with everything pre-filled so we can confirm instantly."
      />
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <BookingForm vehicles={vehicles} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
