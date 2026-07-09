'use client';

import { MOCK_COMPETITORS } from '@/lib/store';
import { Plus, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CompetitorsPage() {
  return (
    <div style={{ padding: '2.5rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'none', WebkitTextFillColor: 'initial', color: 'var(--foreground)' }}>Monitored Competitors</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage the companies and pages you are tracking.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Competitor
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOCK_COMPETITORS.map(comp => (
          <div key={comp.id} className="card animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)' }}>
                <Globe size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{comp.name}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                  <span>{comp.domain}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {comp.status === 'active' ? (
                      <><CheckCircle2 size={12} color="var(--success)" /> Synced {formatDistanceToNow(new Date(comp.lastChecked), { addSuffix: true })}</>
                    ) : (
                      <><AlertCircle size={12} color="var(--error)" /> Crawl failed</>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary">Manage Pages</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
