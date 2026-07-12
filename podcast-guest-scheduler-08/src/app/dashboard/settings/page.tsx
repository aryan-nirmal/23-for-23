export default function SettingsPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Show Settings</h2>
      <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Configure your podcast details and calendar integration.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Show Name</label>
            <input type="text" defaultValue="The Startup Engineering Podcast" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Slug</label>
            <input type="text" defaultValue="demo-show" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Calendar Integration</label>
            <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              Connect Google Calendar
            </button>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
