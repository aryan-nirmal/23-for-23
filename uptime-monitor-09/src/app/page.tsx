import Link from 'next/link'
import { Activity, Bell, Globe, Shield, Zap, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Activity size={16} className="text-gray-950" />
            </div>
            <span className="font-bold text-lg text-white">PingWatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm mb-8">
          <span className="status-dot up" />
          All systems operational
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Know when your site<br />
          <span className="gradient-text">goes down</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Simple, reliable uptime monitoring built for indie hackers and solo founders.
          Get alerted on Slack or email before your users notice.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-8 py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-green-500/20"
          >
            Start monitoring free
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/status/demo"
            className="border border-gray-700 hover:border-gray-600 text-gray-300 px-8 py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Globe size={18} />
            View demo status page
          </Link>
        </div>
        <p className="text-gray-600 text-sm mt-6">No credit card required · 10 monitors free forever</p>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-800/50 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '< 30s', label: 'Alert speed' },
            { val: '99.9%', label: 'Checker uptime' },
            { val: '1 min', label: 'Min interval' },
            { val: '$0', label: 'To start' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-green-400">{s.val}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Everything you actually need</h2>
        <p className="text-gray-400 text-center mb-16">No bloat. No enterprise dashboards. Just fast alerts.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'HTTP & HTTPS checks',
              desc: 'Monitor any URL every 1–60 minutes. Configurable failure thresholds to avoid false alarms.',
            },
            {
              icon: Bell,
              title: 'Slack & email alerts',
              desc: 'Get notified the second an incident is confirmed, and again when it recovers.',
            },
            {
              icon: Globe,
              title: 'Public status pages',
              desc: 'Share a beautiful status page with your users. Build trust, reduce support tickets.',
            },
            {
              icon: Shield,
              title: 'SSL expiry monitoring',
              desc: 'Get warned 30 days before your SSL certificate expires. Never get caught out.',
            },
            {
              icon: Activity,
              title: '30-day uptime history',
              desc: 'View response times and availability trends. Prove your SLA to clients.',
            },
            {
              icon: CheckCircle,
              title: 'Incident timeline',
              desc: 'Every outage is recorded with start time, duration, and resolution notes.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="monitor-card bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <f.icon size={20} className="text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-16">Start free. Upgrade when you grow.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Hobby',
              price: '$0',
              period: 'forever',
              features: ['10 monitors', '5-min interval', 'Email alerts', '7-day history'],
              cta: 'Get started',
              highlight: false,
            },
            {
              name: 'Growth',
              price: '$9',
              period: '/month',
              features: ['30 monitors', '1-min interval', 'Slack + email', 'Public status page', '30-day history', 'SSL monitoring'],
              cta: 'Start free trial',
              highlight: true,
            },
            {
              name: 'Agency',
              price: '$29',
              period: '/month',
              features: ['Unlimited monitors', 'Client workspaces', 'White-label status pages', 'Priority support'],
              cta: 'Contact us',
              highlight: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-6 border ${
                p.highlight
                  ? 'border-green-500/50 bg-green-500/5 glow-green'
                  : 'border-gray-800 bg-gray-900/50'
              }`}
            >
              {p.highlight && (
                <div className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Most popular</div>
              )}
              <div className="text-white font-bold text-xl mb-1">{p.name}</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">{p.price}</span>
                <span className="text-gray-500 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-2 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  p.highlight
                    ? 'bg-green-500 hover:bg-green-400 text-gray-950'
                    : 'border border-gray-700 hover:border-gray-600 text-gray-300'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Activity size={14} className="text-green-400" />
            <span>PingWatch © 2025</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <Link href="/status/demo" className="hover:text-white transition-colors">Status</Link>
            <a href="https://github.com" className="hover:text-white transition-colors flex items-center gap-1">
              <ExternalLink size={14} /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
