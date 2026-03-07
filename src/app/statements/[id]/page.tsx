import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, STATUS_LABELS } from '@/lib/format'
import { VerifiabilityBadge } from '@/components/VerifiabilityBadge'
import { AssertionBadge } from '@/components/AssertionBadge'
import type { StatementWithRelations } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function StatementPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: statement }, { data: revisions }] = await Promise.all([
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
      .eq('id', id)
      .single(),
    supabase
      .from('revisions')
      .select('*')
      .eq('statement_id', id)
      .order('changed_at', { ascending: false }),
  ])

  if (!statement) notFound()

  const speaker = Array.isArray((statement as any).speaker)
    ? (statement as any).speaker[0]
    : (statement as any).speaker

  const source = Array.isArray((statement as any).source)
    ? (statement as any).source[0]
    : (statement as any).source

  if (!speaker || !source) notFound()

  const s = {
    ...(statement as any),
    speaker,
    source,
    revisions: revisions ?? [],
  } as StatementWithRelations
  const isModified = s.status !== 'active'

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-slate-600">Accueil</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-slate-600">Recherche</Link>
        <span>/</span>
        <span className="text-slate-600">Statement</span>
      </nav>

      {/* Statut non-actif */}
      {isModified && (
        <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          Ce Statement est marqué <strong>{STATUS_LABELS[s.status]}</strong>.
          {s.revisions.length > 0 && ' Consultez l\'historique ci-dessous.'}
        </div>
      )}

      {/* Card principale */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* En-tête */}
        <div className="mb-5 flex flex-wrap items-start gap-3">
          <div className="flex-1">
            <Link
              href={`/speakers/${s.speaker.id}`}
              className="text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors"
            >
              {s.speaker.full_name}
            </Link>
            {s.speaker.function && (
              <p className="text-sm text-slate-500">{s.speaker.function}
                {s.speaker.party && ` — ${s.speaker.party}`}
              </p>
            )}
          </div>
          <time className="text-sm text-slate-400 shrink-0">
            {formatDate(s.statement_date)}
          </time>
        </div>

        {/* Texte extrait */}
        <blockquote className="mb-5 border-l-4 border-slate-300 pl-4 text-slate-800 text-lg leading-relaxed">
          {s.extracted_text}
        </blockquote>

        {/* Badges */}
        <div className="mb-5 flex flex-wrap gap-2">
          <AssertionBadge type={s.assertion_type} />
          <VerifiabilityBadge level={s.verifiability} />
        </div>

        {/* Disclaimer */}
        <p className="mb-5 rounded bg-slate-50 px-3 py-2 text-xs text-slate-500 italic">
          Le niveau de vérifiabilité reflète le type de source, pas la vérité de l&apos;affirmation.
        </p>

        {/* Source */}
        <div className="border-t border-slate-100 pt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Source primaire
          </p>
          <p className="text-sm font-medium text-slate-700">{s.source.label}</p>
          {s.source.session_date && (
            <p className="text-xs text-slate-400">{formatDate(s.source.session_date)}</p>
          )}
          {s.source_url && (
            <a
              href={s.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs text-blue-600 hover:underline"
            >
              Consulter la source originale →
            </a>
          )}
        </div>

        {/* Contexte brut */}
        {s.raw_context && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Contexte
            </p>
            <p className="text-sm text-slate-500 italic leading-relaxed">{s.raw_context}</p>
          </div>
        )}
      </div>

      {/* Historique des modifications */}
      {s.revisions.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Historique des modifications
          </h2>
          <div className="space-y-2">
            {s.revisions
              .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())
              .map((rev) => (
                <div
                  key={rev.id}
                  className="rounded border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-700">
                      Champ modifié : <code className="rounded bg-slate-100 px-1 text-xs">{rev.field_changed}</code>
                    </span>
                    <time className="text-xs text-slate-400 shrink-0">
                      {formatDate(rev.changed_at)}
                    </time>
                  </div>
                  {rev.old_value && (
                    <p className="mt-1 text-xs text-slate-400">
                      Avant : <span className="line-through">{rev.old_value}</span>
                      {rev.new_value && <> → <span className="text-slate-600">{rev.new_value}</span></>}
                    </p>
                  )}
                  {rev.reason && (
                    <p className="mt-1 text-xs text-slate-500 italic">{rev.reason}</p>
                  )}
                </div>
              ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Les corrections s&apos;appliquent uniquement aux métadonnées. Le texte extrait original n&apos;est jamais modifié.
          </p>
        </div>
      )}

      {/* Signaler une erreur */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        Une erreur dans ce Statement ?{' '}
        <a href={`mailto:contact@psl.be?subject=Erreur Statement ${s.id}`} className="text-blue-600 hover:underline">
          Signaler une erreur
        </a>
      </div>

      {/* Métadonnées techniques */}
      {(s.llm_model_version || s.prompt_version) && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
            Métadonnées d&apos;extraction
          </summary>
          <div className="mt-2 rounded border border-slate-100 bg-slate-50 p-3 text-xs text-slate-400 space-y-1">
            {s.llm_model_version && <p>Modèle LLM : {s.llm_model_version}</p>}
            {s.prompt_version && <p>Version prompt : {s.prompt_version}</p>}
          </div>
        </details>
      )}
    </div>
  )
}
