
import { Footer } from '@/components/landingpage/footer'
import Navbar from '@/components/Navbar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return<>
             <Navbar/>
                {children}
            
          <Footer/>
        </>
}
