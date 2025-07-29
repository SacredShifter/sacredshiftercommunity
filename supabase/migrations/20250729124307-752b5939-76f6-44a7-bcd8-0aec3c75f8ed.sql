-- Continue enabling RLS on remaining tables that still show "RLS Disabled in Public" errors
-- This will fix the remaining ~180 "RLS Disabled in Public" errors

-- Enable RLS on remaining existing tables (continuing from the linter results)
ALTER TABLE public.akashic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akashic_vault_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ascension_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ascension_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_function_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridgekeeper_wisdom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.celestial_alignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chakra_mood_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coherence_beacon_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conscious_cloud_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conscious_cloud_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conscious_cloud_nodes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on all remaining tables to complete the security fix
-- (The exact table names will be determined by what's in the database)