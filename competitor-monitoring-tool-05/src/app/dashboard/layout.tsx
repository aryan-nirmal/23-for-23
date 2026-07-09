'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Mail, Settings, Activity, Plus } from 'lucide-react';
import { MOCK_COMPETITORS } from '@/lib/store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Change Feed', href: '/dashboard', icon: Activity },
    { name: 'Competitors', href: '/dashboard/competitors', icon: Users },
    { name: 'Digest Settings', href: '/dashboard/digest', icon: Mail },
    { name: 'Workspace', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}>
            <LayoutDashboard size={20} />
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>PulseAI</span>
        </div>

        <div style={{ padding: '1.5rem 1rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>Menu</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
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
                    padding: '0.6rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    background: isActive ? 'var(--surface-hover)' : 'transparent',
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Monitored Competitors</div>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer' }}>
              <Plus size={16} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {MOCK_COMPETITORS.map((comp) => (
              <div key={comp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: comp.status === 'active' ? 'var(--success)' : 'var(--error)' }} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--background)' }}>
        {children}
      </main>
    </div>
  );
}
