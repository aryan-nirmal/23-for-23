'use client';

import Link from 'next/link';
import { FileText, Plus, Search, MoreVertical, LayoutTemplate } from 'lucide-react';
import { MOCK_SOPS } from '@/lib/store';

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <nav className="nav container" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="logo">
          <div style={{ background: 'var(--accent)', padding: '0.4rem', borderRadius: '0.5rem' }}>
            <FileText size={20} className="logo-icon" color="white" />
          </div>
          SOPGen Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            A
          </div>
        </div>
      </nav>

      <main className="container" style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'none', WebkitTextFillColor: 'initial', color: 'var(--foreground)' }}>Your SOPs</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage and export your standard operating procedures.</p>
          </div>
          <Link href="/generate" className="btn btn-primary">
            <Plus size={18} /> New SOP
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search SOPs..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', outline: 'none' }}
            />
          </div>
          <select style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', outline: 'none' }}>
            <option>All Industries</option>
            <option>Agency</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {MOCK_SOPS.map(sop => (
            <div key={sop.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{sop.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sop.industry}</span>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <MoreVertical size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>
                Contains {sop.sections.length} sections including Purpose, Scope, and Procedure.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Edited {new Date(sop.createdAt).toLocaleDateString()}
                </span>
                <Link href={`/generate`} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                  Open Editor
                </Link>
              </div>
            </div>
          ))}

          <Link href="/generate" className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', cursor: 'pointer', textDecoration: 'none', color: 'var(--foreground)', minHeight: '200px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <Plus size={24} />
            </div>
            <span style={{ fontWeight: 500 }}>Create New SOP</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Start from scratch with AI</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
