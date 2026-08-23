# Al-Khair Tours — Backend (Node.js + Express, Supabase Auth + MongoDB/Mongoose)

**Architecture:**
- **Login/security** → Supabase Auth (only used to check email + password)
- **All real data** (vehicles, ziyarat packages, bookings, who's an admin) → MongoDB via Mongoose

Supabase's database (Postgres/SQL) is **not used at all** — only its Authentication service.

## 1. Supabase (for Auth only)

1. Apna existing Supabase project use kar sakte hain (koi table/SQL banane ki zaroorat nahi).
2. **Settings → API Keys** se ye 2 cheezein le lein:
   - `Project URL`
   - **Publishable / anon key** (secret `service_role` key nahi — wo yahan zaroorat hi nahi)
3. **Authentication → Users → Add user** — apne admin ka email + password bana lein, "Auto Confirm User" tick karein.

## 2. MongoDB (asal data ke liye)

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) par free account:
1. Cluster banayein
2. **Database Access** → user banayein
3. **Network Access** → `0.0.0.0/0` allow karein (development ke liye)
4. **Connect → Drivers** → connection string copy karein

## 3. `.env` banayein

```bash
cp .env.example .env
```

Fill karein:
```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=<publishable/anon key>
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/al-khair-tours
ADMIN_JWT_SECRET=koi_bhi_lamba_random_string
```

## 4. Install, sample data, admin access

```bash
npm install
npm run seed
npm run make-admin -- admin@example.com super_admin
npm run dev
```

`make-admin` sirf **MongoDB mein permission deta hai** — password Supabase mein hi hota hai (jo aap ne step 1.3 mein banaya). Dono jagah **same email** hona chahiye.

Check: `http://localhost:5000/health` → `{"ok":true}`

## Kaise kaam karta hai (login flow)

1. Admin `/admin/login` (frontend) par email/password submit karta hai
2. Backend Supabase Auth se password verify karwata hai
3. Agar sahi hai, MongoDB ke `adminroles` collection mein us email ki roles check karta hai
4. Agar role mili, apna JWT bana kar deta hai (isi se aage ki har admin request authorize hoti hai)
