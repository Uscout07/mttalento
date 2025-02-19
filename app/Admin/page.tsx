import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ActorProfileEditor from '../components/admin';

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Debugging: Log session
  console.log('Session:', session);

  // If user not logged in, redirect to /login
  if (!session) {
    redirect('/login');
  }

  // Otherwise, render the page
  return (
    <ActorProfileEditor />
  );
}
