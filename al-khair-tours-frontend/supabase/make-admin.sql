-- Run this AFTER creating the admin user in Supabase Dashboard:
-- Authentication → Users → Add user → enter email + password → Create user
--
-- Then come back here, replace the email below with the exact email you used,
-- and run this whole file in the SQL Editor.

insert into public.user_roles (user_id, role)
select id, 'super_admin'
from auth.users
where email = 'REPLACE_WITH_ADMIN_EMAIL@example.com'
on conflict (user_id, role) do nothing;

-- Verify it worked — this should return one row:
select u.email, r.role
from public.user_roles r
join auth.users u on u.id = r.user_id
where u.email = 'REPLACE_WITH_ADMIN_EMAIL@example.com';
