export type AssertionType = 'fact_claim' | 'promise' | 'other'
export type Verifiability = 'strong' | 'medium' | 'low'
export type StatementStatus = 'active' | 'corrected' | 'contested' | 'archived'
export type SourceType = 'official' | 'media' | 'other'

export interface Speaker {
  id: string
  full_name: string
  function: string | null
  party: string | null
  status: 'active' | 'archived'
  created_at: string
}

export interface Source {
  id: string
  label: string
  source_type: SourceType
  url: string | null
  session_date: string | null
  created_at: string
}

export interface Revision {
  id: string
  statement_id: string
  field_changed: string
  old_value: string | null
  new_value: string | null
  reason: string | null
  changed_by: string | null
  changed_at: string
}

export interface Statement {
  id: string
  speaker_id: string
  source_id: string
  statement_date: string
  extracted_text: string
  assertion_type: AssertionType
  verifiability: Verifiability
  topic: string | null
  fingerprint: string | null
  raw_context: string | null
  source_url: string | null
  archive_link: string | null
  status: StatementStatus
  llm_model_version: string | null
  prompt_version: string | null
  created_at: string
  updated_at: string
  // Joins
  speaker?: Speaker
  source?: Source
  revisions?: Revision[]
}

export interface StatementWithRelations extends Statement {
  speaker: Speaker
  source: Source
  revisions: Revision[]
}

export interface SearchParams {
  q?: string
  speaker?: string
  from?: string
  to?: string
  type?: AssertionType
}
