import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = 'stsoftwaresolution@gmail.com';
const PASSWORD = 'Admin@12345';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log(`Checking for existing Supabase user: ${EMAIL}`);

  // Try to list users to find existing one
  let userId;
  try {
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = users?.users?.find((u) => u.email?.toLowerCase() === EMAIL.toLowerCase());
    if (existingUser) {
      userId = existingUser.id;
      console.log(`Found existing user with id ${userId}.`);
    }
  } catch (err) {
    console.warn('Could not list users, will attempt to create:', err.message);
  }

  if (!userId) {
    console.log('Creating new admin user...');
    const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
    });

    if (createError) {
      throw createError;
    }

    userId = newUserData?.user?.id;
    if (!userId) {
      throw new Error('Failed to obtain user ID after admin user creation.');
    }

    console.log(`Created new user with id ${userId}.`);
  }

  console.log('Ensuring admin role is assigned...');
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role: 'admin' });

  // Ignore conflict if role already exists
  if (roleError && !roleError.message.includes('duplicate')) {
    throw roleError;
  }

  console.log('Admin role assigned successfully.');
  console.log('Admin login credentials:');
  console.log(`  Email: ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
}

main().catch((error) => {
  console.error('Error seeding admin account:', error.message || error);
  process.exit(1);
});
