// Usage: npm run seed
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/db.js";
import { Vehicle } from "../src/models/Vehicle.js";
import { ZiyaratPackage } from "../src/models/ZiyaratPackage.js";

const vehicles = [
  {
    _id: "economy-camry",
    name: "Toyota Camry",
    category: "Economy",
    seats: 3,
    luggage: 3,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    routes: [
      { label: "Jeddah Airport → Makkah Hotel", priceSAR: 250 },
      { label: "Makkah Hotel → Madinah Hotel", priceSAR: 750 },
      { label: "Madinah Airport → Madinah Hotel", priceSAR: 150 },
    ],
    features: ["Air-conditioned", "Verified driver", "Free waiting 30 min", "Fixed price"],
    sort_order: 1,
  },
  {
    _id: "family-hiace",
    name: "Toyota Hiace",
    category: "Family",
    seats: 10,
    luggage: 10,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    routes: [
      { label: "Jeddah Airport → Makkah Hotel", priceSAR: 450 },
      { label: "Makkah Hotel → Madinah Hotel", priceSAR: 1200 },
      { label: "Makkah Ziyarat (half day)", priceSAR: 350 },
    ],
    features: ["Spacious for families", "Luggage room", "Bottled water", "Fixed price"],
    sort_order: 2,
  },
  {
    _id: "vip-gmc",
    name: "GMC Suburban",
    category: "VIP / Luxury",
    seats: 6,
    luggage: 6,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
    routes: [
      { label: "Jeddah Airport → Makkah Hotel", priceSAR: 700 },
      { label: "Makkah Hotel → Madinah Hotel", priceSAR: 1800 },
      { label: "Full-day Ziyarat", priceSAR: 900 },
    ],
    features: ["Premium interior", "English-speaking driver", "Refreshments", "Priority pickup"],
    sort_order: 3,
  },
];

const packages = [
  {
    _id: "makkah-half-day",
    city: "Makkah",
    title: "Makkah Ziyarat — Half Day",
    duration: "4 hours",
    price_sar: 350,
    hero: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80",
    summary: "Visit the historic sites around Makkah with a knowledgeable guide, in an air-conditioned vehicle.",
    stops: [
      "Jabal-e-Noor (Cave of Hira — view)",
      "Jabal-e-Thawr (view)",
      "Masjid-e-Jinn",
      "Masjid Aisha (Taneem — Miqat)",
      "Jannat-ul-Mualla",
      "Mina, Muzdalifah, Arafat drive-through",
    ],
    includes: ["A/C vehicle", "Fuel & tolls", "Guide", "Bottled water"],
    excludes: ["Personal expenses", "Entry fees where applicable"],
    guide_languages: ["English", "Urdu", "Arabic"],
    sort_order: 1,
  },
  {
    _id: "makkah-full-day",
    city: "Makkah",
    title: "Makkah Ziyarat — Full Day",
    duration: "8 hours",
    price_sar: 650,
    hero: "https://images.unsplash.com/photo-1565019011521-b0575cbb57c8?auto=format&fit=crop&w=1600&q=80",
    summary: "A full-day tour covering all major Makkah ziyarat spots plus additional historical stops.",
    stops: ["All Half-Day stops", "Hudaibiya", "Wadi-e-Jinn (optional)", "Panoramic viewpoints"],
    includes: ["A/C vehicle", "Fuel & tolls", "Guide", "Lunch stop"],
    excludes: ["Meals", "Personal expenses"],
    guide_languages: ["English", "Urdu", "Arabic"],
    sort_order: 2,
  },
  {
    _id: "madinah-classic",
    city: "Madinah",
    title: "Madinah Ziyarat — Classic",
    duration: "5 hours",
    price_sar: 400,
    hero: "https://images.unsplash.com/photo-1591793216550-c2b12bfa5843?auto=format&fit=crop&w=1600&q=80",
    summary: "Visit the blessed sites of Madinah with an experienced guide fluent in Urdu and English.",
    stops: [
      "Masjid-e-Quba",
      "Masjid-e-Qiblatain",
      "Jabal-e-Uhud & Martyrs of Uhud",
      "Baqi Cemetery (external)",
      "Seven Mosques (Sab'a Masajid)",
      "Date market",
    ],
    includes: ["A/C vehicle", "Fuel & tolls", "Guide", "Bottled water"],
    excludes: ["Dates & shopping", "Personal expenses"],
    guide_languages: ["English", "Urdu", "Arabic"],
    sort_order: 3,
  },
  {
    _id: "madinah-extended",
    city: "Madinah",
    title: "Madinah Ziyarat — Extended",
    duration: "7 hours",
    price_sar: 600,
    hero: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1600&q=80",
    summary: "An in-depth Madinah tour with additional stops and more time at each blessed site.",
    stops: ["All Classic stops", "Bir-e-Uthman (Well of Uthman)", "Masjid-e-Ghamama", "Historic date farms"],
    includes: ["A/C vehicle", "Fuel & tolls", "Guide", "Refreshments"],
    excludes: ["Meals", "Personal expenses"],
    guide_languages: ["English", "Urdu", "Arabic"],
    sort_order: 4,
  },
];

async function main() {
  await connectDB();

  for (const v of vehicles) {
    await Vehicle.findByIdAndUpdate(v._id, v, { upsert: true });
  }
  console.log(`Seeded ${vehicles.length} vehicles.`);

  for (const p of packages) {
    await ZiyaratPackage.findByIdAndUpdate(p._id, p, { upsert: true });
  }
  console.log(`Seeded ${packages.length} ziyarat packages.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
