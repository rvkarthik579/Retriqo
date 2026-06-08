import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Ensure user profile exists
    await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      created_at: new Date().toISOString(),
    }, { onConflict: 'id', ignoreDuplicates: true })
    
    redirect('/dashboard')
  }
  
  redirect('/login')
}
