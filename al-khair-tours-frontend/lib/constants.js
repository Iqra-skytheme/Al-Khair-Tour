export const BRAND = {
  name: "Al-Khair Tours",
  tagline: "Makkah & Madinah Ziyarat + Reliable Rides",
  license: "Saudi Tourism License #TL-XXXXXX",
  whatsapp: "966500000000", // placeholder — replace with real number
  phoneSA: "+966 50 000 0000",
  phonePK: "+92 300 0000000",
  email: "info@alkhairtours.example",
  hours: "24/7 support",
};

export function whatsappHref(message = "Assalamu Alaikum, I'd like to enquire about your services.") {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const FAQS = [
  {
    q: "Do I need a special visa for Umrah?",
    a: "Yes — pilgrims need an Umrah visa or an eligible tourist visa. Check the latest requirements with your local Saudi consulate or the Nusuk portal before travel.",
  },
  {
    q: "When is the best time for Ziyarat tours?",
    a: "Early morning (after Fajr) and late afternoon are the coolest and least crowded times. We schedule tours to avoid the midday heat.",
  },
  {
    q: "Are your prices fixed?",
    a: "Yes. All ride and Ziyarat prices are fixed and shown upfront. There are no hidden charges or surge pricing.",
  },
  {
    q: "Do drivers speak English or Urdu?",
    a: "Most of our drivers speak English and Urdu. Arabic-speaking drivers and guides are available on request.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation up to 12 hours before pickup. Cancellations within 12 hours may incur a partial charge. Contact us on WhatsApp for the fastest response.",
  },
  {
    q: "Do you help with Ihram?",
    a: "Our drivers know all Miqat points (including Masjid Aisha) and will stop for you to make niyyah and change into Ihram if needed.",
  },
];
