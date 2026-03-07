import { ASSERTION_LABELS, ASSERTION_COLORS } from '@/lib/format'
import type { AssertionType } from '@/lib/types'

interface Props {
  type: AssertionType
}

export function AssertionBadge({ type }: Props) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${ASSERTION_COLORS[type]}`}>
      {ASSERTION_LABELS[type]}
    </span>
  )
}
