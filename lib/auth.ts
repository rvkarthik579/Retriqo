import { getSupabaseBrowserClient } from './supabase'

export async function getUser() {
  const supabase = getSupabaseBrowserClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function getUserProfile() {
  const supabase = getSupabaseBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) return null
  return data
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  await supabase.auth.signOut()
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })
  
  if (!error && data.user) {
    // Create user profile row
    await supabase.from('users').upsert({
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
    })
  }
  
  return { data, error }
}

export async function signInWithGoogle() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  })
  return { data, error }
}
