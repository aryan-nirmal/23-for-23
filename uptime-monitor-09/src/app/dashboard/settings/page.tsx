import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">Account</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <p className="text-white text-sm">{user?.email}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">User ID</label>
              <p className="text-gray-400 text-xs font-mono">{user?.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Hobby</p>
              <p className="text-gray-400 text-sm mt-0.5">10 monitors · 5-min intervals · Email alerts</p>
            </div>
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold px-3 py-1 rounded-full">
              Free
            </span>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Danger zone</h2>
          <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all monitoring data.</p>
          <button
            disabled
            className="border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm opacity-50 cursor-not-allowed"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
