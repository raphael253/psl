-- PSL — Schéma Supabase v1
-- Coller dans l'éditeur SQL de Supabase (Settings > SQL Editor)
-- ou via supabase db push

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  tier        text not null default 'pilot',
  status      text not null default 'active',
  created_at  timestamptz default now()
);

create table if not exists users (
  id          uuid primary key references auth.users,
  org_id      uuid not null references organizations(id),
  email       text not null,
  role        text not null default 'viewer',
  created_at  timestamptz default now()
);

create table if not exists speakers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  function    text,
  party       text,
  status      text not null default 'active',
  created_at  timestamptz default now()
);

create table if not exists sources (
  id           uuid primary key default gen_random_uuid(),
  label        text not null,
  source_type  text not null default 'official',
  url          text,
  session_date date,
  created_at   timestamptz default now()
);

create table if not exists statements (
  id                uuid primary key default gen_random_uuid(),
  speaker_id        uuid not null references speakers(id),
  source_id         uuid not null references sources(id),
  statement_date    date not null,
  extracted_text    text not null,
  assertion_type    text not null,
  verifiability     text not null,
  raw_context       text,
  source_url        text,
  archive_link      text,
  status            text not null default 'active',
  llm_model_version text,
  prompt_version    text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create table if not exists revisions (
  id            uuid primary key default gen_random_uuid(),
  statement_id  uuid not null references statements(id),
  field_changed text not null,
  old_value     text,
  new_value     text,
  reason        text,
  changed_by    uuid references users(id),
  changed_at    timestamptz default now()
);

create table if not exists error_reports (
  id            uuid primary key default gen_random_uuid(),
  statement_id  uuid not null references statements(id),
  reported_by   uuid references users(id),
  description   text not null,
  status        text not null default 'open',
  created_at    timestamptz default now()
);

-- ============================================================
-- INDEX
-- ============================================================

create index if not exists statements_fts
  on statements using gin(to_tsvector('french', extracted_text));

create index if not exists statements_speaker_id on statements(speaker_id);
create index if not exists statements_date on statements(statement_date desc);
create index if not exists statements_status on statements(status);

-- ============================================================
-- RLS
-- ============================================================

alter table statements   enable row level security;
alter table speakers     enable row level security;
alter table sources      enable row level security;
alter table revisions    enable row level security;
alter table error_reports enable row level security;

-- Lecture publique (pas d'auth requise pour statements/speakers/sources/revisions)
create policy "statements_public_read"   on statements   for select using (true);
create policy "speakers_public_read"     on speakers     for select using (true);
create policy "sources_public_read"      on sources      for select using (true);
create policy "revisions_public_read"    on revisions    for select using (true);

-- Écriture : admin uniquement
create policy "statements_admin_write" on statements
  for all using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

create policy "speakers_admin_write" on speakers
  for all using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

create policy "sources_admin_write" on sources
  for all using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

create policy "revisions_admin_write" on revisions
  for all using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- Error reports : tout utilisateur authentifié peut signaler
create policy "error_reports_auth_insert" on error_reports
  for insert with check (auth.uid() is not null);

create policy "error_reports_admin_read" on error_reports
  for select using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- SEED — Organisation initiale
-- ============================================================

insert into organizations (id, name, tier, status)
values ('00000000-0000-0000-0000-000000000001', 'PSL Pilot', 'pilot', 'active')
on conflict do nothing;
