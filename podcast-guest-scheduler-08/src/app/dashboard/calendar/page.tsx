export default function CalendarPage() {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Upcoming Recordings</h2>
      <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}>Calendar view is synced with your Google Calendar.</p>
          <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'inline-block' }}>
            <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>Next Recording: Guillermo Rauch</div>
            <div style={{ fontSize: '0.875rem' }}>May 14, 2026 @ 02:00 PM EST</div>
          </div>
        </div>
      </div>
    </div>
  );
}
