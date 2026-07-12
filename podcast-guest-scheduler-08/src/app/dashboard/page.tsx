'use client';

import { useState } from 'react';
import { MOCK_GUESTS, Guest, GuestStage } from '@/lib/store';
import { MoreHorizontal, Calendar, Mail, CheckCircle2, PlayCircle } from 'lucide-react';

const STAGES: { id: GuestStage; label: string; color: string; icon: any }[] = [
  { id: 'invited', label: 'Invited', color: '#3b82f6', icon: Mail },
  { id: 'booked', label: 'Booked', color: '#8b5cf6', icon: Calendar },
  { id: 'recorded', label: 'Recorded', color: '#10b981', icon: PlayCircle },
  { id: 'published', label: 'Published', color: '#f59e0b', icon: CheckCircle2 },
];

export default function PipelinePage() {
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);

  const moveGuest = (guestId: string, newStage: GuestStage) => {
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, stage: newStage } : g));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {STAGES.map(stage => {
        const stageGuests = guests.filter(g => g.stage === stage.id);
        const Icon = stage.icon;

        return (
          <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-hover)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={16} color={stage.color} />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{stage.label}</h3>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '999px', color: 'var(--text-muted)' }}>
                {stageGuests.length}
              </span>
            </div>

            <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stageGuests.map(guest => (
                <div key={guest.id} style={{ background: 'var(--background)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', cursor: 'grab' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {guest.avatar_url ? (
                        <img src={guest.avatar_url} alt={guest.name} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                          {guest.name.charAt(0)}
                        </div>
                      )}
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{guest.name}</span>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {guest.bio.substring(0, 60)}...
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {guest.topic_keywords.map(topic => (
                      <span key={topic} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', background: 'rgba(109, 40, 217, 0.1)', color: 'var(--accent-light)' }}>
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Actions to move */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                    <select 
                      value={guest.stage}
                      onChange={(e) => moveGuest(guest.id, e.target.value as GuestStage)}
                      style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', background: 'var(--surface-hover)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '0.25rem', outline: 'none' }}
                    >
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id}>Move to {s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              
              {stageGuests.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--border)', fontSize: '0.85rem', padding: '2rem 0', fontStyle: 'italic' }}>
                  No guests
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
