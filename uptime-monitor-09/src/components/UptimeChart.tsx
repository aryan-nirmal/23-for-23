'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface DataPoint {
  time: string
  ms: number | null
  success: boolean
}

export default function UptimeChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: '#4b5563' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#4b5563' }}
          axisLine={false}
          tickLine={false}
          unit="ms"
        />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
          labelStyle={{ color: '#9ca3af' }}
          itemStyle={{ color: '#22c55e' }}
          formatter={(val) => val != null ? [`${val}ms`, 'Response'] : ['–', 'Response']}
        />
        <Area
          type="monotone"
          dataKey="ms"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#grad)"
          dot={false}
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
