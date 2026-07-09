export default function DigestPage() {
  return (
    <div style={{ padding: '2.5rem 3rem', maxWidth: '700px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'none', WebkitTextFillColor: 'initial', color: 'var(--foreground)' }}>Digest Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure when and how you receive competitor updates.</p>
      </header>

      <div className="card animate-fade-in" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Weekly Digest Email</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Receive a comprehensive summary of all pricing, product, and hiring changes directly to your inbox.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
              <span>Enable Weekly Digest</span>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Delivery Schedule</label>
          <select className="input-field">
            <option>Every Monday at 8:00 AM EST</option>
            <option>Every Friday at 4:00 PM EST</option>
            <option>Daily at 8:00 AM EST (Noisy)</option>
          </select>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Recipients</label>
          <input type="text" className="input-field" defaultValue="founder@startup.com, product@startup.com" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>Comma separated list of emails.</span>
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }}>Save Preferences</button>
      </div>
    </div>
  );
}
