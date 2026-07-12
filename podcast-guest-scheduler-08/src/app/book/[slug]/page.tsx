'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, Info, CheckCircle2 } from 'lucide-react';

export default function BookingPage({ params }: { params: { slug: string } }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to backend
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // success step
    }, 1500);
  };

  if (step === 3) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ background: 'var(--surface)', padding: '3rem', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center', maxWidth: '400px' }}>
          <CheckCircle2 size={48} color="var(--accent-light)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--foreground)' }}>You're Booked!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            A calendar invitation and preparation materials have been sent to your email. We look forward to having you on the show!
          </p>
          <button onClick={() => window.close()} className="btn btn-secondary" style={{ width: '100%' }}>Close Window</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
      {/* Left Panel: Show Info */}
      <div style={{ flex: '1', borderRight: '1px solid var(--border)', padding: '4rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 'auto' }}>
          <div style={{ width: 64, height: 64, background: 'var(--accent)', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>S</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--foreground)' }}>The Startup Engineering Podcast</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '500px' }}>
            Join our host Maya to discuss engineering leadership, scaling teams, and modern architecture. 
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
            <Clock size={20} />
            <span>45 Minutes Recording Time</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
            <Video size={20} />
            <span>Riverside.fm Studio Link Provided</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
            <Info size={20} />
            <span>Preparation brief sent 24h before recording</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Booking Flow */}
      <div style={{ flex: '1.5', padding: '4rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
        {step === 1 ? (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Select a Date & Time</h2>
            {/* Mock Calendar Grid */}
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 600 }}>
                  <span>May 2026</span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>&lt;</button>
                    <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>&gt;</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                  {/* Mock calendar days */}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setStep(2)}
                      style={{ 
                        padding: '0.75rem 0', 
                        border: 'none', 
                        background: [12, 14, 19, 21].includes(i+1) ? 'rgba(109, 40, 217, 0.15)' : 'transparent',
                        color: [12, 14, 19, 21].includes(i+1) ? 'var(--accent-light)' : 'var(--foreground)',
                        fontWeight: [12, 14, 19, 21].includes(i+1) ? 600 : 400,
                        cursor: [12, 14, 19, 21].includes(i+1) ? 'pointer' : 'not-allowed',
                        borderRadius: '0.5rem',
                        opacity: [12, 14, 19, 21].includes(i+1) ? 1 : 0.3
                      }}
                      disabled={![12, 14, 19, 21].includes(i+1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mock Time Slots */}
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Available slots for selected date</div>
                {['09:00 AM', '11:30 AM', '02:00 PM', '04:15 PM'].map(time => (
                  <button 
                    key={time}
                    onClick={() => setStep(2)}
                    style={{
                      padding: '1rem',
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-light)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              &larr; Back to Calendar
            </button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Guest Details</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please provide information to help us prepare for the recording.</p>
            
            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>First Name</label>
                  <input required type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Last Name</label>
                  <input required type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                <input required type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Short Bio (How should we introduce you?)</label>
                <textarea required rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Topic Keywords (e.g. Next.js, Engineering Leadership)</label>
                <input required type="text" placeholder="Comma separated" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>We use this to prevent overlapping topics between recent episodes.</p>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Confirming Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
