// SVG Sparkline + Zeitpunkte für den Tagesverlauf
export default function TempCurve({ hourlyTemps, currentHour, t }) {
  if (!hourlyTemps || hourlyTemps.length < 2) return null

  const W = 280
  const H = 64
  const PAD = { top: 12, bottom: 20, left: 4, right: 4 }

  const temps  = hourlyTemps.map(p => p.temp)
  const minT   = Math.min(...temps)
  const maxT   = Math.max(...temps)
  const range  = Math.max(maxT - minT, 1)

  // Map temp → Y (inverted: higher temp = lower Y value = higher on screen)
  const toY = t => PAD.top + ((maxT - t) / range) * (H - PAD.top - PAD.bottom)
  const toX = i => PAD.left + (i / (hourlyTemps.length - 1)) * (W - PAD.left - PAD.right)

  const points = hourlyTemps.map((p, i) => ({ x: toX(i), y: toY(p.temp), ...p }))

  // SVG polyline path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  // Filled area path (close at bottom)
  const areaPath = linePath +
    ` L${points[points.length - 1].x.toFixed(1)},${H - PAD.bottom}` +
    ` L${points[0].x.toFixed(1)},${H - PAD.bottom} Z`

  // Closest point to current hour
  const now = currentHour ?? new Date().getHours()
  const closestIdx = points.reduce((best, p, i) =>
    Math.abs(p.hour - now) < Math.abs(points[best].hour - now) ? i : best, 0)
  const nowPoint = points[closestIdx]

  const formatHour = (h) => {
    if (h === 6)  return '6am'
    if (h === 9)  return '9am'
    if (h === 12) return '12pm'
    if (h === 15) return '3pm'
    if (h === 18) return '6pm'
    if (h === 21) return '9pm'
    return `${h}h`
  }

  return (
    <div className="mt-3">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill="url(#tempGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Time labels + temp dots */}
        {points.map((p, i) => (
          <g key={p.hour}>
            {/* Dot */}
            <circle cx={p.x} cy={p.y} r={i === closestIdx ? 4 : 2.5}
              fill={i === closestIdx ? '#2563eb' : '#93c5fd'}
              stroke="white" strokeWidth="1.5" />
            {/* Temp label above dot — only show min, max, current */}
            {(i === closestIdx || p.temp === Math.max(...temps) || p.temp === Math.min(...temps)) && (
              <text x={p.x} y={p.y - 6} textAnchor="middle"
                fontSize="9" fontWeight="600" fill="#1e40af">
                {p.temp}°
              </text>
            )}
            {/* Time label below */}
            <text x={p.x} y={H - 4} textAnchor="middle"
              fontSize="8.5" fill="#94a3b8">
              {formatHour(p.hour)}
            </text>
          </g>
        ))}

        {/* "Now" indicator line */}
        {nowPoint && (
          <line x1={nowPoint.x} y1={nowPoint.y + 6} x2={nowPoint.x} y2={H - PAD.bottom - 2}
            stroke="#2563eb" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.5" />
        )}
      </svg>
    </div>
  )
}
