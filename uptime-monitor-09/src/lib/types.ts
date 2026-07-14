export type MonitorStatus = 'up' | 'down' | 'pending'

export interface Project {
  id: string
  owner_id: string
  name: string
  slug: string
  created_at: string
}

export interface Monitor {
  id: string
  project_id: string
  url: string
  name: string
  interval_seconds: number
  failure_threshold: number
  active: boolean
  status: MonitorStatus
  last_checked_at: string | null
  last_response_ms: number | null
  last_status_code: number | null
  ssl_expiry_days: number | null
  created_at: string
  // joined
  project?: Project
}

export interface CheckResult {
  id: string
  monitor_id: string
  checked_at: string
  status_code: number | null
  response_ms: number | null
  success: boolean
  error_message: string | null
}

export interface Incident {
  id: string
  monitor_id: string
  started_at: string
  resolved_at: string | null
  status: 'ongoing' | 'resolved'
  // joined
  monitor?: Monitor
}

export interface AlertChannel {
  id: string
  owner_id: string
  name: string
  type: 'email' | 'slack' | 'webhook'
  config: Record<string, string>
  created_at: string
}
