import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This route is called by a cron job (Vercel Cron or external)
// It processes all due monitors and records results

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkUrl(url: string): Promise<{ success: boolean; status_code: number | null; response_ms: number | null; error: string | null }> {
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    })
    const ms = Date.now() - start
    return {
      success: res.status >= 200 && res.status < 400,
      status_code: res.status,
      response_ms: ms,
      error: null,
    }
  } catch (err: any) {
    return {
      success: false,
      status_code: null,
      response_ms: Date.now() - start,
      error: err.message ?? 'Request failed',
    }
  }
}

async function sendSlackAlert(webhookUrl: string, monitor: any, type: 'down' | 'up') {
  const emoji = type === 'down' ? '🔴' : '🟢'
  const text = type === 'down'
    ? `${emoji} *${monitor.name}* is DOWN\n<${monitor.url}|${monitor.url}>`
    : `${emoji} *${monitor.name}* is back UP\n<${monitor.url}|${monitor.url}>`

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

async function sendEmailAlert(email: string, monitor: any, type: 'down' | 'up') {
  if (!process.env.RESEND_API_KEY) return
  const subject = type === 'down'
    ? `🔴 ${monitor.name} is DOWN`
    : `🟢 ${monitor.name} recovered`
  const html = type === 'down'
    ? `<p>Your monitor <strong>${monitor.name}</strong> (<a href="${monitor.url}">${monitor.url}</a>) is <strong style="color:red">DOWN</strong>.</p><p>We will notify you when it recovers.</p>`
    : `<p>Your monitor <strong>${monitor.name}</strong> (<a href="${monitor.url}">${monitor.url}</a>) has <strong style="color:green">recovered</strong>.</p>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'PingWatch <alerts@pingwatch.dev>',
      to: [email],
      subject,
      html,
    }),
  })
}

export async function POST(request: NextRequest) {
  // Verify cron secret
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all active monitors due for a check
  const { data: monitors, error } = await supabase
    .from('monitors')
    .select('*')
    .eq('active', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!monitors || monitors.length === 0) return NextResponse.json({ checked: 0 })

  // Filter monitors due for check based on interval
  const now = Date.now()
  const due = monitors.filter((m: any) => {
    if (!m.last_checked_at) return true
    const lastCheck = new Date(m.last_checked_at).getTime()
    return now - lastCheck >= m.interval_seconds * 1000
  })

  let checked = 0

  for (const monitor of due) {
    const result = await checkUrl(monitor.url)

    // Save check result
    await supabase.from('check_results').insert({
      monitor_id: monitor.id,
      checked_at: new Date().toISOString(),
      status_code: result.status_code,
      response_ms: result.response_ms,
      success: result.success,
      error_message: result.error,
    })

    // Update monitor status
    await supabase.from('monitors').update({
      status: result.success ? 'up' : 'down',
      last_checked_at: new Date().toISOString(),
      last_response_ms: result.response_ms,
      last_status_code: result.status_code,
    }).eq('id', monitor.id)

    // Incident management
    const wasDown = monitor.status === 'down'
    const isDown = !result.success

    if (isDown && !wasDown) {
      // Get consecutive failure count
      const { data: recentChecks } = await supabase
        .from('check_results')
        .select('success')
        .eq('monitor_id', monitor.id)
        .order('checked_at', { ascending: false })
        .limit(monitor.failure_threshold)

      const allFailed = recentChecks?.every((c: any) => !c.success)

      if (allFailed) {
        // Create incident
        await supabase.from('incidents').insert({
          monitor_id: monitor.id,
          started_at: new Date().toISOString(),
          status: 'ongoing',
        })

        // Fire alerts
        const { data: channels } = await supabase
          .from('alert_channels')
          .select('*')
          .eq('monitor_id', monitor.id)

        for (const ch of channels ?? []) {
          if (ch.type === 'slack' && ch.config?.webhook_url) {
            await sendSlackAlert(ch.config.webhook_url, monitor, 'down')
          }
          if (ch.type === 'email' && ch.config?.email) {
            await sendEmailAlert(ch.config.email, monitor, 'down')
          }
        }
      }
    }

    if (!isDown && wasDown) {
      // Resolve incident
      await supabase.from('incidents')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('monitor_id', monitor.id)
        .eq('status', 'ongoing')

      // Recovery alerts
      const { data: channels } = await supabase
        .from('alert_channels')
        .select('*')
        .eq('monitor_id', monitor.id)

      for (const ch of channels ?? []) {
        if (ch.type === 'slack' && ch.config?.webhook_url) {
          await sendSlackAlert(ch.config.webhook_url, monitor, 'up')
        }
        if (ch.type === 'email' && ch.config?.email) {
          await sendEmailAlert(ch.config.email, monitor, 'up')
        }
      }
    }

    checked++
  }

  return NextResponse.json({ checked, total: monitors.length })
}

// Also allow GET for easy manual testing
export async function GET(request: NextRequest) {
  return POST(request)
}
