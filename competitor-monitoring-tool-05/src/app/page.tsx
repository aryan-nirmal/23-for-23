import Link from 'next/link';
import { Activity, Shield, Zap, Search } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <Link href="/" className="logo">
            <div style={{ background: 'var(--accent)', padding: '0.4rem', borderRadius: '0.5rem' }}>
              <Activity size={20} className="logo-icon" color="white" />
            </div>
            PulseAI
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/dashboard" className="btn btn-secondary">
              View Dashboard
            </Link>
            <Link href="/dashboard" className="btn btn-primary">
              Start Monitoring
            </Link>
          </div>
        </nav>
      </div>

      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '4rem 1rem', background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 60%)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-light)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
            <Zap size={14} /> Startup-Friendly Competitor Tracking
          </div>
          <h1 className="animate-fade-in delay-1">Get the competitor signal. <br/> Filter out the noise.</h1>
          <p className="animate-fade-in delay-2" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-muted)' }}>
            Stop manually checking pricing pages. PulseAI monitors your competitors, detects semantic changes in pricing, product, and hiring, and delivers a concise weekly digest directly to your inbox.
          </p>
          <div className="animate-fade-in delay-3" style={{ display: 'flex', gap: '1rem', justifyItems: 'center', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Start for Free
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card animate-fade-in delay-1">
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Semantic Change Detection</h3>
            <p>We don't just diff HTML. Our engine understands when pricing numbers change, when features are added, and when new roles open up.</p>
          </div>
          <div className="card animate-fade-in delay-2">
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Weekly Digests</h3>
            <p>Enterprise tools alert you every time a comma changes. We batch the important updates into a single, highly readable weekly email.</p>
          </div>
          <div className="card animate-fade-in delay-3">
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Priced for Founders</h3>
            <p>No more requesting demos or paying $15,000/year for enterprise platforms. Full monitoring starts at a budget-friendly $15/month.</p>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
        <p>© {new Date().getFullYear()} PulseAI. Market intelligence for agile teams.</p>
      </footer>
    </main>
  );
}
