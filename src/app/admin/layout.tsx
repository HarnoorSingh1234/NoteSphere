import { Footer } from '@/components/landingpage/footer'
import Navbar from '@/components/Navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>  
    <Navbar/>
    <>
      {children}
    </>
    <Footer/>
  </>
}
