import Link from 'next/link'

export function NavBar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">PSL</span>
          <span className="hidden text-sm text-slate-500 sm:block">Public Statements Ledger</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/search" className="hover:text-slate-900 transition-colors">
            Rechercher
          </Link>
          <Link href="/methodology" className="hover:text-slate-900 transition-colors">
            Méthodologie
          </Link>
        </nav>
      </div>
    </header>
  )
}
