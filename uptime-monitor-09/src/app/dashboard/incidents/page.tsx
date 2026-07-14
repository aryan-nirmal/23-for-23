import { createClient } from '@/lib/supabase/server'
import { AlertTriangle, CheckCircle } from 'lucide-react'

export default async function IncidentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: incidents } = await supabase
    .from('incidents')
    .select('*, monitors(name, url)')
    .in('monitor_id',
      (await supabase.from('monitors').select('id').eq('owner_id', user!.id)).data?.map((m: any) => m.id) ?? []
    )
    .order('started_at', { ascending: false })
    .limit(50)

  const ongoing = incidents?.filter((i: any) => i.status === 'ongoing') ?? []
  const resolved = incidents?.filter((i: any) => i.status === 'resolved') ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Incidents</h1>
        <p className="text-gray-400 text-sm mt-1">
          {ongoing.length} active · {resolved.length} resolved
        </p>
      </div>

      {ongoing.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle size={14} /> Active
          </h2>
          <div className="space-y-2">
            {ongoing.map((inc: any) => (
              <div key={inc.id} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{inc.monitors?.name}</p>
                    <p className="text-gray-500 text-xs">{inc.monitors?.url}</p>
                  </div>
                  <span className="text-red-400 text-xs font-mono">
                    {new Date(inc.started_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" /> Resolved
          </h2>
          <div className="space-y-2">
            {resolved.map((inc: any) => (
              <div key={inc.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">{inc.monitors?.name}</p>
                    <p className="text-gray-500 text-xs">{inc.monitors?.url}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{new Date(inc.started_at).toLocaleString()}</div>
                    {inc.resolved_at && (
                      <div className="text-green-500 mt-0.5">
                        Resolved · {Math.round((new Date(inc.resolved_at).getTime() - new Date(inc.started_at).getTime()) / 60000)}m down
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!incidents || incidents.length === 0 && (
        <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-xl p-16 text-center">
          <CheckCircle size={32} className="text-green-500 mx-auto mb-4" />
          <p className="text-gray-400">No incidents recorded. Keep it up! 🎉</p>
        </div>
      )}
    </div>
  )
}
