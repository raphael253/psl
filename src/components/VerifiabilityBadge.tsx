import { VERIFIABILITY_LABELS, VERIFIABILITY_COLORS } from '@/lib/format'
import type { Verifiability } from '@/lib/types'

interface Props {
  level: Verifiability
}

export function VerifiabilityBadge({ level }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${VERIFIABILITY_COLORS[level]}`}>
      <span className="text-[10px]">
        {level === 'strong' ? '●●●' : level === 'medium' ? '●●○' : '●○○'}
      </span>
      {VERIFIABILITY_LABELS[level]}
    </span>
  )
}
