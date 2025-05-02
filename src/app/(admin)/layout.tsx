import AdminSidebar from '@/components/admin/AdminSidebar'
import { Footer } from '@/components/landingpage/footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <><AdminSidebar>
    {children}
    </AdminSidebar>
    <Footer/>
  </>
}
