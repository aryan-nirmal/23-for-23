import Link from 'next/link';
import { FileText, Zap, Edit3, Download } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <Link href="/" className="logo">
            <div style={{ background: 'var(--accent)', padding: '0.4rem', borderRadius: '0.5rem' }}>
              <FileText size={20} className="logo-icon" color="white" />
            </div>
            SOPGen AI
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/dashboard" className="btn btn-secondary">
              Dashboard
            </Link>
            <Link href="/generate" className="btn btn-primary">
              Create SOP
            </Link>
          </div>
        </nav>
      </div>

      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '4rem 1rem', background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.15), transparent 60%)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-light)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
            <Zap size={14} /> AI-Powered Process Documentation
          </div>
          <h1 className="animate-fade-in delay-1">Turn undocumented business know-how into clean, repeatable SOPs in minutes.</h1>
          <p className="animate-fade-in delay-2" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-muted)' }}>
            Stop delaying process documentation. Describe your workflow in plain English, and our AI structurizes it into professional, export-ready Standard Operating Procedures.
          </p>
          <div className="animate-fade-in delay-3" style={{ display: 'flex', gap: '1rem', justifyItems: 'center', justifyContent: 'center' }}>
            <Link href="/generate" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Start Generating for Free
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card animate-fade-in delay-1">
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Plain-English Input</h3>
            <p>Don't worry about formatting or structure. Just brain-dump your process and let the AI do the heavy lifting of organization.</p>
          </div>
          <div className="card animate-fade-in delay-2">
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Edit3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Section-by-Section Editing</h3>
            <p>Love the procedure but hate the scope definition? Regenerate or manually edit individual sections without losing the whole document.</p>
          </div>
          <div className="card animate-fade-in delay-3">
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Download size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Export & Share</h3>
            <p>Upload your logo, finalize your draft, and immediately export to a branded PDF or copy the structured markdown.</p>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
        <p>© {new Date().getFullYear()} SOPGen AI. Built for operational excellence.</p>
      </footer>
    </main>
  );
}
