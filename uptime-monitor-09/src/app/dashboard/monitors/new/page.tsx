'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const INTERVALS = [
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '30 minutes', value: 1800 },
  { label: '1 hour', value: 3600 },
]

export default function NewMonitorPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    url: '',
    interval_seconds: 300,
    failure_threshold: 2,
    slack_webhook: '',
    alert_email: '',
  })

  function update(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated'); setLoading(false); return }

    // Create monitor
    const { data: monitor, error: monErr } = await supabase.from('monitors').insert({
      owner_id: user.id,
      name: form.name,
      url: form.url,
      interval_seconds: form.interval_seconds,
      failure_threshold: form.failure_threshold,
      active: true,
      status: 'pending',
    }).select().single()

    if (monErr) { setError(monErr.message); setLoading(false); return }

    // Create alert channels
    if (form.slack_webhook) {
      await supabase.from('alert_channels').insert({
        owner_id: user.id,
        monitor_id: monitor.id,
        name: 'Slack',
        type: 'slack',
        config: { webhook_url: form.slack_webhook },
      })
    }
    if (form.alert_email) {
      await supabase.from('alert_channels').insert({
        owner_id: user.id,
        monitor_id: monitor.id,
        name: 'Email',
        type: 'email',
        config: { email: form.alert_email },
      })
    }

    router.push(`/dashboard/monitors/${monitor.id}`)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/monitors" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add monitor</h1>
          <p className="text-gray-400 text-sm mt-0.5">Start checking a URL in seconds</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">Monitor details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-colors"
                placeholder="My Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">URL to monitor</label>
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => update('url', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-colors"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Check settings */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">Check settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Check interval</label>
              <select
                value={form.interval_seconds}
                onChange={(e) => update('interval_seconds', Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              >
                {INTERVALS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Failure threshold</label>
              <select
                value={form.failure_threshold}
                onChange={(e) => update('failure_threshold', Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              >
                {[1, 2, 3, 5].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'failure' : 'failures'}</option>
                ))}
              </select>
              <p className="text-gray-600 text-xs mt-1">Consecutive failures before incident</p>
            </div>
          </div>
        </div>

        {/* Alert channels */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">Alert channels</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Alert email</label>
              <input
                type="email"
                value={form.alert_email}
                onChange={(e) => update('alert_email', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-colors"
                placeholder="alerts@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Slack webhook URL</label>
              <input
                type="url"
                value={form.slack_webhook}
                onChange={(e) => update('slack_webhook', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-colors"
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-gray-950 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create monitor'}
          </button>
          <Link
            href="/dashboard/monitors"
            className="px-6 py-3 border border-gray-700 hover:border-gray-600 text-gray-400 rounded-xl transition-colors text-sm flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
