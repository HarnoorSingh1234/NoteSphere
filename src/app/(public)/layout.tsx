import AdminSidebar from '@/components/admin/AdminSidebar'
import { Footer } from '@/components/landingpage/footer'
import Navbar from '@/components/Navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>  
  <Navbar/>
    {children}
  
    <Footer/>
  </>
}
