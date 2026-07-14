import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Activity } from 'lucide-react'
import type { Monitor } from '@/lib/types'

function StatusBadge({ status }: { status: Monitor['status'] }) {
  if (status === 'up') return <span className="flex items-center gap-1.5 text-green-400 text-xs"><span className="status-dot up" />Up</span>
  if (status === 'down') return <span className="flex items-center gap-1.5 text-red-400 text-xs"><span className="status-dot down" />Down</span>
  return <span className="flex items-center gap-1.5 text-yellow-400 text-xs"><span className="status-dot pending" />Pending</span>
}

export default async function MonitorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: monitors } = await supabase
    .from('monitors')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitors</h1>
          <p className="text-gray-400 text-sm mt-1">{monitors?.length ?? 0} monitors configured</p>
        </div>
        <Link
          href="/dashboard/monitors/new"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Add monitor
        </Link>
      </div>

      {!monitors || monitors.length === 0 ? (
        <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-xl p-16 text-center">
          <Activity size={32} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Add a URL to start monitoring</p>
          <Link
            href="/dashboard/monitors/new"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus size={16} /> Add monitor
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {monitors.map((m: Monitor) => (
            <Link
              key={m.id}
              href={`/dashboard/monitors/${m.id}`}
              className="monitor-card flex items-center gap-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4"
            >
              <StatusBadge status={m.status} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{m.name}</p>
                <p className="text-gray-500 text-xs truncate">{m.url}</p>
              </div>
              <div className="flex items-center gap-6 text-right flex-shrink-0">
                {m.last_response_ms && (
                  <div>
                    <p className="text-gray-200 text-sm">{m.last_response_ms}ms</p>
                    <p className="text-gray-600 text-xs">response</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-300 text-sm">{m.interval_seconds / 60}m</p>
                  <p className="text-gray-600 text-xs">interval</p>
                </div>
                {m.ssl_expiry_days !== null && (
                  <div>
                    <p className={`text-sm ${m.ssl_expiry_days < 30 ? 'text-orange-400' : 'text-gray-300'}`}>
                      {m.ssl_expiry_days}d
                    </p>
                    <p className="text-gray-600 text-xs">SSL</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
