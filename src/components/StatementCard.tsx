import Link from 'next/link'
import { formatDate } from '@/lib/format'
import { VerifiabilityBadge } from './VerifiabilityBadge'
import { AssertionBadge } from './AssertionBadge'
import type { Statement, Speaker, Source } from '@/lib/types'

type StatementForCard = Statement & { speaker: Speaker; source: Source }

interface Props {
  statement: StatementForCard
}

export function StatementCard({ statement }: Props) {
  return (
    <Link
      href={`/statements/${statement.id}`}
      className="group block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md hover:border-slate-300"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
          {statement.speaker.full_name}
        </span>
        {statement.speaker.function && (
          <span className="text-sm text-slate-500">— {statement.speaker.function}</span>
        )}
        <span className="ml-auto text-sm text-slate-400 shrink-0">
          {formatDate(statement.statement_date)}
        </span>
      </div>

      <p className="mb-4 text-slate-800 leading-relaxed line-clamp-3">
        &ldquo;{statement.extracted_text}&rdquo;
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <AssertionBadge type={statement.assertion_type} />
        <VerifiabilityBadge level={statement.verifiability} />
        {statement.status !== 'active' && (
          <span className="rounded border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
            {statement.status === 'corrected' ? 'Corrigé' : statement.status === 'contested' ? 'Contesté' : 'Archivé'}
          </span>
        )}
        <span className="ml-auto text-xs text-slate-400 truncate max-w-xs">
          {statement.source.label}
        </span>
      </div>
    </Link>
  )
}
