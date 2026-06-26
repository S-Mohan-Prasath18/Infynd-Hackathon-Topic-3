-- Seed admin role for the seeded admin email.
-- If the admin user already exists, this ensures they are assigned the admin role.

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE lower(email) = 'stsoftwaresolution@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
