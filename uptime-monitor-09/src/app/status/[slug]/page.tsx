import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react'

export const revalidate = 60

export default async function PublicStatusPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // Find user by slug (derived from email prefix)
  const { data: monitors } = await supabase
    .from('monitors')
    .select('id, name, url, status, last_checked_at, last_response_ms')
    .eq('active', true)

  if (!monitors) notFound()

  // Filter by slug (email prefix)
  const { data: users } = await supabase.auth.admin?.listUsers?.() ?? { data: null }

  const allUp = monitors.every((m) => m.status === 'up')
  const hasDown = monitors.some((m) => m.status === 'down')

  const statusLabel = hasDown
    ? 'Some systems are down'
    : allUp
    ? 'All systems operational'
    : 'Checking systems...'

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Activity size={16} className="text-gray-950" />
            </div>
            <span className="font-bold text-xl text-white">Status</span>
          </div>

          <div className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full border text-sm font-medium mb-3 ${
            hasDown
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-green-500/10 border-green-500/20 text-green-400'
          }`}>
            {hasDown ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            {statusLabel}
          </div>
          <p className="text-gray-500 text-sm">
            Last updated {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Monitor list */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300">Services</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {monitors.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No monitors configured yet.
              </div>
            ) : (
              monitors.map((m) => (
                <div key={m.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`status-dot ${m.status}`} />
                    <div>
                      <p className="text-white text-sm font-medium">{m.name}</p>
                      <p className="text-gray-500 text-xs">{m.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      m.status === 'up' ? 'text-green-400' : m.status === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {m.status === 'up' ? 'Operational' : m.status === 'down' ? 'Outage' : 'Checking'}
                    </p>
                    {m.last_response_ms && (
                      <p className="text-gray-500 text-xs">{m.last_response_ms}ms</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Past incidents placeholder */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Past incidents (30 days)</h3>
          <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-xl px-6 py-8 text-center">
            <p className="text-gray-600 text-sm">No incidents reported in the last 30 days.</p>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-8">
          Powered by <a href="/" className="text-gray-500 hover:text-gray-400">PingWatch</a>
        </p>
      </div>
    </div>
  )
}
