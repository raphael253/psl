import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { NavBar } from '@/components/NavBar'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PSL — Public Statements Ledger',
  description: 'Corpus structuré de déclarations publiques institutionnelles.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${geist.className} bg-slate-50 text-slate-900 antialiased`}>
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
