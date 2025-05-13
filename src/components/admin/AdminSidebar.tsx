'use client'

import { motion } from "@/lib/motion-utils"
import { LayoutDashboard, Users, Book, BookOpen, Upload, Settings, LogOut} from "lucide-react"
import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { useUser, SignOutButton } from "@clerk/nextjs"
import styled from "styled-components"

interface AdminSidebarProps {
  children: React.ReactNode
}

interface LinkItem {
  label: string
  href: string
  icon: React.ReactNode
  onClick?: () => void
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [open, setOpen] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
  const iconClass = 'text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0'
  
  const links: LinkItem[] = [
    {
      label: 'Dashboard',
      href: '/admin-dashboard',
      icon: <LayoutDashboard className={iconClass} />,
    },
    {
      label: 'Manage Notes',
      href: '/notes',
      icon: <Book className={iconClass} />,
    },
    {
      label: 'Manage Subjects',
      href: '/subjects',
      icon: <BookOpen className={iconClass} />,
    },
    {
      label: 'Manage Users',
      href: '/users',
      icon: <Users className={iconClass} />,
    },
    {
      label: 'Upload Notes',
      href: '/upload',
      icon: <Upload className={iconClass} />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className={iconClass} />,
    },
  ]

  // Add logout action
  const logoutLink: LinkItem = {
    label: 'Logout',
    href: '#',
    icon: <LogOut className={iconClass} />,
  }

  return (
    <SidebarContainer className="flex min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <SignOutButton>
                <button className="w-full">
                  <SidebarLink link={logoutLink} />
                </button>
              </SignOutButton>
            </div>
          </div>
          <div className="pb-4">
            {isLoaded && isSignedIn && user ? (
              <UserProfile user={user} />
            ) : null}
          </div>
        </SidebarBody>
      </Sidebar>

      <MainContent>{children}</MainContent>
    </SidebarContainer>
  )
}

const UserProfile = ({ user }: { user: any }) => (
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
)

const Logo = () => (
  <Link
    href="/admin-dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <div className="logo-icon" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre"
    >
      NoteSphere Admin
    </motion.span>
  </Link>
)

const LogoIcon = () => (
  <Link
    href="/admin-dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <div className="logo-icon" />
  </Link>
)

const SidebarContainer = styled.div`
  .logo-icon {
    height: 1.25rem;
    width: 1.5rem;
    background: linear-gradient(135deg, #DE5499, #E99F4C);
    border-radius: 0 0.375rem 0.375rem 0.125rem;
    flex-shrink: 0;
    position: relative;
    
    &::after {
      content: "";
      position: absolute;
      top: 0.3rem;
      left: 0.3rem;
      width: 0.5rem;
      height: 0.5rem;
      background: white;
      border-radius: 0.1rem;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;
