'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'

interface Speaker {
  id: string
  full_name: string
  function: string | null
}

interface Props {
  speakers: Speaker[]
  currentSpeaker?: string
  currentFrom?: string
  currentTo?: string
}

export function SearchFilters({ speakers, currentSpeaker, currentFrom, currentTo }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`/search?${params.toString()}`)
    })
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('speaker')
    params.delete('from')
    params.delete('to')
    startTransition(() => {
      router.push(`/search?${params.toString()}`)
    })
  }

  const hasFilters = currentSpeaker || currentFrom || currentTo

  return (
    <div className="space-y-5 text-sm">
      {/* Période — en premier */}
      <div>
        <p className="mb-2 font-semibold text-slate-700">Période</p>
        <div className="space-y-2">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Du</label>
            <input
              type="date"
              defaultValue={currentFrom}
              onChange={(e) => updateFilter('from', e.target.value || null)}
              disabled={isPending}
              className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Au</label>
            <input
              type="date"
              defaultValue={currentTo}
              onChange={(e) => updateFilter('to', e.target.value || null)}
              disabled={isPending}
              className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Orateur — liste scrollable */}
      <div>
        <p className="mb-2 font-semibold text-slate-700">
          Orateur
          <span className="ml-1 text-xs font-normal text-slate-400">({speakers.length})</span>
        </p>
        <div className="max-h-48 space-y-0.5 overflow-y-auto rounded border border-slate-100 p-1">
          <button
            onClick={() => updateFilter('speaker', null)}
            disabled={isPending}
            className={`w-full rounded px-2 py-1 text-left text-[13px] transition-colors ${
              !currentSpeaker
                ? 'bg-slate-100 font-medium text-slate-900'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Tous les orateurs
          </button>
          {speakers.map((s) => (
            <button
              key={s.id}
              onClick={() => updateFilter('speaker', s.id)}
              disabled={isPending}
              className={`w-full rounded px-2 py-1 text-left text-[13px] transition-colors ${
                currentSpeaker === s.id
                  ? 'bg-blue-50 font-medium text-blue-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s.full_name}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={isPending}
          className="w-full text-slate-500"
        >
          Effacer les filtres
        </Button>
      )}
    </div>
  )
}
