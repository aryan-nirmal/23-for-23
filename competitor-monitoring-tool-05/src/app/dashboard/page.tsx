'use client';

import { MOCK_CHANGES, getCompetitorName } from '@/lib/store';
import { ExternalLink, Tag, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardHistory() {
  return (
    <div style={{ padding: '2.5rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'none', WebkitTextFillColor: 'initial', color: 'var(--foreground)' }}>Change Feed</h1>
          <p style={{ color: 'var(--text-muted)' }}>Latest updates detected across your tracked competitors.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="input-field" style={{ padding: '0.5rem', width: 'auto' }}>
            <option>All Categories</option>
            <option>Pricing</option>
            <option>Hiring</option>
            <option>Product</option>
          </select>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {MOCK_CHANGES.map((change) => {
          const compName = getCompetitorName(change.competitorId);
          
          return (
            <div key={change.id} className="card animate-fade-in" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--foreground)' }}>{compName}</div>
                  <span className={`badge badge-${change.category}`}>
                    <Tag size={12} style={{ marginRight: '0.25rem' }} />
                    {change.category}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(change.date), { addSuffix: true })}
                </div>
              </div>
              
              <p style={{ fontSize: '1rem', color: 'var(--foreground)', marginBottom: '1.5rem', fontWeight: 500 }}>
                {change.summary}
              </p>
              
              <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {change.diff.removed && (
                  <div style={{ marginBottom: change.diff.added ? '1rem' : 0 }}>
                    <span className="diff-removed">- {change.diff.removed}</span>
                  </div>
                )}
                {change.diff.added && (
                  <div>
                    <span className="diff-added">+ {change.diff.added.split('\n').map((line, i) => <div key={i} style={{ display: 'inline-block', width: '100%' }}>{line}</div>)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a href={change.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 500 }}>
                  View source page <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
