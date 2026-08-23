
-- Enums
CREATE TYPE public.app_role AS ENUM ('super_admin', 'manager', 'support');
CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','assigned','in_progress','completed','cancelled','refunded');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  blocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security-definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

-- Profile policies
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_staff(auth.uid()));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles staff update" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'manager'));

-- user_roles policies
CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "user_roles super admin write" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drivers
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_no TEXT,
  license_verified BOOLEAN NOT NULL DEFAULT false,
  languages TEXT[] NOT NULL DEFAULT '{}',
  vehicle_ids TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  avg_rating NUMERIC(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO authenticated;
GRANT ALL ON public.drivers TO service_role;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drivers staff read" ON public.drivers FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "drivers manager write" ON public.drivers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'));

-- Vehicles (public read, staff write)
CREATE TABLE public.vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  seats INT NOT NULL,
  luggage INT NOT NULL,
  image TEXT,
  routes JSONB NOT NULL DEFAULT '[]',
  features TEXT[] NOT NULL DEFAULT '{}',
  available BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vehicles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicles public read" ON public.vehicles FOR SELECT TO anon, authenticated
  USING (available = true OR public.is_staff(auth.uid()));
CREATE POLICY "vehicles manager write" ON public.vehicles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'));

-- Ziyarat packages
CREATE TABLE public.ziyarat_packages (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL CHECK (city IN ('Makkah','Madinah')),
  title TEXT NOT NULL,
  duration TEXT,
  price_sar NUMERIC(10,2) NOT NULL,
  hero TEXT,
  summary TEXT,
  stops TEXT[] NOT NULL DEFAULT '{}',
  includes TEXT[] NOT NULL DEFAULT '{}',
  excludes TEXT[] NOT NULL DEFAULT '{}',
  guide_languages TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ziyarat_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ziyarat_packages TO authenticated;
GRANT ALL ON public.ziyarat_packages TO service_role;
ALTER TABLE public.ziyarat_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ziyarat public read" ON public.ziyarat_packages FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_staff(auth.uid()));
CREATE POLICY "ziyarat manager write" ON public.ziyarat_packages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'));

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL, -- 'ride' | 'ziyarat'
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
  package_id TEXT REFERENCES public.ziyarat_packages(id) ON DELETE SET NULL,
  pickup TEXT,
  dropoff TEXT,
  scheduled_at TIMESTAMPTZ,
  passengers INT,
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  price_sar NUMERIC(10,2),
  source TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX bookings_status_idx ON public.bookings(status);
CREATE INDEX bookings_scheduled_at_idx ON public.bookings(scheduled_at);
CREATE INDEX bookings_created_at_idx ON public.bookings(created_at DESC);
CREATE INDEX bookings_customer_phone_idx ON public.bookings(customer_phone);
CREATE INDEX bookings_driver_id_idx ON public.bookings(driver_id);
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings public insert" ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "bookings staff read" ON public.bookings FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR customer_user_id = auth.uid());
CREATE POLICY "bookings manager write" ON public.bookings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'manager'));
CREATE POLICY "bookings super admin delete" ON public.bookings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

-- Site settings
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_settings super admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_drivers_updated BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_ziyarat_updated BEFORE UPDATE ON public.ziyarat_packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed vehicles
INSERT INTO public.vehicles (id, name, category, seats, luggage, image, routes, features, sort_order) VALUES
('economy-camry','Toyota Camry','Economy',3,3,'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  '[{"label":"Jeddah Airport → Makkah Hotel","priceSAR":250},{"label":"Makkah Hotel → Madinah Hotel","priceSAR":750},{"label":"Madinah Airport → Madinah Hotel","priceSAR":150}]',
  ARRAY['Air-conditioned','Verified driver','Free waiting 30 min','Fixed price'],1),
('family-hiace','Toyota Hiace','Family',10,10,'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
  '[{"label":"Jeddah Airport → Makkah Hotel","priceSAR":450},{"label":"Makkah Hotel → Madinah Hotel","priceSAR":1200},{"label":"Makkah Ziyarat (half day)","priceSAR":350}]',
  ARRAY['Spacious for families','Luggage room','Bottled water','Fixed price'],2),
('vip-gmc','GMC Suburban','VIP / Luxury',6,6,'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
  '[{"label":"Jeddah Airport → Makkah Hotel","priceSAR":700},{"label":"Makkah Hotel → Madinah Hotel","priceSAR":1800},{"label":"Full-day Ziyarat","priceSAR":900}]',
  ARRAY['Premium interior','English-speaking driver','Refreshments','Priority pickup'],3);

-- Seed ziyarat packages
INSERT INTO public.ziyarat_packages (id, city, title, duration, price_sar, hero, summary, stops, includes, excludes, guide_languages, sort_order) VALUES
('makkah-half-day','Makkah','Makkah Ziyarat — Half Day','4 hours',350,'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80',
  'Visit the historic sites around Makkah with a knowledgeable guide, in an air-conditioned vehicle.',
  ARRAY['Jabal-e-Noor (Cave of Hira — view)','Jabal-e-Thawr (view)','Masjid-e-Jinn','Masjid Aisha (Taneem — Miqat)','Jannat-ul-Mualla','Mina, Muzdalifah, Arafat drive-through'],
  ARRAY['A/C vehicle','Fuel & tolls','Guide','Bottled water'],
  ARRAY['Personal expenses','Entry fees where applicable'],
  ARRAY['English','Urdu','Arabic'],1),
('makkah-full-day','Makkah','Makkah Ziyarat — Full Day','8 hours',650,'https://images.unsplash.com/photo-1565019011521-b0575cbb57c8?auto=format&fit=crop&w=1600&q=80',
  'A full-day tour covering all major Makkah ziyarat spots plus additional historical stops.',
  ARRAY['All Half-Day stops','Hudaibiya','Wadi-e-Jinn (optional)','Panoramic viewpoints'],
  ARRAY['A/C vehicle','Fuel & tolls','Guide','Lunch stop'],
  ARRAY['Meals','Personal expenses'],
  ARRAY['English','Urdu','Arabic'],2),
('madinah-classic','Madinah','Madinah Ziyarat — Classic','5 hours',400,'https://images.unsplash.com/photo-1591793216550-c2b12bfa5843?auto=format&fit=crop&w=1600&q=80',
  'Visit the blessed sites of Madinah with an experienced guide fluent in Urdu and English.',
  ARRAY['Masjid-e-Quba','Masjid-e-Qiblatain','Jabal-e-Uhud & Martyrs of Uhud','Baqi Cemetery (external)','Seven Mosques (Sab''a Masajid)','Date market'],
  ARRAY['A/C vehicle','Fuel & tolls','Guide','Bottled water'],
  ARRAY['Dates & shopping','Personal expenses'],
  ARRAY['English','Urdu','Arabic'],3),
('madinah-extended','Madinah','Madinah Ziyarat — Extended','7 hours',600,'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1600&q=80',
  'An in-depth Madinah tour with additional stops and more time at each blessed site.',
  ARRAY['All Classic stops','Bir-e-Uthman (Well of Uthman)','Masjid-e-Ghamama','Historic date farms'],
  ARRAY['A/C vehicle','Fuel & tolls','Guide','Refreshments'],
  ARRAY['Meals','Personal expenses'],
  ARRAY['English','Urdu','Arabic'],4);

-- Seed site settings
INSERT INTO public.site_settings (key, value) VALUES
('brand', '{"name":"Al-Khair Tours","tagline":"Makkah & Madinah Ziyarat + Reliable Rides","whatsapp":"966500000000","phoneSA":"+966 50 000 0000","phonePK":"+92 300 0000000","email":"info@alkhairtours.example","hours":"24/7 support"}');

-- Fix set_updated_at search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Revoke public execute on definer functions; grant only where needed
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;
