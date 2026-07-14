import { createClient } from '@/lib/supabase/server'
import { Globe, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function StatusPagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: monitors } = await supabase
    .from('monitors')
    .select('id, name, url, status, slug')
    .eq('owner_id', user!.id)

  const slug = user!.email?.split('@')[0].replace(/[^a-z0-9]/g, '-') ?? 'my-status'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Status Pages</h1>
        <p className="text-gray-400 text-sm mt-1">Public status pages for your monitors</p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold">Your public status page</h2>
            <p className="text-gray-400 text-sm mt-1">Share this URL with your users</p>
          </div>
          <a
            href={`/status/${slug}`}
            target="_blank"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Globe size={14} />
            View page
          </a>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-green-400">
          {process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-app.vercel.app'}/status/{slug}
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Monitors on your status page</h3>
        {!monitors || monitors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-4">No monitors yet</p>
            <Link href="/dashboard/monitors/new" className="text-green-400 hover:text-green-300 text-sm flex items-center justify-center gap-1 transition-colors">
              <Plus size={14} /> Add a monitor
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {monitors.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className={`status-dot ${m.status}`} />
                <span className="text-gray-200 text-sm">{m.name}</span>
                <span className="text-gray-500 text-xs truncate flex-1">{m.url}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
