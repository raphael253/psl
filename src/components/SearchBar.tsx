'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  defaultValue?: string
  placeholder?: string
}

export function SearchBar({ defaultValue = '', placeholder = 'Rechercher une déclaration…' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputRef.current?.value.trim()
    if (!q) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('q', q)
    params.delete('page')

    startTransition(() => {
      router.push(`/search?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="flex-1 h-11 text-base"
        disabled={isPending}
      />
      <Button type="submit" size="lg" disabled={isPending} className="shrink-0">
        {isPending ? 'Recherche…' : 'Rechercher'}
      </Button>
    </form>
  )
}
