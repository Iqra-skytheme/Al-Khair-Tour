# Backend Setup — Al-Khair Tours

Ye 2 **bilkul alag, independent projects** hain (do alag folders, do alag `package.json`, do alag `npm install`):

```
al-khair-tours-backend/     ← Node.js + Express.js (Supabase se baat karta hai, REST API deta hai)
al-khair-tours-frontend/    ← Next.js (website + admin panel, Express API ko call karta hai)
```

In dono ko alag-alag terminal mein, alag-alag chalana hoga (ek Express ke liye, ek Next.js ke liye).

Pehle jo error tha (`supabaseUrl is required`) uski wajah sirf ye thi ke `.env.local` file missing thi. Ab architecture change ho chuki hai (Supabase se seedha baat sirf Express karta hai), isliye neeche diye gaye naye steps follow karein.

## 1. Supabase project

Aapke paas jo Supabase project already hai, us mein:

1. **SQL Editor** kholein → `al-khair-tours-frontend/supabase/setup.sql` file ka pura content paste karke run karein (agar pehle se run nahi kiya).
2. **Authentication → Users** mein ek admin user banayein (email + password).
3. **SQL Editor** mein ye query chalayein taake wo user admin ban jaye (uski UUID `auth.users` table se copy karein):
   ```sql
   insert into public.user_roles (user_id, role) values ('<USER_UUID>', 'super_admin');
   ```
4. **Settings → API** se ye 2 cheezein copy karein:
   - `Project URL`
   - `service_role` key (secret — sirf backend ke liye, kabhi frontend mein use na karein)

## 2. Backend chalana — `al-khair-tours-backend/` (Node.js + Express)

```bash
cd al-khair-tours-backend
cp .env.example .env
```

`.env` file kholein aur fill karein:

```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<aapki service_role key>
ADMIN_JWT_SECRET=<koi bhi lamba random string>
```

Phir:

```bash
npm install
npm run dev
```

Ye `http://localhost:5000` par chalega. Check karein: `http://localhost:5000/health` → `{"ok":true}` aana chahiye.

## 3. Frontend chalana — `al-khair-tours-frontend/` (Next.js)

Ek **naya/alag terminal** kholein:

```bash
cd al-khair-tours-frontend
cp .env.local.example .env.local
```

Default values (`http://localhost:5000`) local development ke liye theek hain — ye batati hain ke frontend ko backend kahan milega.

```bash
npm install
npm run dev
```

Ye `http://localhost:3000` par chalega. Ab dono servers (backend + frontend) ek sath chal rahe honge.

## Deployment (production)

- `al-khair-tours-backend/` ko kisi bhi Node hosting (Render, Railway, Fly.io, a VPS, etc.) par alag se deploy karein.
- `al-khair-tours-frontend/` ko Vercel (ya kahin aur) par alag se deploy karein — deploy karte waqt `API_URL` aur `NEXT_PUBLIC_API_URL` ko apne deployed backend ke URL par set karein.
- Backend ke `CORS_ORIGIN` env variable mein apne deployed frontend ka URL dalein.
- Production mein `ADMIN_JWT_SECRET` aur `SUPABASE_SERVICE_ROLE_KEY` ko secret rakhein — kabhi client-side code ya git mein commit na karein.

## Architecture recap

```
Browser  ──►  al-khair-tours-frontend (Next.js)  ──►  al-khair-tours-backend (Express API)  ──►  Supabase (Postgres)
```

- Public data (vehicles, ziyarat packages, booking submission) → frontend ki `lib/data.js`, `lib/actions.js`
- Admin login + CRUD → frontend ki `lib/admin-actions.js` (JWT token ek httpOnly cookie `admin_token` mein store hota hai)
- `middleware.js` har `/admin/*` request par backend se token verify karwata hai
