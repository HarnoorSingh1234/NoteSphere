'use client'

import { motion } from "framer-motion"
import { LayoutDashboard, Users, ImageIcon, Settings, LogOut, Book, BookA, BookAIcon, BookOpen} from "lucide-react"
import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

interface AdminSidebarProps {
  children: React.ReactNode
}

interface LinkItem {
  label: string
  href: string
  icon: React.ReactNode
}

export default function UserSidebar({ children }: AdminSidebarProps) {
  const [open, setOpen] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
const iconClass = 'text-indigo-800 dark:text-indigo-200  h-5 w-5 flex-shrink-0'
  const links: LinkItem[] = [
    {
      label: 'Dashboard',
      href: '/admin-dashboard',
      icon: <LayoutDashboard className={iconClass} />,
    },
    {
      label: 'Notes',
      href: '/notes',
      icon: <BookOpen className={iconClass} />,
    },
   
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900/20 to-indigo-900/10">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between bg-gradient-to-br from-purple-900/10 to-indigo-950/20 gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="pb-4">
            {isLoaded && isSignedIn && user ? (
              <SidebarLink
                link={{
                  label: user.firstName ?? 'Profile',
                  href: '/profile',
                  icon: (
                    <Image
                      src={user.imageUrl}
                      className="h-7 w-7 rounded-full"
                      width={28}
                      height={28}
                      alt="Your Avatar"
                    />
                  ),
                }}
              />
            ) : (
              <SidebarLink
                link={{
                  label: 'Sign In',
                  href: '/sign-in',
                  icon: <LogOut className={iconClass} />,
                }}
              />
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 p-4 md:p-10">{children}</main>
    </div>
  )
}

const Logo = () => (
  <Link
    href="/"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <Book className="text-indigo-600 dark:text-indigo-400"/>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-indigo-800 dark:text-indigo-400 whitespace-pre"
    >
        NoteSphere
    </motion.span>
  </Link>
)

const LogoIcon = () => (
  <Link
    href="/user-dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
   <Book className="text-indigo-600 dark:text-indigo-400"/>
  </Link>
)
