import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            GuestFlow
          </div>
          <div>
            <Link href="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </nav>
      </div>

      <section className="hero">
        <div className="container">
          <h1 className="animate-fade-in">Book Podcast Guests <br /> Like a Producer</h1>
          <p className="animate-fade-in delay-1" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            The purpose-built scheduling CRM for podcast hosts. Reduce back-and-forth, prevent no-shows, and maintain editorial control over your guest pipeline.
          </p>
          <div className="animate-fade-in delay-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn btn-primary" style={{ fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}>
              Start for Free
            </Link>
            <Link href="#features" className="btn btn-secondary">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="container">
        <div className="features">
          <div className="feature-card animate-fade-in delay-1">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <h3>Smart Calendar Sync</h3>
            <p>Share a personalized booking link that perfectly aligns with your available recording hours and timezones.</p>
          </div>

          <div className="feature-card animate-fade-in delay-2">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Guest CRM & Pipeline</h3>
            <p>Track who you invited, who is booked, and who has recorded. Move guests seamlessly through pipeline stages.</p>
          </div>

          <div className="feature-card animate-fade-in delay-3">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
                <polyline points="15,9 18,9 18,11" />
                <path d="M5.5 4a1.5 1.5 0 0 0 0 3h8a1.5 1.5 0 0 0 0-3h-8Z" />
              </svg>
            </div>
            <h3>Automated Reminders</h3>
            <p>Send automatic confirmation emails, prep documents, and 24-hour reminders to drastically reduce no-shows.</p>
          </div>
        </div>
      </section>
      
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="container">
          <p>© {new Date().getFullYear()} GuestFlow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
