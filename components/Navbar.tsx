'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Portfolio', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Journal', href: '/journal' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-200 backdrop-blur-md border-b border-gray-100">
      <div className="container-max">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-fashion-black"
          >
            PG Fashion
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-fashion-black transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-fashion-black"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-gradient-to-b from-amber-50 to-amber-100">
            <div className="py-4 space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-2 py-2 text-sm text-gray-700 hover:text-fashion-black"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
