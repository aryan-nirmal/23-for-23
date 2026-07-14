import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import UptimeChart from '@/components/UptimeChart'

export default async function MonitorDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: monitor } = await supabase
    .from('monitors')
    .select('*')
    .eq('id', params.id)
    .eq('owner_id', user!.id)
    .single()

  if (!monitor) notFound()

  // Last 48 check results
  const { data: results } = await supabase
    .from('check_results')
    .select('*')
    .eq('monitor_id', monitor.id)
    .order('checked_at', { ascending: false })
    .limit(288) // 48h at 10min

  // Recent incidents
  const { data: incidents } = await supabase
    .from('incidents')
    .select('*')
    .eq('monitor_id', monitor.id)
    .order('started_at', { ascending: false })
    .limit(10)

  // Uptime calculation (last 30 days)
  const { data: monthResults } = await supabase
    .from('check_results')
    .select('success')
    .eq('monitor_id', monitor.id)
    .gte('checked_at', new Date(Date.now() - 30 * 86400000).toISOString())

  const uptimePct = monthResults && monthResults.length > 0
    ? ((monthResults.filter((r) => r.success).length / monthResults.length) * 100).toFixed(2)
    : null

  const avgMs = results && results.length > 0
    ? Math.round(results.filter((r) => r.response_ms).reduce((s, r) => s + (r.response_ms || 0), 0) / results.filter((r) => r.response_ms).length)
    : null

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link href="/dashboard/monitors" className="text-gray-400 hover:text-white transition-colors mt-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{monitor.name}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                monitor.status === 'up'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : monitor.status === 'down'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                <span className={`status-dot ${monitor.status}`} />
                {monitor.status === 'up' ? 'Operational' : monitor.status === 'down' ? 'Down' : 'Pending'}
              </span>
            </div>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 text-sm flex items-center gap-1 transition-colors"
            >
              {monitor.url}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: '30-day uptime',
            value: uptimePct ? `${uptimePct}%` : '–',
            icon: CheckCircle,
            color: uptimePct && Number(uptimePct) >= 99 ? 'text-green-400' : 'text-orange-400',
          },
          {
            label: 'Avg response',
            value: avgMs ? `${avgMs}ms` : '–',
            icon: Clock,
            color: avgMs && avgMs < 500 ? 'text-green-400' : 'text-yellow-400',
          },
          {
            label: 'Check interval',
            value: `${monitor.interval_seconds / 60}m`,
            icon: Clock,
            color: 'text-gray-300',
          },
          {
            label: 'SSL expires',
            value: monitor.ssl_expiry_days !== null ? `${monitor.ssl_expiry_days}d` : '–',
            icon: Shield,
            color: monitor.ssl_expiry_days !== null && monitor.ssl_expiry_days < 30 ? 'text-orange-400' : 'text-gray-300',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs">{stat.label}</span>
              <stat.icon size={14} className={stat.color} />
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Response time chart */}
      {results && results.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-300 mb-5">Response time (last 48h)</h2>
          <UptimeChart data={results.map((r) => ({
            time: new Date(r.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ms: r.response_ms,
            success: r.success,
          })).reverse()} />
        </div>
      )}

      {/* Incidents */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-orange-400" />
          Incident history
        </h2>
        {!incidents || incidents.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-xl p-8 text-center">
            <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No incidents recorded — great job!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {incidents.map((inc: any) => (
              <div key={inc.id} className={`rounded-xl p-4 border flex items-center justify-between ${
                inc.status === 'ongoing'
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-gray-900/50 border-gray-800'
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      inc.status === 'ongoing'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {inc.status === 'ongoing' ? 'ONGOING' : 'RESOLVED'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Started {new Date(inc.started_at).toLocaleString()}
                  </p>
                  {inc.resolved_at && (
                    <p className="text-gray-500 text-xs mt-0.5">
                      Resolved {new Date(inc.resolved_at).toLocaleString()}
                      {' · '}
                      Duration: {Math.round((new Date(inc.resolved_at).getTime() - new Date(inc.started_at).getTime()) / 60000)}m
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
