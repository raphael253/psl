# CLAUDE.md — Instructions pour Claude Code (PSL Project)

## Projet
**PSL (Public Statements Ledger)** — Corpus structuré de déclarations publiques institutionnelles belges.
Cible : journalistes d'investigation.

## Stack
- **Frontend** : Next.js + TypeScript + Tailwind (shadcn/ui)
- **DB** : Supabase (PostgreSQL + RLS + full-text search FR)
- **Workflows** : n8n (hébergé sur VPS, API accessible)
- **Hosting frontend** : Vercel
- **VPS** : Hostinger (n8n + OpenClaw)

## Accès & Credentials
Les credentials sont dans `../.env.psl` (un niveau au-dessus du repo).
Ne JAMAIS committer de credentials. Ne JAMAIS les afficher en clair dans les logs.

Variables disponibles :
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `N8N_URL`, `N8N_API_KEY`
- `GITHUB_TOKEN`
- `NOTION_TOKEN`
- `VERCEL_TOKEN`
- `AMPLITUDE_API_KEY`

## Architecture DB (Supabase)
Tables principales :
- `speakers` — Parlementaires (nom, parti, chambre)
- `statements` — Déclarations extraites (texte, type, vérifiabilité, source)
- `sources` — Documents source (URL, date, législature)
- `processed_urls` — URLs déjà traitées (déduplication)

Types de statements : `fact_claim`, `promise`, `position`, `commitment`, `other`
Vérifiabilité : `strong`, `medium`, `low`

## Conventions de code
- TypeScript strict
- Composants React fonctionnels
- Tailwind + shadcn/ui pour le styling
- Pas de `any` — typer correctement
- Commits conventionnels : `feat:`, `fix:`, `refactor:`, `docs:`
- Tests pour la logique métier critique

## Workflow n8n
Le workflow principal scrape les comptes rendus de la Chambre belge :
1. Fetch index des séances (HTML)
2. Parse et filtre les nouvelles séances
3. Scrape le texte complet de chaque séance
4. Parse les interventions (speaker, parti, texte)
5. LLM extraction des déclarations
6. Écriture en DB Supabase
7. Archivage (Wayback Machine)

API n8n : `$N8N_URL/api/v1/` avec header `X-N8N-API-KEY`

## Sécurité (PRIORITÉ ABSOLUE)
- Audience = journalistes d'investigation → cible potentielle
- JAMAIS exposer de données sensibles
- RLS activé sur toutes les tables
- Valider tous les inputs
- Logs : pas de données personnelles
- HTTPS obligatoire en production

## Anti-WAF — Convention pour tout workflow de scraping
Tout workflow n8n ou script qui scrape un site externe DOIT implémenter :
1. **Cookie warmup** — GET homepage avant tout scraping (établit la session)
2. **Headers réalistes** — User-Agent Chrome récent + Sec-Fetch-* + Referer cohérent
3. **Délais entre requêtes** — 3-5s minimum entre chaque page (Wait node ou sleep)
4. **Retry avec backoff** — retryOnFail=true, maxTries=3, waitBetweenTries=5000-10000ms

## Comment travailler
Tu reçois des briefs de Marie-Claire (CPTO). Chaque brief contient :
- Objectif clair
- Critères d'acceptation
- Contraintes techniques
- Fichiers concernés

Exécute le brief, teste, committe. En cas de doute, demande.
