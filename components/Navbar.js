'use client'

import Link from 'next/link'
import { Hexagon, User, Menu, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
    }).catch(err => console.error("Auth error:", err))

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <nav className="w-full bg-[#FDFBF7] relative z-50">
      <div className="flex justify-between items-center py-6 px-6 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#2F3D3C] font-semibold text-xl">
          <div className="w-8 h-8 rounded-lg bg-[#4B635F] flex items-center justify-center">
            <Hexagon className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span>Kinetic Logic</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-[#7B8B88]">
          <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-[#2F3D3C] font-bold' : 'hover:text-[#2F3D3C]'}`}>Home</Link>
          <Link href="/Practice" className={`transition-colors ${pathname === '/Practice' ? 'text-[#2F3D3C] font-bold' : 'hover:text-[#2F3D3C]'}`}>Practice</Link>
          {user && (
            <Link href="/Dashboard" className={`transition-colors ${pathname === '/Dashboard' ? 'text-[#2F3D3C] font-bold' : 'hover:text-[#2F3D3C]'}`}>Dashboard</Link>
          )}
          <Link href="/About" className={`transition-colors ${pathname === '/About' ? 'text-[#2F3D3C] font-bold' : 'hover:text-[#2F3D3C]'}`}>About</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:block">
          {user ? (
            <Link href="/Settings" className="w-10 h-10 rounded-full bg-[#EAECE6] flex items-center justify-center text-[#596A68] hover:bg-[#DCDEDB] transition-colors border border-[#EBEAE4]">
               <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link href="/login" className="px-6 py-2.5 rounded-full bg-[#BDE0D9] hover:bg-[#A3D1C8] text-[#1E564F] transition-colors text-sm font-bold inline-block shadow-sm">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button 
          className="md:hidden text-[#2F3D3C]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col">
          <div className="flex justify-between items-center py-6 px-6 border-b border-[#EBEAE4]/50">
            <Link href="/" className="flex items-center gap-2 text-[#2F3D3C] font-semibold text-xl" onClick={() => setIsMenuOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-[#4B635F] flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span>Kinetic Logic</span>
            </Link>
            <button className="text-[#2F3D3C]" onClick={() => setIsMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col py-8 px-6 gap-6 font-bold text-[#2F3D3C] text-xl h-full overflow-y-auto">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/Practice" onClick={() => setIsMenuOpen(false)}>Practice</Link>
            {user && (
              <Link href="/Dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            )}
            <Link href="/About" onClick={() => setIsMenuOpen(false)}>About</Link>
            
            <div className="pt-6 mt-auto pb-8 border-t border-[#EBEAE4]/50">
              {user ? (
                <Link href="/Settings" className="flex items-center gap-3 py-2 text-[#4B635F]" onClick={() => setIsMenuOpen(false)}>
                   <User className="w-6 h-6" /> Profile & Settings
                </Link>
              ) : (
                <Link href="/login" className="px-6 py-4 rounded-full bg-[#BDE0D9] text-[#1E564F] text-center w-full block shadow-sm" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
