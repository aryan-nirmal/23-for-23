'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity, LayoutDashboard, Bell, Globe, LogOut, Settings } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/monitors', label: 'Monitors', icon: Activity },
  { href: '/dashboard/incidents', label: 'Incidents', icon: Bell },
  { href: '/dashboard/status-pages', label: 'Status Pages', icon: Globe },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardNav({ user }: { user: User }) {
  const pathname = usePathname()
  const supabase = createClient()

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-gray-900/50 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Activity size={16} className="text-gray-950" />
          </div>
          <span className="font-bold text-white">PingWatch</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-bold">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => (window.location.href = '/'))}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
