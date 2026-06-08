import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')
  
  const { data: profile } = await supabase
    .from('users')
    .select('name, email, avatar_url, company_name')
    .eq('id', user.id)
    .single()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar
        user={{
          name: profile?.name || user.user_metadata?.name,
          email: profile?.email || user.email,
          avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
        }}
      />
      <main className="dashboard-main" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  )
}
