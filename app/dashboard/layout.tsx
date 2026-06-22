import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardClientLayout from '@/components/layout/DashboardClientLayout'

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  )
}
