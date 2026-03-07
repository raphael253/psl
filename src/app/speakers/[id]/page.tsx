import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/format'
import { StatementCard } from '@/components/StatementCard'
import type { Statement, Speaker as SpeakerType, Source } from '@/lib/types'

type StatementForCard = Statement & { speaker: SpeakerType; source: Source }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SpeakerPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: speaker }, { data: statements }] = await Promise.all([
    supabase
      .from('speakers')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('statements')
      .select(`
        id,
        speaker_id,
        source_id,
        statement_date,
        extracted_text,
        assertion_type,
        verifiability,
        topic,
        fingerprint,
        raw_context,
        source_url,
        archive_link,
        status,
        llm_model_version,
        prompt_version,
        created_at,
        updated_at,
        speaker:speakers(*),
        source:sources(*)
      `)
      .eq('speaker_id', id)
      .neq('status', 'archived')
      .order('statement_date', { ascending: false }),
  ])

  if (!speaker) notFound()

  const statementsByYear = (statements ?? []).reduce<Record<string, StatementForCard[]>>(
    (acc, s) => {
      const year = new Date(s.statement_date).getFullYear().toString()
      if (!acc[year]) acc[year] = []
      acc[year].push(s as unknown as StatementForCard)
      return acc
    },
    {}
  )

  const years = Object.keys(statementsByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-slate-600">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600">Orateurs</span>
      </nav>

      {/* En-tête orateur */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{speaker.full_name}</h1>
              {speaker.status === 'archived' && (
                <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  Archivé
                </span>
              )}
            </div>
            {speaker.function && (
              <p className="mt-1 text-slate-500">
                {speaker.function}
                {speaker.party && <span className="text-slate-400"> — {speaker.party}</span>}
              </p>
            )}
          </div>
          <div className="text-right text-sm text-slate-400">
            <p className="text-2xl font-bold text-slate-700">{statements?.length ?? 0}</p>
            <p>statement{(statements?.length ?? 0) > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Statements par année */}
      {years.length === 0 ? (
        <p className="text-sm text-slate-400">Aucun Statement indexé pour cet orateur.</p>
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                {year} — {statementsByYear[year].length} statement{statementsByYear[year].length > 1 ? 's' : ''}
              </h2>
              <div className="space-y-3">
                {statementsByYear[year].map((s) => (
                  <StatementCard key={s.id} statement={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
