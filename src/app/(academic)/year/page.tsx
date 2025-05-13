// app/(academic)/year/page.tsx
'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from '@/lib/motion-utils'
import Footer from '@/components/landingpage/footer'
import Header from '@/components/landingpage/header'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'

const years = [
  { id: '1', name: 'First Year' },
  { id: '2', name: 'Second Year' },
  { id: '3', name: 'Third Year' },
  { id: '4', name: 'Fourth Year' },
]

export default function YearPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Select Academic Year</h1>
            <div className="mt-4 md:mt-0">
              <Button variant="secondary" onClick={() => router.push('/upload')}>
                <FileText className="mr-2 h-4 w-4" /> Upload Notes
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {years.map((year) => (
              <motion.div
                key={year.id}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/${year.id}/semester`}>
                  <Button className="w-full h-24 text-lg">
                    {year.name}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>      </main>
      <Footer />
    </div>
  )
}