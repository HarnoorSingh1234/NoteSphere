import AdminSidebar from '@/components/admin/AdminSidebar'
import { Footer } from '@/components/landingpage/footer'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><AdminSidebar>
    {children}
    </AdminSidebar>
    <Footer/>
  </>
}
