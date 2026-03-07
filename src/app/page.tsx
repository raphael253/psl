import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function RecentStatements() {
  const supabase = await createClient()
  const { data: statements } = await supabase
    .from('statements')
    .select(`
      id, extracted_text, statement_date, assertion_type, verifiability, status, topic,
      speaker:speakers(full_name, function),
      source:sources(label)
    `)
    .eq('status', 'active')
    .order('statement_date', { ascending: false })
    .limit(5)

  if (!statements?.length) return null

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Déclarations récentes
      </h2>
      <div className="space-y-2">
        {statements.map((s) => (
          <Link
            key={s.id}
            href={`/statements/${s.id}`}
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <span className="mt-0.5 shrink-0 text-slate-400 text-xs">
              {new Date(s.statement_date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'short' })}
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-medium text-slate-700">
                {(s.speaker as unknown as { full_name: string })?.full_name}
              </span>
              <span className="mx-2 text-slate-300">—</span>
              <span className="text-slate-600 line-clamp-1">{s.extracted_text}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
          Public Statements Ledger
        </h1>
        <p className="mx-auto max-w-xl text-slate-500">
          Corpus structuré de déclarations publiques institutionnelles belges.
          Chaque Statement est sourcé, horodaté et qualifié par type d&apos;assertion.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Suspense>
          <SearchBar />
        </Suspense>

        <div className="mt-3 text-center text-xs text-slate-400">
          Recherche sur les déclarations extraites — parlement fédéral belge, 6 derniers mois
        </div>
      </div>

      <Suspense>
        <RecentStatements />
      </Suspense>
    </div>
  )
}
