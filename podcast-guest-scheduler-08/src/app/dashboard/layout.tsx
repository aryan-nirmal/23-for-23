'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Settings, LogOut, Radio } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Pipeline', href: '/dashboard', icon: Users },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Show Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden" style={{ display: 'flex', height: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '0.5rem' }}>
            <Radio size={20} color="white" />
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>GuestFlow</span>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Menu</div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'rgba(109, 40, 217, 0.15)' : 'transparent',
                  transition: 'all 0.2s ease',
                  fontWeight: isActive ? 500 : 400
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-light)' : 'var(--text-muted)'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', width: '100%', padding: '0.5rem', borderRadius: '0.5rem', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--background)' }}>
        <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(10, 10, 12, 0.8)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Pipeline</h1>
          <Link href="/book/demo-show" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} target="_blank">
            Preview Booking Page
          </Link>
        </header>
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
