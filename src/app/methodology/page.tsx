export default function MethodologyPage() {
  return (
    <div className="max-w-2xl prose prose-slate">
      <h1 className="text-2xl font-bold text-slate-900 not-prose mb-2">Méthodologie</h1>
      <p className="text-slate-500 not-prose mb-8">
        Comment PSL collecte, extrait et qualifie les déclarations publiques.
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Corpus couvert</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Au prototype, PSL indexe uniquement les séances plénières du parlement fédéral belge.
          Le corpus couvre les 6 derniers mois. Environ 30–40 personnalités institutionnelles
          sont indexées, sélectionnées sur la base de leur fonction (membres du gouvernement fédéral,
          présidents de groupe parlementaire).
        </p>
        <p className="mt-2 text-sm text-slate-500">
          La liste des personnalités indexées et leurs critères de sélection sont publiés et maintenus
          à jour par l&apos;équipe PSL.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Pipeline d&apos;extraction</h2>
        <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
          <li>Les transcripts officiels des séances plénières sont collectés depuis les sources primaires (lachambre.be).</li>
          <li>Chaque transcript est segmenté par intervention d&apos;orateur.</li>
          <li>Un modèle de langage (LLM) extrait les assertions claires et autonomes de chaque intervention.</li>
          <li>Chaque assertion est classifiée selon son type (voir ci-dessous).</li>
          <li>Un niveau de vérifiabilité est attribué selon une règle déterministe (voir ci-dessous).</li>
          <li>La version du modèle et du prompt utilisés sont enregistrées pour chaque Statement.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">3. Types d&apos;assertion</h2>
        <p className="text-sm text-slate-600 mb-3">PSL fournit des filtres pour parcourir les statements par type d&apos;assertion (par défaut : tous les types).</p>
        <div className="space-y-3 text-sm">
          <div className="rounded border border-blue-100 bg-blue-50 px-3 py-2">
            <p className="font-semibold text-blue-800">Affirmation factuelle (fact_claim)</p>
            <p className="text-blue-700">Affirmation sur un état du monde passé ou présent, susceptible d&apos;être vérifiée.</p>
          </div>
          <div className="rounded border border-violet-100 bg-violet-50 px-3 py-2">
            <p className="font-semibold text-violet-800">Engagement (promise)</p>
            <p className="text-violet-700">Engagement explicite sur une action future ou un objectif.</p>
          </div>
          <div className="rounded border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="font-semibold text-slate-700">Déclaration (other)</p>
            <p className="text-slate-600">Déclaration notable ne rentrant pas dans les deux catégories précédentes.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Niveau de vérifiabilité</h2>
        <p className="mb-3 text-sm text-slate-600">
          Le niveau de vérifiabilité est déterminé par une règle fixe basée sur le type de source.
          Il n&apos;est pas calculé par intelligence artificielle.
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 rounded border border-emerald-100 bg-emerald-50 px-3 py-2">
            <span className="font-mono text-emerald-700 shrink-0">●●●</span>
            <div>
              <p className="font-semibold text-emerald-800">Fort — Source primaire officielle</p>
              <p className="text-emerald-700">Transcript parlementaire, communiqué gouvernemental officiel.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded border border-amber-100 bg-amber-50 px-3 py-2">
            <span className="font-mono text-amber-700 shrink-0">●●○</span>
            <div>
              <p className="font-semibold text-amber-800">Moyen — Média avec citation directe</p>
              <p className="text-amber-700">Article de presse avec citation directe attribuée à l&apos;orateur.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded border border-slate-100 bg-slate-50 px-3 py-2">
            <span className="font-mono text-slate-500 shrink-0">●○○</span>
            <div>
              <p className="font-semibold text-slate-700">Faible — Source secondaire</p>
              <p className="text-slate-600">Source indirecte ou secondaire.</p>
            </div>
          </div>
        </div>
        <p className="mt-3 rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 italic">
          Le niveau de vérifiabilité reflète la traçabilité de la source, pas la vérité de l&apos;affirmation.
          PSL ne déclare aucune affirmation vraie ou fausse.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Politique d&apos;intégrité</h2>
        <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
          <li>Le texte extrait d&apos;un Statement n&apos;est jamais modifié après sa création.</li>
          <li>Les corrections ne s&apos;appliquent qu&apos;aux métadonnées (orateur, date, source, type).</li>
          <li>Toute modification est consignée publiquement dans l&apos;historique du Statement.</li>
          <li>Un Statement peut être marqué <em>contesté</em> avec motif public, jamais supprimé silencieusement.</li>
          <li>La suppression n&apos;est possible que sur obligation légale formelle et est consignée publiquement.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">6. Modèle de données</h2>
        <p className="text-sm text-slate-600">
          Le modèle de données <code className="rounded bg-slate-100 px-1 text-xs">Statement</code> est
          publié en open documentation. Chaque Statement expose la version du modèle LLM et du prompt
          utilisés pour son extraction.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Pour toute question sur la méthodologie :{' '}
          <a href="mailto:contact@psl.be" className="text-blue-600 hover:underline">
            contact@psl.be
          </a>
        </p>
      </section>
    </div>
  )
}
