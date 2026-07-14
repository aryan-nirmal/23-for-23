import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Activity, AlertTriangle, CheckCircle, Clock, Plus, TrendingUp } from 'lucide-react'
import type { Monitor } from '@/lib/types'

function StatusBadge({ status }: { status: Monitor['status'] }) {
  if (status === 'up') return (
    <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
      <span className="status-dot up" /> Operational
    </span>
  )
  if (status === 'down') return (
    <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
      <span className="status-dot down" /> Down
    </span>
  )
  return (
    <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-medium">
      <span className="status-dot pending" /> Pending
    </span>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: monitors } = await supabase
    .from('monitors')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: incidents } = await supabase
    .from('incidents')
    .select('*, monitors(name, url)')
    .eq('status', 'ongoing')
    .order('started_at', { ascending: false })
    .limit(5)

  const total = monitors?.length ?? 0
  const up = monitors?.filter((m) => m.status === 'up').length ?? 0
  const down = monitors?.filter((m) => m.status === 'down').length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Your monitoring dashboard</p>
        </div>
        <Link
          href="/dashboard/monitors/new"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Add monitor
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total monitors', value: total, icon: Activity, color: 'text-gray-300' },
          { label: 'Operational', value: up, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Down now', value: down, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Active incidents', value: incidents?.length ?? 0, icon: Clock, color: 'text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs">{stat.label}</span>
              <stat.icon size={14} className={stat.color} />
            </div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Active incidents */}
      {incidents && incidents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" /> Active Incidents
          </h2>
          <div className="space-y-2">
            {incidents.map((inc: any) => (
              <div
                key={inc.id}
                className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white text-sm font-medium">{inc.monitors?.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{inc.monitors?.url}</p>
                </div>
                <div className="text-red-400 text-xs">
                  Since {new Date(inc.started_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitors list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" /> All monitors
          </h2>
          <Link href="/dashboard/monitors" className="text-green-400 text-sm hover:text-green-300 transition-colors">
            View all →
          </Link>
        </div>

        {!monitors || monitors.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-xl p-12 text-center">
            <Activity size={32} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No monitors yet</p>
            <Link
              href="/dashboard/monitors/new"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Plus size={16} /> Add your first monitor
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {monitors.slice(0, 8).map((monitor: Monitor) => (
              <Link
                key={monitor.id}
                href={`/dashboard/monitors/${monitor.id}`}
                className="monitor-card flex items-center gap-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:no-underline"
              >
                <StatusBadge status={monitor.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{monitor.name}</p>
                  <p className="text-gray-500 text-xs truncate">{monitor.url}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {monitor.last_response_ms && (
                    <p className="text-gray-300 text-sm">{monitor.last_response_ms}ms</p>
                  )}
                  <p className="text-gray-600 text-xs">
                    {monitor.interval_seconds / 60}m interval
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
